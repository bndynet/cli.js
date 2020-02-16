import { log } from './log';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const lib = require('cli-progress');

export class Progress {
  private total: number;
  private payload: any;
  private instance: any;
  private custFormat = '';

  constructor(total?: number, textFormat?: string, payload?: any) {
    this.total = total || 100;
    this.payload = payload || {};
    this.custFormat = textFormat || '';
  }

  public show(): Progress {
    this.instance = new lib.SingleBar({
      // format: `[{bar}] {percentage}%`,
      // format: '[{bar}] {percentage}% | ETA: {eta}s | Duration: {duration_formatted} | {value}/{total}',
      format: (options: any, params: any, payload: any): string => {
        this.payload = { ...this.payload, ...payload };
        const percentValue = Math.round((params.value / params.total) * 100);
        const percent = `${percentValue}%`.padStart(4);
        const eta = `ETA: ${params.eta}s`.padEnd(10);

        let bar = '';
        const cursor = '>';
        if (params.value >= params.total) {
          bar = ''.padStart(options.barsize, '=');
        } else {
          bar = cursor.padStart((percentValue * options.barsize) / 100, '=').padEnd(options.barsize, '-');
        }

        let custom = this.custFormat;
        if (this.payload) {
          Object.keys(this.payload).forEach((key: string) => {
            const reg = new RegExp(`{${key}}`, 'g');
            custom = custom.replace(reg, this.payload[key]);
          });
        }

        return `[${bar}] ${percent} | ${eta} ${custom ? '| ' + custom : ''}`;
      },
      synchronousUpdate: true,
      hideCursor: true,
    });
    this.instance.start(this.total, 0, this.payload);
    return this;
  }

  public update(value: number, payload?: any): Progress {
    if (this.instance) {
      this.instance.update(value, payload);
    }
    return this;
  }

  public increase(value?: number, payload?: any): Progress {
    if (this.instance) {
      if (this.instance.value >= this.instance.total) {
        this.done();
      } else {
        if (!value && !payload) {
          this.instance.increment();
        } else {
          this.update(this.instance.value + value, payload);
        }
      }
    }
    return this;
  }

  public done(): Progress {
    if (this.instance) {
      this.instance.update(this.total);
      this.instance.stop();
    }
    return this;
  }
}

export const progress = (total?: number, format?: string, payload?: any): Progress => {
  return new Progress(total, format, payload);
};
