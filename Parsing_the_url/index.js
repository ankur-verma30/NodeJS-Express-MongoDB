const fs = require('fs');
const http = require('http');
const url= require('url');

const server=http.createServer((req,res)=>{
    const {query,pathname}=url.parse(req.url,true);
    if(pathname==='/' || pathname==="/overview"){
        console.log(query);
        res.end('This is the overview');
    }
    else if (pathname==='/api'){
        fs.readFile('./data.json','utf-8',(err, data)=>{
            const productData=JSON.parse(data);
            console.log(productData);
            console.log(query);
            res.end(data);
        });
    }
    else if(pathname==='/products'){
        console.log(query);
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