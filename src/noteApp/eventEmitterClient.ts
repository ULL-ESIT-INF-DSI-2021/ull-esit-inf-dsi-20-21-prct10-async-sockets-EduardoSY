// eventEmitterClient.ts
/**
 * El objetivo de esta clase es obtener toda la información
 * enviada por el servidor e ir acumulandola de tal manera que
 * si la información se envia fraccionada no supone ningún problema.
 * Cuando detectemos que el paquete ha llegado en su totalidad,
 * se emite un evento que denominamos MESSAGE. La emisión de este
 * evento nos permite tratar la información una vez estamos seguros
 * de que el paquete está completo.
 *
 * Determinamos que un paquete está completo cuando acaba con el caracter
 * de salto de linea o `\\n`;
 * @module
 */
import {EventEmitter} from 'events';

export class MessageEventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
