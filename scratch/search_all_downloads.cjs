const fs = require('fs');
const path = require('path');

function searchFiles(dir, filter) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        return; // skip broken symlinks etc.
      }
      if (stat && stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.gemini' && file !== '.agents') {
          results = results.concat(searchFiles(fullPath, filter));
        }
      } else {
        if (file.toLowerCase().includes(filter)) {
          results.push({ name: file, path: fullPath, size: stat.size });
        }
      }
    });
  } catch (e) {}
  return results;
}

const found = searchFiles('C:\\Users\\Admin\\Downloads', 'logo');
console.log('Found files:', JSON.stringify(found, null, 2));
