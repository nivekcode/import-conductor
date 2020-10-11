import { readFileSync, writeFileSync, existsSync } from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';
import ts from 'typescript';

import { getConfig } from '../config';
import { log } from '../helpers/log';

import { collectNonImportNodes } from './collect-non-import-nodes';
import { categorizeImportLiterals } from './categorize-imports';
import { collectImportNodes } from './collect-import-nodes';
import { formatImportStatements } from './format-import-statements';
import { getImportStatementMap } from './get-import-statement-map';
import { sortImportCategories } from './sort-import-categories';

const git: SimpleGit = simpleGit();

export const actions = {
  none: 'none',
  skipped: 'skipped',
  reordered: 'reordered',
};

function getFileComment(fileContent: string): string {
  const fileComment = /^(?:(\/\/.*)|(\/\*[^]*?\*\/))/.exec(fileContent);
  if (fileComment) {
    const [singleLine, multiLine] = fileComment;
    return singleLine || multiLine;
  }

  return '';
}

export async function optimizeImports(filePath: string): Promise<string> {
  // staged files might also include deleted files, we need to verify they exist.
  if (!/\.tsx?$/.test(filePath) || !existsSync(filePath)) {
    return actions.none;
  }

  let fileContent = readFileSync(filePath).toString();
  const { staged, autoAdd, dryRun } = getConfig();
  if (/\/[/*]\s*import-conductor-skip/.test(fileContent)) {
    log('gray', filePath, 'skipped (via comment)');
    return actions.skipped;
  }

  let fileComment = getFileComment(fileContent);
  // Remove the comment from the file content.
  if (fileComment) {
    fileContent = fileContent.replace(fileComment, '');
  }

  const rootNode = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);
  const importNodes = collectImportNodes(rootNode);
  const importStatementMap = getImportStatementMap(importNodes);
  if (importStatementMap.size === 0) {
    return actions.none;
  }

  const categorizedImports = categorizeImportLiterals(importStatementMap);
  const sortedAndCategorizedImports = sortImportCategories(categorizedImports);
  let updatedContent = formatImportStatements(sortedAndCategorizedImports);

  const lastImport = importNodes.pop();
  const contentWithoutImportStatements = fileContent.slice(lastImport.end);

  // Add back code blocks that were between the import statements
  const nonImportNodes = collectNonImportNodes(rootNode, lastImport);
  if (nonImportNodes) {
    updatedContent += nonImportNodes.map((n) => n.getFullText()).join('');
  }

  updatedContent += contentWithoutImportStatements;

  if (fileComment) {
    // Add the comment back to the file content.
    fileContent = `${fileComment}${fileContent}`;
    updatedContent = `${fileComment}\n` + updatedContent;
  }

  const fileHasChanged = updatedContent !== fileContent;
  if (fileHasChanged) {
    !dryRun && writeFileSync(filePath, updatedContent);
    let msg = 'imports reordered';
    if (staged && autoAdd) {
      await git.add(filePath);
      msg += ', added to git';
    }
    log('green', filePath, msg);
  } else {
    log('gray', filePath, 'no change needed');
  }

  return fileHasChanged ? actions.reordered : actions.none;
}
