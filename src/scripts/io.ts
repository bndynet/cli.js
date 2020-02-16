/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { print, log, error, success, warn } from './log';
import { styles } from './styles';
import { progress } from './progress';
import { timer } from './timer';
import { doesNotReject } from 'assert';

const fs = require('fs');
const ora = require('ora');
const path = require('path');
const sh = require('shelljs');

function fdIsOK(fd: number, err: string, successCallback?: () => void, errorCallback?: () => void): void {
  if (err) {
    fs.close(fd);
    error(err);
    errorCallback && errorCallback();
  } else {
    successCallback && successCallback();
  }
}

export function run(command: string): void {
  print(styles.bold(`$ ${command}`));
  sh.exec(command);
}

export function beginRun(command: string, callback?: (exitCode: number) => void): void {
  const duration = timer();
  const spinner = ora({
    text: `${styles.bold(command)}`,
    spinner: 'dots3',
    hideCursor: true,
    interval: 80,
  }).start();

  sh.exec(command, { silent: true }, (code: number, stdout: string, stderr: string) => {
    // this method just can update text and symbol options
    const isOK = code === 0;
    spinner.stopAndPersist({
      symbol: '$',
    });
    print('');
    stderr && (isOK ? warn(stderr) : error(stderr));
    print(stdout);
    print('');
    const doneString = `done in ${duration.getValue() / 1000}s at ${new Date().toLocaleString()}.`;
    isOK ? success(doneString) : error(doneString);
    print('');
    if (callback && typeof callback === 'function') {
      callback(code);
    }
  });
}

export function readFile(filepath: string, encoding?: string): string {
  return fs.readFileSync(filepath, encoding || 'utf8');
}

export function beginReadFile(filepath: string, readCallback?: (buffer: Buffer, readSize: number, size: number) => void): void {
  fs.open(filepath, 'r', (err: string, fd: number) => {
    fdIsOK(fd, err, () => {
      fs.fstat(fd, (errr: string, stat: any) => {
        fdIsOK(fd, errr, () => {
          const size = stat.size;
          const buffer = Buffer.alloc(1024);
          let count = 0;
          let totalBuf: any;
          (function next(): void {
            fs.read(fd, buffer, 0, buffer.length, count, (err: string, bytesRead: number) => {
              if (bytesRead > 0) {
                const b = buffer.slice(0, bytesRead);
                totalBuf = totalBuf ? Buffer.concat([totalBuf, b]) : Buffer.concat([b]);
                count += bytesRead;
                readCallback && readCallback(totalBuf, count, size);
                setTimeout(() => {
                  next();
                }, 1000);
              } else {
                fs.close(fd, (err: any) => {
                  error(err);
                });
              }
            });
          })();
        });
      });
    });
  });
}

export function writeFile(filepath: string, fileContent: string, callback?: (err: string) => void): void {
  filepath = path.resolve(__dirname, filepath);
  fs.writeFile(filepath, fileContent, callback);
}

export function replaceFileContent(filepath: string, source: string, replacement: string, callback?: (err: string) => void): void {
  filepath = path.resolve(__dirname, filepath);
  const reg = new RegExp(`${source}`, 'g');
  let fileContent = readFile(filepath);
  fileContent = fileContent.replace(reg, replacement);
  writeFile(filepath, fileContent);
}
