import fs from 'fs';
import https from 'https';
import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola desde HTTPS + TypeScript en M1!');
});

const options = {
  key:  fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(options, app)
  .listen(3443, () => {
    console.log('Servidor HTTPS escuchando en <https://localhost:3443>');
  });