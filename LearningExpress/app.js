const express=require('express');
const fs=require('fs');

const app=express();


const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
console.log(tours.tours.length)
console.log(tours)
app.get('/api/v1/tours',(req,res)=>{
    return res.status(200).json({
        status: 'success',
        results:tours.tours.length,
        message: 'All Tours',
        data:  tours.tours
        
    })})

const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}...`);
})