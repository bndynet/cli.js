# clr.js

Powerful Command Line Interface

## Getting Started

`$ npm i @bndynet/clr -D` to install the package.

`$ npm i chalk inquirer shelljs  -D` to install dependencies.

```javascript
const clr = require('@bndynet/clr');
const styles = clr.styles;

clr.startSection('Log Print');
clr.info('Hello World!', true);
clr.warn('Hello World!', true);
clr.error('Hello World!', true);
clr.success('Hello World!', true);
clr.endSection();

clr.startSection('IO');
clr.log('Begin to write README.md...');
clr.replaceFileContent('../README.md', 'clr', 'clr');
clr.endSection();

clr.startSection('Package File');
clr.log(clr.getPackage('../package.json'));
clr.endSection();

clr.startSection('Questions');
clr
  .questions([
    'Please input your name:',
    'Please input your age:',
    'Please your home page:',
    'Is home page online?',
    ['Your country:', ['China', 'US']]])
  .then(function(res) {
    clr.log(`
    My name is ${styles.info(styles.bold(res[0]))}, and I am ${styles.bold(res[1])}.
    My home page is at ${clr.styles.link(res[2])} and it's ${res[3] ? 'online' : 'offline'}. I come from ${styles.bold(res[4])}.
  `);
  })
  .finally(function() {
    clr.endSection();
  });
```


## Screenshots

![](https://raw.githubusercontent.com/bndynet/clr.js/master/screenshots/log.png)

![](https://raw.githubusercontent.com/bndynet/clr.js/master/screenshots/questions.png)


## Development
```
$ npm start
& npm test
```