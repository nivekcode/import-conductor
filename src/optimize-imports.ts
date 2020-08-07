import ts from 'typescript';
import chalk from 'chalk';
import { getConfig } from './config';
import simpleGit, { SimpleGit } from 'simple-git';
import { promisify } from 'util';
import fs from 'fs';
import { collectImportNodes } from './collect-import-nodes';
import { getImportStatementMap } from './get-import-statement-map';
import { categorizeImportLiterals } from './categorize-imports';
import { sortImportCategories } from './sort-import-categories';
import { formatImportStatements } from './format-import-statements';

const git: SimpleGit = simpleGit();
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function optimizeImports(filePath: string) {
  let reordered = 0;
  if (/\.tsx?$/.test(filePath)) {
    const { silent, staged, autoAdd } = getConfig();
    const fileContent = await readFile(filePath);
    const rootNode = ts.createSourceFile(filePath, fileContent.toString(), ts.ScriptTarget.Latest, true);
    const importNodes = collectImportNodes(rootNode);
    const importStatementMap = getImportStatementMap(importNodes);

    if (importStatementMap.size === 0) {
      return reordered;
    }

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
    const fileHasChanged = updatedContent !== fileContent.toString();
    const log = (color: string, msg: string) => !silent && console.log(chalk[color](`import-conductor: ${filePath} (${msg})`));

    if (fileHasChanged) {
      reordered = 1;
      await writeFile(filePath, updatedContent);
      log('green', 'imports reordered');
      if (staged && !autoAdd) {
        await git.add(filePath);
        log('cyan', 'added to git');
      }
    } else {
      log('gray', 'no change needed');
    }
  }

  return reordered;
}
