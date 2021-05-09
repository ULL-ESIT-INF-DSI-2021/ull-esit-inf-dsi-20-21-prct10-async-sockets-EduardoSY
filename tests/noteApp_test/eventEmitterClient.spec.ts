import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../../src/noteApp/eventEmitterClient';

describe('MessageEventEmitterClient', () => {
  it('Una vez se tenga el mensaje completo se debe emitir un evento message',
      (done) => {
        const socket = new EventEmitter();
        const client = new MessageEventEmitterClient(socket);

        client.on('message', (message) => {
          expect(message).to.be.eql({'type': 'add', 'status': true});
          done();
        });

        socket.emit('data', '{"type": "add"');
        socket.emit('data', ', "status": true}');
        socket.emit('data', '\n');
      });
});
