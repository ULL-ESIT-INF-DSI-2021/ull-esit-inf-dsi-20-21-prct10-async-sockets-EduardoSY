// noteClient.ts
/**
 * Esta clase se encarga de dos cosas: Procesar la respuesta y enviar
 * peticiones al servidor.
 *
 * Primero establecemos la conexión con:
 * ```typescript
 * const client = connect({port: 60300});
 * ```
 * Con YARGS definimos los posibles comandos que acepta nuestra aplicación.
 * Una vez recibida la información lo que hacemos es enviar la petición al
 * servidor con los datos.
 *
 * La respuesta la recibimos en *clientMSEC* y, una vez ha obtenido
 * completamente el mensaje del servidor, emite un evento message que es captado
 * y analizado. Dependiendo del contenido de este evento mostramos la
 * información recibida.
 * @module
 */

import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {RequestType} from '../messageType';
import {connect} from 'net';
import {MessageEventEmitterClient} from './eventEmitterClient';

/**
 * Definicion de la conexión del cliente con el servidor
 */
const client = connect({port: 60300});
const clientMSEC = new MessageEventEmitterClient(client);

/**
 * Manejo del evento message emitido por la clase
 * MessageEventEmitterClient.
 */
clientMSEC.on('message', (message) => {
  switch (message.type) {
    case 'add':
      if (message.status) {
        console.log(chalk.green('Nota añadida exitosamente'));
      } else {
        console.log(chalk.red('La nota no pudo ser añadida'));
      }
      break;
    case 'remove':
      if (message.status) {
        console.log(chalk.green('Nota eliminada exitosamente'));
      } else {
        console.log(chalk.red('La nota no pudo ser eliminada'));
      }
      break;
    case 'modify':
      if (message.status) {
        console.log(chalk.green('Nota modificada exitosamente'));
      } else {
        console.log(chalk.red('La nota no pudo ser modificada'));
      }
      break;
    case 'read':
      if (message.status) {
        let nota = message.notas[0];
        let notaObj = JSON.parse(nota);
        console.log(chalk.keyword(notaObj.color)('>> TITULO -> ' +
          notaObj.title));
        console.log(chalk.keyword(notaObj.color)(notaObj.body));
      } else {
        console.log(chalk.red('La nota no pudo ser leida'));
      }
      break;
    case 'listar':
      if (message.status) {
        console.log(chalk.bgWhite.black('## NOTAS ENCONTRADAS ##'));
        let aux: string[] = message.notas;
        aux.forEach( (elemento) => {
          let notaObj = JSON.parse(elemento);
          console.log(chalk.keyword(notaObj.color)(notaObj.title));
        });
      }
      break;
  }
});

// ====================================================
// Interacción con el usuario por consola
// ====================================================

/**
 * Definicion del comando ADD
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.body === 'string' && typeof argv.color === 'string') {
      const inputData: RequestType = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
      console.log('Opcion: Add note');
      client.write(`${JSON.stringify(inputData)}\n`);
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

/**
 * Definicion del comando REMOVE
 */
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const inputData: RequestType = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      console.log('Opcion: Delete note');
      client.write(`${JSON.stringify(inputData)}\n`);
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

/**
 * Definicion del comando MODIFY
 */
yargs.command({
  command: 'modify',
  describe: 'Modify a note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' &&
    typeof argv.body === 'string' && typeof argv.color === 'string') {
      const inputData: RequestType = {
        type: 'modify',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
      console.log('Opcion: Modify note');
      client.write(`${JSON.stringify(inputData)}\n`);
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

/**
 * Definicion del comando READ
 */
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const inputData: RequestType = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
      console.log('Opcion: Read note');
      client.write(`${JSON.stringify(inputData)}\n`);
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

/**
 * Definicion del comando LIST
 */
yargs.command({
  command: 'list',
  describe: 'List all note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const inputData: RequestType = {
        type: 'list',
        user: argv.user,
      };
      console.log('Opcion: List note');
      client.write(`${JSON.stringify(inputData)}\n`);
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

yargs.parse();