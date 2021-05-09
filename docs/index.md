# Práctica 10 - 
* Elaborado por Eduardo Da Silva Yanes

## Indice
- [1. Introduccion](#introduccion)
- [2. Pasos previos](#previos)
- [3. Desarrollo](#desarrollo)
- [4. Dificultades y conclusion](#conclusion)
- [5. Referencias](#referencias)

## 1. Introducción <a name="introduccion"></a>

Esta décima práctica es una evolución de la práctica 8. En este caso vamos a coger la aplicación de notas y llevarla a un siguiente nivel haciendo uso de sockets. En este caso debemos hacer un planteamiento cliente-servidor donde, desde el lado del cliente, hacemos las peticiones (añadir nota, eliminar, etc) y estas son enviadas y procesadas por el servidor. El resultado de esta operación es devuelto y mostrado al cliente.

Además de todo el código a desarrollar, también vamos a trabajar con Github Actions y la integración continua. Tendremos ejecución continua de código TS ejecutado en Node.js y configuracioń del flujo de trabajo para trabajar con Coveralls y SonarCloud.

## 2. Pasos previos <a name="previos"></a>

Para la realización de esta práctica necesitaremos hacer uso de distintos paquetes que instalaremos a continuación.
Recordemos siempre instalar las cosas como dependencias de desarrollo. Para ello hacemos uso del flag `--save-dev`.

Para poder aprovechar la **api síncrona de Node.JS para trabajar con ficheros** debemos instalar el siguiente paquete:
```bash
npm install --save-dev @types/node
```
Para instalar **chalk** debemos hacer lo siguiente:
```bash
npm install --save-dev chalk
```
Finalmente necesitamos instalar **yargs**. Para ello debemos instalar tanto el propio yargs como el paquete **@types/yargs**. 
```bash
npm install --save-dev yargs @types/yargs
```

## 3. Desarrollo de los ejercicios <a name="desarrollo"></a>

- **[Enlace al código fuente](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-EduardoSY/tree/master/src)**

- **[Enlace a los tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-EduardoSY/tree/master/tests)**

- **[Enlace a la documentación generada](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct10-async-sockets-EduardoSY/docum/index)**

### PARTE CLIENTE

Lo primero que hacemos es establecer la conexión con el servidor. Para ello hacemos uso del comando 

```typescript
const client = connect({port: 60300});
```

Con **yargs** definimos los comandos necesarios para cada una de las acciones. Estos comandos no han cambiado. La única diferencia respecto a la práctica anterior se encuentra en qué comandos ejecutan estos. Pongamos como ejemplo el comando **add**.

```typescript
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
```

Una vez definimos la estructura del comando, creamos una constante de tipo **RequestType**. Este tipo de dato, definido en `messageType.ts` nos presenta la estructura de dato que será enviada al servidor.

`RequestType` tiene como parámetros obligatorios el tipo de petición que hacemos y sobre ué **usuario** se realiza. El resto de parámetros son opcionales (dependiendo de la consulta serán necesarios o no).

Una vez definido esto enviamos al servidor la información con el comando `write`. Esta información no la podemos pasar tal cual la hemos definido. La debemos pasar de un objeto JSON a un string. Por tanto usamos la opción `stringify`. Además de esto, al final del string añadimos un **\n**. Este salto de línea será el indicador de que el mensaje ha acabado.

Una vez enviada la petición se debe esperar a que el **servidor la procese** y **devuelva una respuesta.**

La respuesta obtenida por el servidor es manejada gracias una clase creada a partir de la clase **EventEmitter**. Esta clase es `MessageEventEmitterClient`, definida en el fichero `eventEmitterClient.ts`.

Esta clase obtiene como parámetro la conexión que hemos establecido previamente. La funcionalidad de esta es recoger todos los trozos de mensaje que envie el servidor hasta que encontremos el **\n** que se nombró pocas lineas arriba. Una vez encontrado ese caracter de salto de línea **emitimos un evento** que, en este caso hemos denominado **message**. Este evento emitido será manejado posteriormente en el fichero `noteClient.ts`.

```typescript
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
```

¿Por qué es necesaria esta clase? Cuando el servidor envia un mensaje, lo más común es que este se envie completo y sin ningún problema. Sin embargo, supongamos que no es así. Que el mensaje se envía fraccionado o que ha habido un error momentaneo en la conexión. Gracias a este método podemos obtener todos los trozos y formar el mensaje completo.

Ahora vemos cómo se analiza el evento **message**.

```typescript
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
```

Si analizamos bien en la clase **MessageEventEmitterClient**, cuando emitimos el evento, además emitimos la información recibida transformada a formato JSON válido. Entonces, al manejar el evento **message** hacemos uso de las propiedades de este. Con un **switch-case** diferenciamos el tipo de respuesta en base al atributo **type**. Dependiendo de cuaĺ sea se muestra un mensaje o determinada información.

### PARTE SERVIDOR

Lo primero que hacemos cuando se realiza una conexión es indicar precisamente eso, que algún cliente se ha conectado con el servidor.
Una vez hecho esto, al igual que se hizo con la clase **MessageEventEmitterClient**, se recogen los fragmentos de mensajes enviados por el cliente

### Ejemplo de ejecución

![Ejemplo de ejecucion]()

### Tests

En esta práctica, al igual que las anteriores, se ha seguido una metodología TDD. Por tanto, hemos ido creando los tests y posteriormente el código que así resuelve.

Este es **[el directorio con los tests del programa](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EduardoSY/tree/master/tests/noteApp_test)**

### Workflow con Github Actions e integración continua

Para realizar toda la integración con Github Actions se ha seguido los tutoriales proporcionador por el profesor.

**[CI de código Typescript ejecutado en Node.js (Solo alumnos ULL)](https://drive.google.com/file/d/1hwtPovQlGvthaE7e7yYshC4v8rOtLSw0/view)**

En este primer tutorial creamos la configuración para ejecutar el código y las pruebas en distintas versiones de Node.js y comprobar su correcto funcionamiento. Al finalizar el tutorial nos queda un fichero similar al siguiente:

```
name: Tests

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 15.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm install
    - run: npm test
```
En este caso se ha eliminado el uso de las versiones 10.x y 12.x debido a que estas no funcionan correctamente con el paquete **fs**. Ciertas funciones como `mkdirSync`, entre otras, dan error puesto que no las reconoce.

**[Workflow GH Actions Coveralls (Solo alumnos ULL)](https://drive.google.com/file/d/1yOonmpVbOyvzx3ZbXMQTAPxvA3a7AE7w/view)**

Una vez finalizado el tutorial, en nuestro directorio `.github/workflows` tendremos nuestro fichero `coveralls.yml` que será similar a esto:

```
name: Coveralls

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  coveralls:

    runs-on: ubuntu-latest


    steps:
    - name: Cloning repo
      uses: actions/checkout@v2
    - name: Use Node.js 15.x
      uses: actions/setup-node@v2
      with:
        node-version: 15.x
    - name: Installing dependencies
      run: npm install
    - name: Generating coverage info
      run: npm run coverage
    - name: Coveralls GH action 
      uses: coverallsapp/github-action@master
      with: 
        github-token: ${{secrets.GITHUB_TOKEN}}
```

**[Workflow GH Actions Sonar-Cloud (Solo alumnos ULL)](https://drive.google.com/file/d/1FLPargdPBX6JaJ_85jNsRzxe34sMi-Z3/view)**

Una vez finalizado este ultimo tutorial, en nuestro directorio `.github/workflows` tendremos nuestro fichero `coveralls.yml` que será similar a esto:

```
name: Sonar-Cloud
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Shallow clones should be disabled for a better relevancy of analysis
      - name: Use Node.js 15.x
        uses: actions/setup-node@v1
        with:
          node-version: 15.x   
      - name: Installing dependencies
        run: npm install
      - name: Generate coverage info
        run: npm run coverage
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

Además, en nuestro directorio raiz hemos de haber creado un fichero denominado **sonar-project.propierties** que contiene lo siguiente:

```
sonar.projectKey=ULL-ESIT-INF-DSI-2021_ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EduardoSY
sonar.organization=ull-esit-inf-dsi-2021

# This is the name and version displayed in the SonarCloud UI.
sonar.projectName=ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-EduardoSY
sonar.projectVersion=1.0

# Path is relative to the sonar-project.properties file. Replace "\" by "/" on Windows.
sonar.sources=src

# Encoding of the source code. Default is default system encoding
sonar.sourceEncoding=UTF-8

# Coverage info
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

Nótese que en el video tutorial hay una pequeña errata en esta última linea pues reportPaths debe llevar una s al final.

## 4. Dificultades y conclusión <a name="conclusion"></a>

A nivel general no han habido grandes complicaciones. Sin embargo, a la hora de realizar la implementación del comando 'list' en la parte del cliente, pasé un tiempo considerable para resolver una series de problemas con las llamadas de la función. Tras limpiar el código descubrí que un argumento que estaba pasando al console.log era el culpable de ello. De resto, la implementación ha sido bastante fluida.

En cuanto al resultado final, es cierto que me gustaria haber podido hacerlo más robusto y óptimo en cuando 

## 5. Referencias <a name="referencias"></a>
- [Guión práctica 10](https://ull-esit-inf-dsi-2021.github.io/prct10-async-sockets/): Guión de la práctica .
- [Apuntes sobre Node.js](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/): Apuntes de la asignatura sobre Node.JS
- [Apuntes sobre sockets](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-sockets.html): Apuntes de la asignatura sobre Sockets
- [Guía para crear un proyecto](https://ull-esit-inf-dsi-2021.github.io/typescript-theory/typescript-project-setup.html): Guía del profesor para crear un proyecto.
- Diversos videotutoriales creados por el profesor de la asignatura donde explica cómo instalar diversos paquetes y configuraciones (Typedoc, Mocha, Chai, Instanbul, Workflow con Github Actions, etc.)
- [Workflow GH Actions Sonar-Cloud (Solo alumnos ULL)](https://drive.google.com/file/d/1FLPargdPBX6JaJ_85jNsRzxe34sMi-Z3/view)
- [Workflow GH Actions Coveralls (Solo alumnos ULL)](https://drive.google.com/file/d/1yOonmpVbOyvzx3ZbXMQTAPxvA3a7AE7w/view)
- [CI de código Typescript ejecutado en Node.js (Solo alumnos ULL)](https://drive.google.com/file/d/1hwtPovQlGvthaE7e7yYshC4v8rOtLSw0/view)
- [Yargs. Pagina oficial npm](https://www.npmjs.com/package/yargs)
- [Chalk. Pagina oficial npm](https://www.npmjs.com/package/chalk)
