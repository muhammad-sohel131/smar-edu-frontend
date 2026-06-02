const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if(!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.match(/\.(jsx?|tsx?)$/)) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          if (line.includes('$')) {
            // Regex to find literal dollar signs that represent currency
            // >$ (e.g. >$10)
            // $> (wrong but maybe)
            // \$\d+ (e.g. $10)
            // \$\$\{ (e.g. `$${price}`)
            // >\$\{ (e.g. >${price})
            // \s\$\{ (e.g. " ${price}")
            // ^\s*\$\{
            if (line.match(/>\$|\$\d+|\$\$\{|>\s*\$\{|\s\$\{|^\s*\$\{/)) {
               console.log(file + ':' + (i+1) + ':' + line.trim());
            }
          }
        });
      }
    }
  });
  return results;
}
walk('./src');
