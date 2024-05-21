const fs = require('fs');
const http = require('http');
const url = require('url');

const overview = fs.readFileSync(`./index.html`, 'utf-8');
const data = fs.readFileSync('./data.json', 'utf-8');
const dataObj = JSON.parse(data);

const templateCard = (temp, product) => {
    let output = temp.replace(/{%ProductName%}/g, product.productName);
    output = output.replace(/{%from%}/g, product.from);
    output = output.replace(/{%ProductNutrients%}/g, product.nutrients);
    output = output.replace(/{%ProductQuantity%}/g, product.quantity);
    output = output.replace(/{%ProductDescription%}/g, product.description);
    return output;
}


const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/' || pathName === "/overview") {
        res.writeHead(200, { 'content-type': 'text/html', });
        const cardsHtml = dataObj.map(card => templateCard(overview, card)).join('');
        console.log(cardsHtml);
        res.end(cardsHtml);
    }
    else {
        res.writeHead(404, {
            'content-type': 'text/html'
        });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("Listening starting...");
});