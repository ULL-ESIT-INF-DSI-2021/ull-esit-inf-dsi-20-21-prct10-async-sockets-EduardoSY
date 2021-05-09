
export type colors = 'red'|'yellow'|'blue'|'green';
import * as chalk from 'chalk';


/**
 * Clase Note. Nos permite representar una nota.
 */
export class Note {
  /**
   * Constructor de la clase Note
   * @param title Titulo de la nota
   * @param body Texto que contiene la nota
   * @param color Color de la nota. En caso de que se ponga un valor distinto
   * a los mencionados, ponemos el rojo.
   */
  private color: string;
  private possibleColors: string[] = ['red', 'yellow', 'blue', 'green'];
  constructor(private title: string, private body: string,
      colorsito: string) {
    try {
      if (!this.possibleColors.includes(colorsito)) {
        this.color = 'red';
        throw new Error('El color no era valido asi que'+
        ' pondremos el rojo por defecto');
      } else {
        this.color = colorsito;
      }
    } catch (err) {
      console.log(chalk.red(err.message));
    }
  }

  /**
   * Setter. Permite establecer titulo
   * @param title Titulo de la nota.
   */
  setTitle(title: string): void {
    this.title = title;
  }
  /**
   * Setter. Permite establecer color
   * @param color Color de la nota
   */
  setColor(color: colors): void {
    this.color = color;
  }

  /**
   * Setter. Permite establecer el texto de la nota
   * @param body Texto de la nota
   */
  setBody(body: string): void {
    this.body = body;
  }

  /**
   * Getter. Devuelve el titulo
   * @returns Titulo
   */
  getTitle():string {
    return this.title;
  }

  /**
   * Getter. Devuelve el color
   * @returns Color
   */
  getColor():string {
    return this.color;
  }

  /**
   * Getter. Devuelve el texto de la nota
   * @returns Texto de la nota
   */
  getBody():string {
    return this.body;
  }

  /**
   * Transforma los datos de la nota a un string en formato JSON
   * @returns String en formato JSON
   */
  noteToJSON():string {
    return '{\n\"title\": \"' + this.title + '\",\n\"body\": \"'+ this.body +
    '\",\n\"color\": \"' + this.color + '\"\n}';
  }
}