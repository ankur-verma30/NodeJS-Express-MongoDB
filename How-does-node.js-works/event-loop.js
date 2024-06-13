const fs = require('fs')

setTimeout(() => console.log('Timer 1 is finished'), 0)
setImmediate(() => console.log('Immedidate Timer 1 is finished'))


//to alter the size of the thread pool
process.env.UV_THREADPOOL_SIZE = 4;

fs.readFile('text-file.txt', (err, data) => {
    console.log('I/O is finished')
    console.log('---------------------------')
    setTimeout(() => console.log('Timer 2 is finished'), 0)
    setTimeout(() => console.log('Timer 3 is finished'), 3000)
    setImmediate(() => console.log('Immedidate Timer 2 is finished'))

    process.nextTick(() => console.log('process.nextTick'))
})

console.log('Hello from top-level code')
