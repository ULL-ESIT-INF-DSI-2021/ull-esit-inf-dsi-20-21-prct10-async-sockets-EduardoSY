import * as net from 'net';
import * as fs from 'fs';
import {Note} from './note';
import {ResponseType} from './messageType';


import {UserNoteOptions} from './userNoteOptions';

const noteOpt = new UserNoteOptions();

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

    let messageLimit = wholeData.indexOf("\n");
    console.log(wholeData);
    // console.log('SOY MSGLIMIT ' + messageLimit);
    while (messageLimit !== -1) {
      const message = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      connection.emit('request', JSON.parse(message));
      messageLimit = wholeData.indexOf('\n');
    }

    // console.log(wholeData);
  });

  connection.on('request', (message) => {
    console.log('DEBUG: Emit emitido y request recibido');
    switch (message.type) {
      case 'add': {
        let status = noteOpt.addNote(message.user, message.title, message.body,
            message.color);
        const responseData: ResponseType = {
          type: 'add',
          status: status,
        };
        connection.write(`${JSON.stringify(responseData)}\n`, (err) => {
          if (err) {
            console.error(err);
          } else {
            connection.end();
          }
        });
      }
        break;
      case 'remove': {
        let status = noteOpt.removeNote(message.user, message.title);
        const responseData: ResponseType = {
          type: 'remove',
          status: status,
        };
        connection.write(`${JSON.stringify(responseData)}\n`, (err) => {
          if (err) {
            console.error(err);
          } else {
            connection.end();
          }
        });
      }
        break;
      case 'modify': {
        let status = noteOpt.modifyNote(argv.user, argv.title, argv.body, argv.color);
        const responseData: ResponseType = {
          type: 'remove',
          status: status,
        };
        connection.write(`${JSON.stringify(responseData)}\n`, (err) => {
          if (err) {
            console.error(err);
          } else {
            connection.end();
          }
        });
      }
        break;
      case 'list':
        break;
      case 'read':
        break;
    }
  });

  connection.on('close', () => {
    console.log('Un cliente ha abandonado la sesión');
  });

  connection.on('end', () => {
    // let info = JSON.parse(wholeData);
    // console.log('He recibido el texto de ' + info.user);
    // let chat = info.user + ': ' + info.text;
    // fs.appendFile('registro.txt', chat + '\n', function(err) {
    //  if (err) return console.log(err);
    //  console.log('Chat saved');
    // });
    // connection.write()
  });
}).listen(60300, () => {
  console.log('Waiting people');
});

