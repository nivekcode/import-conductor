#!/usr/bin/env node
import chalk from 'chalk';
import commander from 'commander';
import * as fs from 'fs';
import * as gitChangedFiles from 'git-changed-files';
import { resolve, join } from 'path';
import ts from 'typescript';
import { promisify } from 'util';

import simpleGit, { SimpleGit } from 'simple-git';

import * as packageJSON from '../package.json';

import { getFilePathsFromRegex } from './regex-helper';

const git: SimpleGit = simpleGit();
const readFile = promisify(fs.readFile);
const opendir = promisify(fs.opendir);
const writeFile = promisify(fs.writeFile);

const collect = (value, previous) => previous.concat([value]);
commander
  .version(packageJSON.version)
  .option('-s --source <string>', 'path to the source files', './src/**/*.ts')
  .option('-p --userLibPrefixes <value>', 'the prefix of custom user libraries', collect, [])
  .option('--staged', 'run against staged files', false)
  .option('-d --disableAutoAdd', 'disable automatically adding the commited files when the staged option is used', false)
  .parse(process.argv);

interface ImportCategories {
  thirdPartyImportPot: Map<string, string>;
  userLibraryPot: Map<string, string>;
  differentUserModulePot: Map<string, string>;
  sameModulePot: Map<string, string>;
}

function categorizeImportLiterals(importLiterals: Map<string, string>): ImportCategories {
  const importCategories: ImportCategories = {
    thirdPartyImportPot: new Map<string, string>(),
    userLibraryPot: new Map<string, string>(),
    differentUserModulePot: new Map<string, string>(),
    sameModulePot: new Map<string, string>(),
  };
  importLiterals.forEach((fullImportStatement: string, importLiteral: string) => {
    if (importLiteral.startsWith(`'./`)) {
      importCategories.sameModulePot.set(importLiteral, fullImportStatement);
      return;
    }

    if (importLiteral.startsWith(`'..`)) {
      importCategories.differentUserModulePot.set(importLiteral, fullImportStatement);
      return;
    }

    if (isCustomImport(importLiteral)) {
      importCategories.userLibraryPot.set(importLiteral, fullImportStatement);
      return;
    }
    importCategories.thirdPartyImportPot.set(importLiteral, fullImportStatement);
  });
  return importCategories;
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
  for (const userLibraryPrefix of commander.userLibPrefixes) {
    if (literal.startsWith(`'${userLibraryPrefix}`)) {
      isCustomImport = true;
      break;
    }
  }
  return isCustomImport;
}

function formatImportStatements(importCategories: ImportCategories) {
  let result = '';

  function updateResult(sortedPot: Map<string, string>, spaceBefore = true) {
    if (sortedPot.size > 0 && spaceBefore) {
      result += '\n\n';
    }
    [...sortedPot.values()].forEach(
      (fullImportLiteral: string, index: number) =>
        (result += index === sortedPot.size - 1 ? `${fullImportLiteral}` : `${fullImportLiteral}\n`)
    );
  }

  updateResult(importCategories.thirdPartyImportPot, false);
  updateResult(importCategories.userLibraryPot, importCategories.thirdPartyImportPot.size > 0);
  updateResult(
    importCategories.differentUserModulePot,
    importCategories.thirdPartyImportPot.size > 0 || importCategories.userLibraryPot.size > 0
  );
  updateResult(
    importCategories.sameModulePot,
    importCategories.thirdPartyImportPot.size > 0 ||
      importCategories.userLibraryPot.size > 0 ||
      importCategories.differentUserModulePot.size > 0
  );
  return result;
}

function collectImportStatement(importSegments: any) {
  return importSegments.reduce((acc: string, segment: ts.Node) => {
    if (acc === '') {
      return segment.getText();
    }
    if (segment.getText() === ';') {
      return `${acc}${segment.getText()}`;
    }
    return `${acc} ${segment.getText()}`;
  }, '');
}

function collectImportNodes(rootNode: ts.Node): ts.Node[] {
  const importNodes: ts.Node[] = [];
  const traverse = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      importNodes.push(node);
    }
  };
  rootNode.forEachChild(traverse);
  return importNodes;
}

function getImportStatementMap(importNodes: ts.Node[]): Map<string, string> {
  const importStatementMap = new Map<string, string>();

  importNodes.forEach((node: ts.Node) => {
    const importSegments = node.getChildren();
    const completeImportStatement = collectImportStatement(importSegments);
    const importLiteral = importSegments.find((segment) => segment.kind === ts.SyntaxKind.StringLiteral)?.getText();

    if (!importLiteral) {
      return;
    }

    if (importStatementMap.get(importLiteral)) {
      importStatementMap.set(importLiteral, mergeImportStatements(importStatementMap.get(importLiteral), completeImportStatement));
    } else {
      importStatementMap.set(importLiteral, completeImportStatement);
    }
  });
  return importStatementMap;
}

export function mergeImportStatements(importStatementOne, importStatementTwo): string {
  const importedValues = importStatementTwo.match('{(.*)}')[1];
  return importStatementOne.replace('}', `,${importedValues}}`);
}

async function optimizeImports(filePath: string) {
  if (filePath.endsWith('.ts')) {
    const fileContent = await readFile(filePath);
    const rootNode = ts.createSourceFile(filePath, fileContent.toString(), ts.ScriptTarget.Latest, true);
    const importNodes = collectImportNodes(rootNode);
    const importStatementMap = getImportStatementMap(importNodes);

    if (importStatementMap.size > 0) {
      const categorizedImports = categorizeImportLiterals(importStatementMap);
      const sortedAndCategorizedImports = sortImportCategories(categorizedImports);
      let result = formatImportStatements(sortedAndCategorizedImports);

      let contentWithoutImportStatements = fileContent;

      importNodes
        .reverse()
        .forEach(
          (node: ts.Node) =>
            (contentWithoutImportStatements = Buffer.from(
              contentWithoutImportStatements.slice(0, node.pos) + '' + contentWithoutImportStatements.slice(node.end)
            ))
        );

      const updatedContent = `${result}${contentWithoutImportStatements}`;

      if (updatedContent !== fileContent.toString()) {
        await writeFile(filePath, updatedContent);
        console.log(chalk.blue(`import-conductor: ${filePath} (imports reordered)`));

        if (commander.staged && !commander.disableAutoAdd) {
          await git.add(filePath);
          console.log(chalk.cyan(`import-conductor: ${filePath} (added to git)`));
        }
      } else {
        console.log(chalk.gray(`import-conductor: ${filePath} (no change needed)`));
      }
    }
  }
}

(async () => {
  if (commander.staged) {
    let uncommittedFiles = (await gitChangedFiles({ showCommitted: false })).unCommittedFiles;
    for await (const p of uncommittedFiles) {
      await optimizeImports(p);
    }
  } else {
    const files = await getFilePathsFromRegex(commander.source);
    for await (const p of files) {
      await optimizeImports(p);
    }
  }
})();
