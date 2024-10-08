const fs = require('fs')
const superagent = require('superagent')

fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {

    console.log(`Breed : ${data}`)
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
        
        if (err) return console.log(err.message)
        console.log(`Breed : ${res.body.message}`)

        fs.writeFile('dog-img.txt', res.body.message, err => {
            console.log('Random dog image saved to file')
        })
    })
})