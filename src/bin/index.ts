import {resolve, join} from 'path';
import {promises} from 'fs';
import * as ts from 'typescript';

const userLibraryPrefixes = ['@custom'];

interface ImportCategories {
    thirdPartyImportPot: Map<string, string>;
    userLibraryPot: Map<string, string>;
    differentUserModulePot: Map<string, string>;
    sameModulePot: Map<string, string>;
}

interface ImportInformation {
    importStatementMap: Map<string, string>,
    startPosition: number;
    endPosition: number;
}

async function* walk(dir: string): any {
    for await (const d of await promises.opendir(dir)) {
        const entry = join(dir, d.name);
        if (d.isDirectory()) {
            yield* await walk(entry);
        } else if (d.isFile()) {
            yield entry;
        }
    }
}

function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
    const pots: ImportCategories = {
        thirdPartyImportPot: new Map<string, string>(),
        userLibraryPot: new Map<string, string>(),
        differentUserModulePot: new Map<string, string>(),
        sameModulePot: new Map<string, string>()
    }
    importLiterals.forEach((fullImportStatement: string, importLiteral: string) => {
        if (importLiteral.startsWith(`'./`)) {
            pots.sameModulePot.set(importLiteral, fullImportStatement);
            return;
        }

        if (importLiteral.startsWith(`'..`)) {
            pots.differentUserModulePot.set(importLiteral, fullImportStatement);
            return;
        }

        if (isCustomImport(importLiteral)) {
            pots.userLibraryPot.set(importLiteral, fullImportStatement);
            return;
        }
        pots.thirdPartyImportPot.set(importLiteral, fullImportStatement);
    });
    return pots;
}

function sortImportCategories(importCategories: ImportCategories): ImportCategories {
    return {
        thirdPartyImportPot: new Map([...importCategories.thirdPartyImportPot].sort()),
        userLibraryPot: new Map([...importCategories.userLibraryPot].sort()),
        differentUserModulePot: new Map([...importCategories.differentUserModulePot].sort()),
        sameModulePot: new Map([...importCategories.sameModulePot].sort()),
    };
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

function formatImportStatements(sortedPots: ImportCategories) {
    let result = '';

    function updateResult(sortedPot: Map<string, string>, spaceBefore = true) {
        if (sortedPot.size > 0 && spaceBefore) {
            result += '\n\n';
        }
        [...sortedPot.values()].forEach((fullImportLiteral: string, index: number) =>
            result += index === sortedPot.size - 1 ? `${fullImportLiteral}` : `${fullImportLiteral}\n`);
    }

    updateResult(sortedPots.thirdPartyImportPot, false);
    updateResult(sortedPots.userLibraryPot);
    updateResult(sortedPots.differentUserModulePot);
    updateResult(sortedPots.sameModulePot);
    return result;
}

function collectImportStatement(importSegments: any) {
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

function getImportInformation(rootNode: ts.Node): ImportInformation {
    const importNodes: ts.Node[] = [];
    const importStatementMap = new Map<string, string>();

    const traverse = (node: ts.Node) => {
        if (ts.isImportDeclaration(node)) {
            const importSegments = node.getChildren();
            const completeImportStatement = collectImportStatement(importSegments);
            const importLiteral = importSegments.find(
                segment => segment.kind === ts.SyntaxKind.StringLiteral
            )?.getText();
            if (importLiteral) {
                importStatementMap.set(importLiteral, completeImportStatement);
            }
            importNodes.push(node);
        }
    }
    rootNode.forEachChild(traverse);
    return {importStatementMap, startPosition: importNodes[0]?.pos, endPosition: importNodes[importNodes?.length - 1]?.end}
}

(async () => {
    for await (const p of walk(resolve(__dirname, '../../test'))) {
        const fileContent = await promises.readFile(p);
        const rootNode = ts.createSourceFile(p, fileContent.toString(), ts.ScriptTarget.Latest, true);
        const importInformation = getImportInformation(rootNode);

        if (importInformation.importStatementMap.size > 0) {
            const categorizedImports = categorizeImportLiterals(importInformation.importStatementMap);
            const sortedAndCategorizedImports = sortImportCategories(categorizedImports);
            let result = formatImportStatements(sortedAndCategorizedImports);

            const updatedContent =
                fileContent.slice(0, importInformation.startPosition) +
                result +
                fileContent.slice(importInformation.endPosition);

            if (updatedContent !== fileContent.toString()) {
                // await promises.writeFile(p, updatedContent);
                console.log('New content', updatedContent);
            }
            console.log('Done');
        }
    }
})();
