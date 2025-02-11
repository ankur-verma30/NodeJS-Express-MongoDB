const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'})
const app=require('./app')


const PORT = process.env.PORT || 3000;

console.log(app.get('env'))  //development  env is a global variable
// console.log(process.env); //showing all the variables of the config.env files

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

