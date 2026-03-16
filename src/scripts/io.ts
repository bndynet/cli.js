/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs';
import path from 'node:path';

import ora from 'ora';
import sh from 'shelljs';

import { print, error, success, warn } from './log';
import { styles } from './styles';
import { timer } from './timer';

export type ErrorCallback = (err: NodeJS.ErrnoException | null) => void;

function fdIsOK(fd: number, err: NodeJS.ErrnoException | null, successCallback?: () => void, errorCallback?: ErrorCallback): void {
  if (err) {
    fs.close(fd);
    error(err);
    if (errorCallback) {
      errorCallback(err);
    }
  } else {
    if (successCallback) {
      successCallback();
    }
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
    if (stderr) {
      if (isOK) {
        warn(stderr);
      } else {
        error(stderr);
      }
    }
    print(stdout);
    print('');
    const doneString = `done in ${duration.getValue() / 1000}s at ${new Date().toLocaleString()}.`;
    if (isOK) {
      success(doneString);
    } else {
      error(doneString);
    }
    print('');
    if (callback && typeof callback === 'function') {
      callback(code);
    }
  });
}

export function readFile(filepath: string, encoding?: BufferEncoding): string {
  return fs.readFileSync(filepath, encoding || 'utf8');
}

export function beginReadFile(filepath: string, readCallback?: (buffer: Buffer, readSize: number, size: number) => void): void {
  fs.open(filepath, 'r', (err: NodeJS.ErrnoException | null, fd: number) => {
    fdIsOK(fd, err, () => {
      fs.fstat(fd, (errr: NodeJS.ErrnoException | null, stat) => {
        fdIsOK(fd, errr, () => {
          const size = stat.size;
          const buffer = Buffer.alloc(1024);
          let count = 0;
          let totalBuf: any;
          (function next(): void {
            fs.read(fd, buffer, 0, buffer.length, count, (_err, bytesRead: number) => {
              if (bytesRead > 0) {
                const b = buffer.slice(0, bytesRead);
                totalBuf = totalBuf ? Buffer.concat([totalBuf, b]) : Buffer.concat([b]);
                count += bytesRead;
                if (readCallback) {
                  readCallback(totalBuf, count, size);
                }
                setTimeout(() => {
                  next();
                }, 1000);
              } else {
                fs.close(fd, (closeError) => {
                  if (closeError) {
                    error(closeError);
                  }
                });
              }
            });
          })();
        });
      });
    });
  });
}

export function writeFile(filepath: string, fileContent: string, callback?: ErrorCallback): void {
  filepath = path.resolve(__dirname, filepath);
  if (callback) {
    fs.writeFile(filepath, fileContent, callback);
    return;
  }
  fs.writeFile(filepath, fileContent, () => undefined);
}

export function replaceFileContent(filepath: string, source: string, replacement: string, callback?: ErrorCallback): void {
  filepath = path.resolve(__dirname, filepath);
  const reg = new RegExp(`${source}`, 'g');
  let fileContent = readFile(filepath);
  fileContent = fileContent.replace(reg, replacement);
  writeFile(filepath, fileContent, callback);
}
