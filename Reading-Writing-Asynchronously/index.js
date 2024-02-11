//using the asynchronous way of non-blocking code
const fs = require("fs");

//callback has 2 arguments first is error and then the data itself error will be the first oe
fs.readFile("./stars.txt", "utf-8", (err, text) => {
  console.log(text);
});
console.log("Reading files......");

//using mulitple callbacks
fs.readFile("./stars.txt", "utf-8", (err, text1) => {
    if (err) return console.log(err);
  fs.readFile("./stars1.txt", "utf-8", (err, text2) => {
    console.log(text2);
    fs.readFile("./stars2.txt", "utf-8", (err, text3) => {
      console.log(text3);
      fs.readFile("./append.txt", "utf-8", (err, text4) => {
        fs.writeFile(
          "./final.txt",
          `${text1}\n${text2}\n\n${text3}\n\n${text4}`,
          "utf-8",
          (err) => {
            console.log(
              "File is written successfully inside the final.txt file"
            );
          }
        );
      });
    });
  });
});
console.log("Files written successfully");
