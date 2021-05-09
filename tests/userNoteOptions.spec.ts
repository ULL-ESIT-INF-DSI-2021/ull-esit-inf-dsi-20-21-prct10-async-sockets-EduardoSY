import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/server/noteApp/note';
import {UserNoteOptions} from '../src/server/noteApp/userNoteOptions';
import * as fs from 'fs';

describe('Test userNoteOptions', () => {
  let userOpt = new UserNoteOptions();
  it('Se puede crear una nueva nota', () => {
    userOpt.addNote('Test', 'Nota_test', 'Esta es una nota de prueba', 'green');
    expect(fs.existsSync('db/Test/Nota_test.json')).true;
  });

  it('Si la nota ya existe, al intentar crearla devuelve un error', () => {
    expect(userOpt.addNote('Test', 'Nota_test',
        'Esta es una nota de prueba',
        'green')).to.be.false;
  });

  it('Se puede modificar una nota', () => {
    userOpt.modifyNote('Test', 'Nota_test',
        'Esta es una nota de prueba modificada', 'blue');
    expect(fs.existsSync('db/Test/Nota_test.json')).true;
    let info = fs.readFileSync('db/Test/Nota_test.json');
    expect(info.toString()).to.be.eql('{\n\"title\": \"Nota_test' +
    '\",\n\"body\": \"Esta es una nota de prueba modificada'+
    '\",\n\"color\": \"blue' + '\"\n}');
  });

  it('Se puede listar las notas de un usuario', () => {
    userOpt.addNote('Test', 'Nota_test2', 'Esta es una nota de prueba',
        'green');

    let nota1 = new Note('Nota_test',
        'Esta es una nota de prueba modificada', 'blue');
    let nota2 = new Note('Nota_test2', 'Esta es una nota de prueba',
        'green');
    expect(userOpt.listNotes('Test')).to.be.eql([nota1, nota2]);
  });

  it('Se puede leer una nota', () => {
    let nota1 = new Note('Nota_test',
        'Esta es una nota de prueba modificada', 'blue');
    expect(userOpt.readNote('Test', 'Nota_test')).to.be.eql(nota1);
  });

  it('Se puede eliminar una nota', () => {
    userOpt.removeNote('Test', 'Nota_test');
    userOpt.removeNote('Test', 'Nota_test2');

    expect(fs.existsSync('db/Test/Nota_test.json')).false;
    expect(fs.existsSync('db/Test/Nota_test2.json')).false;
  });

  it('Si la nota no existe, al intentar modificarla devuelve un error', () => {
    expect(userOpt.modifyNote('Test', 'Nota_test',
        'Esta es una nota de prueba modificada', 'blue')).to.be.false;
  });

  it('Si la nota no existe, al intentar leerla devuelve un error', () => {
    expect(userOpt.readNote('Test', 'Nota_test')).to.be.true;
  });

  it('Si la nota no existe, al intentar borrarla devuelve un error', () => {
    expect(userOpt.removeNote('Test', 'Nota_test2')).to.be.false;
  });
});

