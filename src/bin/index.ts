import {resolve, join} from 'path';
import {promises} from 'fs';
import * as ts from 'typescript';

const userLibraryPrefixes = ['@custom'];

interface Pots {
    thirdPartyImportPot: string[];
    userLibraryPot: string[];
    differentUserModulePot: string[];
    sameModulePot: string[];
}

async function* walk(dir) {
    for await (const d of await promises.opendir(dir)) {
        const entry = join(dir, d.name);
        if (d.isDirectory()) yield* await walk(entry);
        else if (d.isFile()) yield entry;
    }
}

function splitLiteralsToPots(importLiterals: string[]): Pots {
    const pots: Pots = {
        thirdPartyImportPot: [],
        userLibraryPot: [],
        differentUserModulePot: [],
        sameModulePot: []
    }

    importLiterals.forEach((literal: string) => {
        if (literal.startsWith(`'./`)) {
            pots.sameModulePot.push(literal);
            return;
        }

        if (literal.startsWith(`'..`)) {
            pots.differentUserModulePot.push(literal);
            return;
        }

        if (isCustomImport(literal)) {
            pots.userLibraryPot.push(literal);
            return;
        }
        pots.thirdPartyImportPot.push(literal);
    });
    return pots;
}

function isCustomImport(literal: string): boolean {
    let isCustomImport = false;
    for (const userLibraryPrefix of userLibraryPrefixes) {
        if (literal.startsWith(`'${userLibraryPrefix}`)) {
            isCustomImport = true;
            break;
        }
    }
    return isCustomImport;
}

function sortPots(pots: Pots): Pots {
    const sortedPots: any = {};
    Object.keys(pots).forEach((potKey: string) => {
        sortedPots[potKey] = pots[potKey].sort();
    })
    return sortedPots;
}


(async () => {
    for await (const p of walk(resolve(__dirname, '../../test/'))) {

        const content = await promises.readFile(p);
        const rootNode = ts.createSourceFile(p, content.toString(), ts.ScriptTarget.Latest, true);

        const importNodes: ts.Node[] = [];
        const importStatementMap = {};

        const traverse = (node: ts.Node) => {
            if (ts.isImportDeclaration(node)) {
                const importSegments = node.getChildren();

                const importStatement = importSegments.reduce(
                    (acc: string, segment: ts.Node) => {
                        if (acc === '') {
                            return segment.getText();
                        }
                        if (segment.getText() === ';') {
                            return `${acc}${segment.getText()}`;
                        }
                        return `${acc} ${segment.getText()}`;
                    }, '');

                const importLiteral = importSegments.find(
                    segment => segment.kind === ts.SyntaxKind.StringLiteral
                )?.getText();
                importStatementMap[importLiteral] = importStatement;
                importNodes.push(node);
            }
        }
        rootNode.forEachChild(traverse);

        const pots = splitLiteralsToPots(Object.keys(importStatementMap));
        const sortedPots = sortPots(pots)

        let result = '';
        sortedPots.thirdPartyImportPot.forEach((thirdPartyImport: string) => result += `${importStatementMap[thirdPartyImport]}\n`);
        result += '\n';
        sortedPots.userLibraryPot.forEach((thirdPartyImport: string) => result += `${importStatementMap[thirdPartyImport]}\n`);
        result += '\n';
        sortedPots.differentUserModulePot.forEach((thirdPartyImport: string) => result += `${importStatementMap[thirdPartyImport]}\n`);
        result += '\n';
        sortedPots.sameModulePot.forEach((thirdPartyImport: string) => result += `${importStatementMap[thirdPartyImport]}\n`);

        const updatedContent =
            content.slice(0, importNodes[0].pos) +
            result +
            content.slice(importNodes[importNodes.length - 1].end);

        console.log('Done', updatedContent);
    }
})();


/*
const pot = {
    'rxjs': 'import {Observable} from "rxjs"',
  '@angular/testing': 'import {BeforeEach} from "@angular/core"',
  '@angular/core': 'import {Component} from "@angular/core"'
}

console.log(Object.keys(pot).sort().forEach(s => {
  console.log(pot[s]);
}));
 */
