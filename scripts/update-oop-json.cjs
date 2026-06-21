const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'sets', 'oop.json');
const j = JSON.parse(fs.readFileSync(file,'utf8'));
j.phrases = j.phrases.map(ph=>{
  if(ph.audio && typeof ph.audio === 'string'){
    const m = ph.audio.match(/(question|answer)-(\d+)\.mp3$/);
    if(m){
      const base = m[1]; const num = parseInt(m[2],10); const newNum = String(num-1).padStart(2,'0');
      ph.audio = `audios/oop/${base}-${newNum}.mp3`;
    }
  }
  return ph;
});
fs.writeFileSync(file, JSON.stringify(j,null,2), 'utf8');
console.log('updated json');
