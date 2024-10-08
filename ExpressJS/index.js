const express = require('express');
const fs = require('fs');


const app = express();
app.use(express.json()); //this is middleware

//callback function as second argument after determing the route

// app.get('/', (req, res) => {
//     // res.status(200).send('Hello from the server');
//     res.status(200).json({ message: 'Hello from the server', app: 'ExpressJS' })
// })

// app.post('/',(req,res)=>{
//     res.send('You can post here to this url...')
// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })
})

app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
             tour: newTour 2a
        })
    })
})

const port = 3000
app.listen(port, () => {
    console.log(`Server Started App running on the ${port} ...`);
})

