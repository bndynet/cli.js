export class Timer {
  private start: number;
  constructor() {
    this.start = new Date().getTime();
  }

  public getValue(): number {
    return new Date().getTime() - this.start;
  }
}

export const timer = (): Timer => new Timer();
