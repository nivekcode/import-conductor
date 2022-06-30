import { readFileSync, writeFileSync, existsSync } from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';
import ts from 'typescript';

import { getConfig } from '../config';
import { detectLineEnding } from '../helpers/line-ending-detector';
import { log } from '../helpers/log';

import { categorizeImportLiterals } from './categorize-imports';
import { collectImportNodes } from './collect-import-nodes';
import { collectNonImportNodes } from './collect-non-import-nodes';
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

export async function organizeImportsForFile(filePath: string): Promise<string> {
  // staged files might also include deleted files, we need to verify they exist.
  if (!/\.tsx?$/.test(filePath) || !existsSync(filePath)) {
    return actions.none;
  }

  let fileContent = readFileSync(filePath).toString();
  if (/\/[/*]\s*import-conductor-skip/.test(fileContent)) {
    log('gray', 'skipped (via comment)', filePath);
    return actions.skipped;
  }
  const { staged, autoAdd, dryRun } = getConfig();
  const fileWithOrganizedImports = await organizeImports(fileContent);
  const fileHasChanged = fileWithOrganizedImports !== fileContent;
  const isValidAction = [actions.none, actions.skipped].every((action) => action !== fileWithOrganizedImports);

  if (fileHasChanged && isValidAction) {
    !dryRun && writeFileSync(filePath, fileWithOrganizedImports);
    let msg = 'imports reordered';
    if (staged && autoAdd) {
      await git.add(filePath);
      msg += ', added to git';
    }
    log('green', msg, filePath);
    return actions.reordered;
  }

  log('gray', 'no change needed', filePath);
  return actions.none;
}

export async function organizeImports(fileContent: string): Promise<string> {
  const lineEnding = detectLineEnding(fileContent);
  if (/\/[/*]\s*import-conductor-skip/.test(fileContent)) {
    log('gray', 'Format skipped (via comment)');
    return actions.skipped;
  }

  let fileComment = getFileComment(fileContent);
  if (fileComment) {
    fileContent = fileContent.replace(fileComment, '');
  }

  const rootNode = ts.createSourceFile('temp', fileContent, ts.ScriptTarget.Latest, true);
  const importNodes = collectImportNodes(rootNode);
  const importStatementMap = getImportStatementMap(importNodes);
  if (importStatementMap.size === 0) {
    return actions.none;
  }

  const categorizedImports = categorizeImportLiterals(importStatementMap);
  const sortedAndCategorizedImports = sortImportCategories(categorizedImports);
  let updatedContent = formatImportStatements(sortedAndCategorizedImports, lineEnding);

  const lastImport = importNodes.pop();
  const contentWithoutImportStatements = fileContent.slice(lastImport.end);

  const nonImportNodes = collectNonImportNodes(rootNode, lastImport);
  if (nonImportNodes) {
    updatedContent += nonImportNodes.map((n) => n.getFullText()).join('');
  }

  updatedContent += contentWithoutImportStatements;

  if (fileComment) {
    updatedContent = `${fileComment}\n` + updatedContent;
  }
  return updatedContent;
}
