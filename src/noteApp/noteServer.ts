import * as net from 'net';
import * as fs from 'fs';

/**
 * Creación del servidor 
 */
net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected.');
  // connection.write(JSON.stringify({'type': 'connected'}) +
  //    '\n');

  let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;
  });

  connection.on('close', () => {
    console.log('Un cliente ha abandonado la sesión');
  });

  connection.on('end', () => {
    let info = JSON.parse(wholeData);
    console.log('He recibido el texto de ' + info.user);
    let chat = info.user + ': ' + info.text;
    fs.appendFile('registro.txt', chat + '\n', function(err) {
      if (err) return console.log(err);
      console.log('Chat saved');
    });
    // connection.write()
  });
}).listen(60300, () => {
  console.log('Waiting people');
});

