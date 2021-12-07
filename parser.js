let fs = require('fs');
let parser = require('./grammar');


fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
});