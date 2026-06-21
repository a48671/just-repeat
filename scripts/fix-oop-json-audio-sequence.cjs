const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'sets', 'oop.json');
const j = JSON.parse(fs.readFileSync(file,'utf8'));
const totalPairs = Math.floor(j.phrases.length/2);
for(let i=0;i<totalPairs;i++){
  const qIndex = 2*i;
  const aIndex = 2*i+1;
  const num = String(i).padStart(2,'0');
  if(j.phrases[qIndex]) j.phrases[qIndex].audio = `audios/oop/question-${num}.mp3`;
  if(j.phrases[aIndex]) j.phrases[aIndex].audio = `audios/oop/answer-${num}.mp3`;
}
fs.writeFileSync(file, JSON.stringify(j,null,2),'utf8');
console.log('rewritten', totalPairs, 'pairs');
