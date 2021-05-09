// noteServer.ts
/**
 * Este fichero contiene la creación y manipulación de eventos por parte del
 * servidor. Cuando se recibe una petición por parte del cliente, esta se
 * tramita y se invoca al comando correspondiente de la aplicación de nota.
 * Una vez completado este proceso, se devuelve una respuesta al cliente
 * en base a los resultados obtenidos.
 * @module
 */

import * as net from 'net';
import {ResponseType} from '../messageType';
import {UserNoteOptions} from './noteApp/userNoteOptions';
import chalk = require('chalk');

const noteOpt = new UserNoteOptions();

/**
 * Creació del servidor, donde se manejan tanto las conexiones como los
 * eventos recibidos y emitidos.
 */
net.createServer({allowHalfOpen: true}, (connection) => {
  console.log(chalk.bgGreen.black('A client has connected.'));

  let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;

    let messageLimit = wholeData.indexOf("\n");
    // console.log(wholeData);
    while (messageLimit !== -1) {
      const message = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      connection.emit('request', JSON.parse(message));
      messageLimit = wholeData.indexOf('\n');
    }
  });

  connection.on('request', (message) => {
    // console.log('DEBUG: Emit emitido y request recibido');
    console.log(chalk.bgWhite.black.bold('Peticion realizada >> ' +
      message.type));
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
        let status = noteOpt.modifyNote(message.user, message.title,
            message.body, message.color);
        const responseData: ResponseType = {
          type: 'modify',
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
      case 'read': {
        let status = noteOpt.readNote(message.user, message.title);
        const responseData: ResponseType = {
          type: 'read',
          status: true,
        };
        if (typeof status === 'boolean') {
          responseData.status = false;
        } else {
          responseData.notas = [status.noteToJSON()];
        }
        connection.write(`${JSON.stringify(responseData)}\n`, (err) => {
          if (err) {
            console.error(err);
          } else {
            connection.end();
          }
        });
      }
        break;
      case 'list': {
        let out = noteOpt.listNotes(message.user);
        let out2: string[] = [];
        out.forEach( (element) => {
          out2.push(element.noteToJSON());
        });
        connection.write(`${JSON.stringify(({type: 'listar', status: true,
          notas: out2}))}\n`, (err) => {
          if (err) {
            console.error(err);
          } else {
            connection.end();
          }
        });
      }
        break;
    }
  });

  connection.on('close', () => {
    console.log(chalk.bgGreen.black('Un cliente ha abandonado la sesión'));
  });
}).listen(60300, () => {
  console.log('Waiting people');
});

