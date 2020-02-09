/* eslint-disable @typescript-eslint/no-var-requires */
import { print } from './log';
import { styles } from './styles';

const path = require('path');
const { exec } = require('shelljs');
const { readFileSync, writeFileSync } = require('fs');

export function run(command: string): void {
  print(styles.bold(`$ ${command}`));
  exec(command);
}

export function readFile(filepath: string, encode?: string): string {
  filepath = path.resolve(__dirname, filepath);
  return readFileSync(filepath, encode || 'utf8');
}

export function writeFile(filepath: string, fileContent: string): void {
  filepath = path.resolve(__dirname, filepath);
  writeFileSync(filepath, fileContent, (werr: any) => {
    if (werr) {
      throw werr;
    }
  });
}

export function replaceFileContent(filepath: string, source: string, replacement: string): void {
  filepath = path.resolve(__dirname, filepath);
  const reg = new RegExp(`${source}`, 'g');
  let filecontent = readFile(filepath);
  filecontent = filecontent.replace(reg, replacement);
  writeFile(filepath, filecontent);
}

export function getPackage(packageFile?: string): object {
  if (!packageFile) {
    packageFile = './package.json';
  }
  packageFile = path.resolve(__dirname, packageFile);
  if (packageFile) {
    return JSON.parse(readFile(packageFile));
  }
  return {};
}
