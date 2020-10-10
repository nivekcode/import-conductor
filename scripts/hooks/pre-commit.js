const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const gitChangedFiles = require('git-changed-files');

gitChangedFiles({ showCommitted: false }).then(({ unCommittedFiles }) => preCommit(unCommittedFiles));

function forbiddenTokens(stagedFiles) {
  const FILES_REGEX = { ts: /\.ts$/, spec: /\.spec\.ts$/ };
  /** Map of forbidden tokens and their match regex */
  const forbiddenTokens = {
    fit: { rgx: /fit\(/, fileRgx: FILES_REGEX.spec },
    fdescribe: { rgx: /fdescribe\(/, fileRgx: FILES_REGEX.spec },
    '.skip': { rgx: /(describe|context|it)\.skip/, fileRgx: FILES_REGEX.spec },
    '.only': { rgx: /(describe|context|it)\.only/, fileRgx: FILES_REGEX.spec },
    debugger: { rgx: /(debugger);?/, fileRgx: FILES_REGEX.ts },
  };

  let status = 0;

  for (let [term, value] of Object.entries(forbiddenTokens)) {
    const { rgx, fileRgx, message } = value;
    /* Filter relevant files using the files regex */
    const relevantFiles = stagedFiles.filter((file) => fileRgx.test(file.trim()));
    const failedFiles = relevantFiles.reduce((acc, fileName) => {
      const filePath = path.resolve(process.cwd(), fileName);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath).toString('utf-8');
        if (rgx.test(content)) {
          status = 1;
          acc.push(fileName);
        }
      }
      return acc;
    }, []);

    /* Log all the failed files for this token with the matching message */
    if (failedFiles.length > 0) {
      const msg = message || `The following files contains '${term}' in them:`;
      console.log(chalk.bgRed.black.bold(msg));
      console.log(chalk.bgRed.black(failedFiles.join('\n')));
    }
  }

  return status;
}

function preCommit(stagedFiles) {
  let status = 0;
  const checks = [forbiddenTokens];
  for (const check of checks) {
    if (status !== 0) break;
    status = check(stagedFiles);
  }

  process.exit(status);
}
