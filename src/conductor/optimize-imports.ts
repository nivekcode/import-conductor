import ts from 'typescript';
import chalk from 'chalk';
import { getConfig } from '../config';
import simpleGit, { SimpleGit } from 'simple-git';
import { readFileSync, writeFileSync } from 'fs';
import { collectImportNodes } from './collect-import-nodes';
import { getImportStatementMap } from './get-import-statement-map';
import { categorizeImportLiterals } from './categorize-imports';
import { sortImportCategories } from './sort-import-categories';
import { formatImportStatements } from './format-import-statements';

const git: SimpleGit = simpleGit();

export const actions = {
  none: 'none',
  skipped: 'skipped',
  reordered: 'reordered',
};

export async function optimizeImports(filePath: string): Promise<string> {
  if (!/\.tsx?$/.test(filePath)) {
    return actions.none;
  }

  const fileContent = readFileSync(filePath);
  if (fileContent.includes('import-conductor-skip')) {
    return actions.skipped;
  }

  const { verbose, staged, autoAdd, dryRun } = getConfig();
  const rootNode = ts.createSourceFile(filePath, fileContent.toString(), ts.ScriptTarget.Latest, true);
  const importNodes = collectImportNodes(rootNode);
  const importStatementMap = getImportStatementMap(importNodes);

  if (importStatementMap.size === 0) {
    return actions.none;
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
  const log = (color: string, msg: string) => verbose && console.log(chalk[color](`${filePath} - ${msg}`));

  if (fileHasChanged) {
    !dryRun && writeFileSync(filePath, updatedContent);
    let msg = 'imports reordered';
    if (staged && autoAdd) {
      await git.add(filePath);
      msg += ', added to git';
    }
    log('green', msg);
  } else {
    log('gray', 'no change needed');
  }

  return fileHasChanged ? actions.reordered : actions.none;
}
