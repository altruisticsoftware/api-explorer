const http = require('http');
const bodyParser = require('body-parser');
const converter = require('swagger2openapi');

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, cors);
    return res.end();
  }
  return bodyParser.json({ limit: '1mb' })(req, res, async () => {
    try {
      const oas = await converter.convertObj(req.body, {});
      res.writeHead(200, Object.assign({ 'content-type': 'application/json' }, cors));
      res.end(JSON.stringify(oas.openapi));
    } catch (e) {
      res.statusCode = 400;
      res.end(e.message);
    }
  });
}).listen(4000);