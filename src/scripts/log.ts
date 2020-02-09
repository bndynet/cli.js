/* eslint-disable @typescript-eslint/no-explicit-any */
import { icons } from './icons';
import { styles } from './styles';

const out = console.log;
const lineLength = 80;

export function print(text: any): void {
  out(text);
}

export function log(text: any, hasFlag?: boolean): void {
  const flag = styles.default(hasFlag ? icons.arrowRight + ' ' : '');
  out(flag + styles.default(text));
}

export function info(text: any, hasFlag?: boolean): void {
  const flag = styles.info(hasFlag ? icons.info + ' ' : '');
  out(flag + styles.info(text));
}

export function warn(text: any, hasFlag?: boolean): void {
  const flag = styles.warn(hasFlag ? icons.warn + ' ' : '');
  out(flag + styles.warn(text));
}

export function success(text: any, hasFlag?: boolean): void {
  const flag = styles.success(hasFlag ? icons.ok + ' ' : '');
  out(flag + styles.success(text));
}

export function error(text: any, hasFlag?: boolean): void {
  const flag = styles.error(hasFlag ? icons.error + ' ' : '');
  out(flag + styles.error(text));
}

export function startSection(title: any): void {
  const fills = (lineLength - title.length) / 2;
  const titleLine = ` ${title} `
    .toUpperCase()
    .padStart(fills + title.length, '=')
    .padEnd(fills * 2 + title.length, '=');
  out(styles.bold(titleLine));
}

export function endSection(): void {
  const text = 'END';
  const fills = (lineLength - text.length) / 2;
  const titleLine = ` END `
    .toUpperCase()
    .padStart(fills + text.length, '=')
    .padEnd(fills * 2 + text.length, '=');
  out(titleLine);
  out('');
}
