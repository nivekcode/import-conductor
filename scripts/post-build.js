const fs = require('fs');

const { scripts, devDependencies, husky, ...cleanPackage } = JSON.parse(fs.readFileSync('package.json').toString());
fs.writeFileSync('dist/package.json', JSON.stringify(cleanPackage, null, 2));
