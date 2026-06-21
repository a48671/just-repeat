const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'audio', 'oop');
function normalize(prefix, count){
  const files = fs.readdirSync(p).filter(f=>f.startsWith(prefix) && f.endsWith('.mp3'))
    .map(f=>({f, mtime: fs.statSync(path.join(p,f)).mtime.getTime()}))
    .sort((a,b)=>a.mtime-b.mtime)
    .map(x=>x.f);
  console.log(prefix, 'found', files.length);
  // rename to tmp to avoid conflicts
  files.forEach((f,i)=>{
    fs.renameSync(path.join(p,f), path.join(p,`tmp-${prefix}-${i}.mp3`));
  });
  // now rename tmp to final
  const tmpFiles = fs.readdirSync(p).filter(f=>f.startsWith(`tmp-${prefix}-`)).sort();
  tmpFiles.forEach((tf,i)=>{
    const newName = `${prefix}-${String(i).padStart(2,'0')}.mp3`;
    fs.renameSync(path.join(p,tf), path.join(p,newName));
    console.log('->', newName);
  });
}
normalize('question');
normalize('answer');
console.log('done');
