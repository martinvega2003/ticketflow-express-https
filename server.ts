import fs from 'fs';
import https from 'https';
import app from './app.js';

const options = {
  key:  fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(options, app)
  .listen(3443, () =>
    console.log('Servidor HTTPS escuchando en <https://localhost:3443>')
  );