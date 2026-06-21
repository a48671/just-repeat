const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'audio', 'oop');
const files = fs.readdirSync(p).filter(f => /(question|answer)-\d+\.mp3/.test(f));
files.forEach(f => fs.renameSync(path.join(p, f), path.join(p, 'tmp-' + f))); 
fs.readdirSync(p).filter(f => /tmp-(question|answer)-\d+\.mp3/.test(f)).forEach(f => {
  const m = f.match(/tmp-(question|answer)-(\d+)\.mp3/);
  const base = m[1];
  const num = parseInt(m[2], 10);
  const newNum = String(num - 1).padStart(2, '0');
  const newName = `${base}-${newNum}.mp3`;
  fs.renameSync(path.join(p, f), path.join(p, newName));
});
console.log('renamed');
