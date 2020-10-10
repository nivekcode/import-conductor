const fs = require('fs');
const { execSync } = require('child_process');

const { version } = JSON.parse(fs.readFileSync('package.json').toString());
fs.writeFileSync('src/version.ts', `export const packageVersion = '${version}';\n`);
execSync('git add src/version.ts');
execSync('git commit --amend --no-edit --no-verify');
