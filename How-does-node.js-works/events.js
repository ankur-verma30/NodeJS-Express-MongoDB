const EventEmitter = require('events')
const http = require('http')

class Sales extends EventEmitter {
    constructor() {
        super();
    }
}
const myEmitter = new Sales();
myEmitter.on('newSale', () => {
    console.log('There is a new sale')
})

myEmitter.on('newSale', () => { console.log('Name is Ankur Verma') })
myEmitter.on('newSale', stock => {
    console.log(`This is the new value = ${stock}`)
})
myEmitter.emit('newSale', 10)

//

const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request Recieved!')
    console.log(req.url)
    res.end('Request Recieved!')
})

server.on('request', (req, res) => {
    console.log('Another Request Recieved!')

})


server.on('close', () => {
    console.log('Server Closed')
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for the request...')
})