const fs=require('fs');//filesystem module is required

//this is reading from files in synchronous mode
const Text=fs.readFileSync('./input.txt', 'utf-8');
console.log(Text);

//writing text to the file

const textOut=`This is the text that we will print by adding the above text we are reading: ${Text}. \n Written on ${Date.now()}`;
fs.writeFileSync('./output.txt',textOut);
console.log("Files written");
