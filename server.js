const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/testfile')) {
        const size = parseInt(new URL(req.url, 'http://localhost').searchParams.get('size')) || 5*1024*1024;
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': size
        });
        res.end(Buffer.alloc(size));
    } 
    else if (req.url === '/upload' && req.method === 'POST') {
        let bytes = 0;
        req.on('data', chunk => bytes += chunk.length);
        req.on('end', () => {
            res.writeHead(200);
            res.end();
        });
    }
    else {
        // Serve static files
        const filePath = '.' + req.url;
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    }
});

server.listen(8000, '0.0.0.0', () => {
    console.log('Server running on port 8000');
});