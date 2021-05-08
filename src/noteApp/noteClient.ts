/**
 * Ejecución
 * 
 * ```
 * node dist/client2.js chat --user="Nombre" --text="Texto hermosote"
 * ```
 */


import {connect} from 'net';
// import {MessageEventEmitterClient} from './eventEmitterClient';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
const client = connect({port: 60300});
const clientMSEC = new MessageEventEmitterClient(client);

/**
  * Recibe el evento message y, dependiendo del tipo que sea
  * muestra un contenido y otro.
  */
clientMSEC.on('message', (message) => {
  if (message.type === 'connected') {
    console.log(`Connection established`);
  } else {
    console.log(`Message type ${message.type} is not valid`);
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
      // noteOpt.addNote(argv.user, argv.title, argv.body, argv.color);
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
      let nota = noteOpt.readNote(argv.user, argv.title);

      if (nota instanceof Note) {
        console.log(chalk.keyword(nota.getColor())(nota.getTitle()));
        console.log(chalk.keyword(nota.getColor())(nota.getBody()));
      }
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
      const notas: Note[] = noteOpt.listNotes(argv.user);
      console.log(chalk.bgGray.white('### Notas de ' + argv.user + ' ###'));
      notas.forEach((nota) => {
        console.log(chalk.keyword(nota.getColor())(nota.getTitle()));
      });
    } else {
      console.log(chalk.red('ERROR: Argumentos no validos'));
    }
  },
});

yargs.parse();