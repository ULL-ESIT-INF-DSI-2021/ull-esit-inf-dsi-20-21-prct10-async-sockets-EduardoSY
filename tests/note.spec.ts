import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/server/noteApp/note';


describe('Test notas', () => {
  let nota1 = new Note('Nota de prueba', 'Esto es una nota de prueba', 'green');
  let notafail = new Note('Nota de prueba fail', 'Esto es una nota de prueba',
      'white');
  it('La nota es una intancia de la clase nota', () => {
    expect(nota1).to.be.instanceOf(Note);
  });

  it('El titulo de la nota es << Nota de prueba >>', () => {
    expect(nota1.getTitle()).to.be.eql('Nota de prueba');
  });

  it('El cuerpo de la nota es << Esto es una nota de prueba >>', () => {
    expect(nota1.getBody()).to.be.eql('Esto es una nota de prueba');
  });

  it('El color de la nota es green', () => {
    expect(nota1.getColor()).to.be.eql('green');
  });

  it('Si el color no es valido se pode por defecto el rojo', () => {
    expect(notafail.getColor()).to.be.eql('red');
  });

  it('El titulo de la nota se puede cambiar a << Pruebita >>', () => {
    nota1.setTitle('Pruebita');
    expect(nota1.getTitle()).to.be.eql('Pruebita');
  });

  it('El cuerpo de la nota se puede cambiar a << Texto cambiado >>', () => {
    nota1.setBody('Texto cambiado');
    expect(nota1.getBody()).to.be.eql('Texto cambiado');
  });

  it('El color de la nota se puede cambiar a Rojo', () => {
    nota1.setColor('red');
    expect(nota1.getColor()).to.be.eql('red');
  });
});

