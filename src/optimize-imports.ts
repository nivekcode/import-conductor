import ts from 'typescript';
import chalk from 'chalk';
import commander from 'commander';
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
