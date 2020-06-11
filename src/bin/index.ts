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

        if(isCustomImport(literal)){
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


(async () => {
    for await (const p of walk(resolve(__dirname, '../../test/'))) {

        const content = await promises.readFile(p);
        const rootNode = ts.createSourceFile(p, content.toString(), ts.ScriptTarget.Latest, true);

        const importNodes: ts.Node[] = [];
        const importLiterals: string[] = [];

        const traverse = (node: ts.Node) => {
            if (ts.isImportDeclaration(node)) {
                const importSegments = node.getChildren();
                importLiterals.push(importSegments.find(
                    segment => segment.kind === ts.SyntaxKind.StringLiteral
                )?.getText());
                importNodes.push(node);
            }
        }
        rootNode.forEachChild(traverse);

        const pots = splitLiteralsToPots(importLiterals);
        console.log('Pots', pots);

        console.log('Start', importNodes[0].pos);
        console.log('End', importNodes[importNodes.length - 1].pos);

        const updatedContent =
            content.slice(0, importNodes[0].pos) +
            'updated' +
            content.slice(importNodes[importNodes.length - 1].end);

        console.log('Done', updatedContent);

    }
})();

