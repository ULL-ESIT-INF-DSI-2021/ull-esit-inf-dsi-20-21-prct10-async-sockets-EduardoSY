import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {RequestType} from './messageType';

import {connect} from 'net';
import {MessageEventEmitterClient} from './eventEmitterClient';

const client = connect({port: 60300});
const clientMSEC = new MessageEventEmitterClient(client);

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
        console.log(chalk.green('Nota añadida exitosamente'));
      } else {
        console.log(chalk.red('La nota no pudo ser añadida'));
      }
      break;
    case 'read':
      if (message.status) {
        console.log(chalk.green('Nota añadida exitosamente'));
      } else {
        console.log(chalk.red('La nota no pudo ser añadida'));
      }
      break;
    case 'list':
      if (message.status) {
        console.log(chalk.green('Nota añadida exitosamente'));
      } else {
        console.log(chalk.red('La nota no pudo ser añadida'));
      }
      break;
  }
});

/** Interacción con el usuario por consola */

/* He intentado hacer que el usuario pueda introducir diversos mensajes
 una vez ha establecido la conexión pero no he sabido como hacerlo. Por lo 
 tanto, lo unico que se puede hacer es establecer la conexión indicanto un 
 usuario y un mensaje. */
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
      // noteOpt.addNote(argv.user, argv.title, argv.body, argv.color);
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
      // noteOpt.removeNote(argv.user, argv.title);
      const inputData: RequestType = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      // noteOpt.addNote(argv.user, argv.title, argv.body, argv.color);
      client.write(`${JSON.stringify(inputData)}\n`);
      console.log('Opcion: Delete note');
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
      // noteOpt.modifyNote(argv.user, argv.title, argv.body, argv.color);
      console.log('Opcion: Modify note');
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
      console.log('Opcion: Read note');
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
      console.log('Opcion: List notes');
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

yargs.parse();