const fs = require('fs');
const http = require('http');
const url= require('url');

const server=http.createServer((req,res)=>{
    // console.log(req);
    // console.log(req.url);
    const pathName = req.url;
    if(pathName==='/' || pathName==="/overview"){
        res.end('This is the overview');
    }
    else if (pathName==='/api'){
        fs.readFile('./data.json','utf-8',(err, data)=>{
            const productData=JSON.parse(data);
            console.log(productData);
            res.end(data);
        });
    }
    else if(pathName==='/products'){
        res.end('This is a product');
    }
    else{
        res.writeHead(404,{
            'content-type':'text/html'
        });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(8000,'127.0.0.1',()=>{
console.log("Listening starting...");
});