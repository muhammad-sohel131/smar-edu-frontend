const fs = require('fs');
const path = require('path');
function walk(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if(!file.includes('node_modules') && !file.includes('.next')) {
        count += walk(file);
      }
    } else {
      if (file.match(/\.(jsx?|tsx?)$/)) {
        let content = fs.readFileSync(file, 'utf8');
        const original = content;

        // 1. $ followed by digits (e.g. $50, $ 50)
        content = content.replace(/\$\s*(?=\d+)/g, '৳');
        
        // 2. > followed by optional whitespace and $ (JSX text node start)
        content = content.replace(/>(\s*)\$/g, '>$1৳');

        // 3. `$$` inside template literals
        content = content.replace(/`\$\$\{/g, '`৳${');
        content = content.replace(/`\$\s*\$\{/g, '`৳ ${');

        // 4. "Price: $" or "Fee: $" or "- $"
        content = content.replace(/(Price|Fee|Total|Subtotal):\s*\$/gi, '$1: ৳');
        content = content.replace(/-\s*\$(?=\{)/g, '- ৳');
        
        // 5. Replace USD with BDT
        content = content.replace(/\bUSD\b/g, 'BDT');

        // 6. $ at the beginning of a line (JSX text)
        content = content.replace(/^(\s*)\$(?=\{)/gm, '$1৳');
        
        // 7. Literal strings containing $ at start
        content = content.replace(/(['"]\s*)\$(?=\s*\{|\s*\d)/g, '$1৳');
        
        // 8. ( $ ) in JSX
        content = content.replace(/\((\s*)\$(?=\s*\{|\s*\d)/g, '($1৳');
        
        // 9.  : $ (inside JSX text or objects? safer to use lookaheads)
        // e.g. <span>: ${price}</span>
        content = content.replace(/:\s*\$(?=\s*\{)/g, ': ৳');

        if (content !== original) {
           fs.writeFileSync(file, content);
           console.log("Updated: " + file);
           count++;
        }
      }
    }
  });
  return count;
}
const updatedCount = walk('./src');
console.log("Total files updated:", updatedCount);
