import {resolve, join} from 'path';
import {promises} from 'fs';
import * as ts from 'typescript';

const userLibraryPrefixes = ['@custom'];

interface ImportCategories {
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

function categorizeImportLiterals(importLiterals: string[]): ImportCategories {
    const pots: ImportCategories = {
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

function sortPots(pots: ImportCategories): ImportCategories {
    const sortedPots: any = {};
    Object.keys(pots).forEach((potKey: string) => {
        sortedPots[potKey] = pots[potKey].sort();
    })
    return sortedPots;
}


function formatImportStatements(sortedPots: ImportCategories, importStatementMap: {}) {
    let result = '';

    function updateResult(sortedPot: string[], spaceBefore = true){
        if(sortedPot.length > 0 && spaceBefore){
            result += '\n';
        }

        sortedPot.forEach((thirdPartyImport: string, index: number) => {
            if (index === sortedPots.thirdPartyImportPot.length - 1) {
                result += `${importStatementMap[thirdPartyImport]}`;
                return;
            }
            result += `${importStatementMap[thirdPartyImport]}\n`
        });
    }

    updateResult(sortedPots.thirdPartyImportPot, false);
    updateResult(sortedPots.userLibraryPot);
    updateResult(sortedPots.differentUserModulePot);
    updateResult(sortedPots.sameModulePot);

    return result;
}

function collectImportStatement(importSegments) {
    return importSegments.reduce(
        (acc: string, segment: ts.Node) => {
            if (acc === '') {
                return segment.getText();
            }
            if (segment.getText() === ';') {
                return `${acc}${segment.getText()}`;
            }
            return `${acc} ${segment.getText()}`;
        }, '');
}

function containsImportStatements(importStatementMap: {}) {
    return Object.keys(importStatementMap).length !== 0;
}

(async () => {
    for await (const p of walk(resolve(__dirname, '../../test'))) {
        const fileContent = await promises.readFile(p);
        const rootNode = ts.createSourceFile(p, fileContent.toString(), ts.ScriptTarget.Latest, true);

        const importNodes: ts.Node[] = [];
        const importStatementMap = {};

        const traverse = (node: ts.Node) => {
            if (ts.isImportDeclaration(node)) {
                const importSegments = node.getChildren();
                const completeImportStatement = collectImportStatement(importSegments);
                const importLiteral = importSegments.find(
                    segment => segment.kind === ts.SyntaxKind.StringLiteral
                )?.getText();
                importStatementMap[importLiteral] = completeImportStatement;
                importNodes.push(node);
            }
        }
        rootNode.forEachChild(traverse);

        if (containsImportStatements(importStatementMap)) {
            const pots = categorizeImportLiterals(Object.keys(importStatementMap));
            const sortedPots = sortPots(pots)

            let result = formatImportStatements(sortedPots, importStatementMap);

            const updatedContent =
                fileContent.slice(0, importNodes[0].pos) +
                result +
                fileContent.slice(importNodes[importNodes.length - 1].end);

            if(updatedContent !== fileContent.toString()){
                // await promises.writeFile(p, updatedContent);
                console.log('New content', updatedContent);
            }
            console.log('Done');
        }
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
