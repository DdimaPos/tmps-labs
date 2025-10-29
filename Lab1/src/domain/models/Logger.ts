export class Logger {
  private static instance: Logger;
  logHistory: string[];

  private constructor() {
    this.logHistory = new Array<string>()
  }

  warn(message: string) {
    const log = new Date(Date.now()).toISOString().concat(" Warn:", message)
    console.info(log)
    this.logHistory.push(log)
  }

  err(message: string) {
    const log = new Date(Date.now()).toISOString().concat(" Error:", message)
    console.info(log)
    this.logHistory.push(log)
  }

  info(message: string) {
    const log = new Date(Date.now()).toISOString().concat(" Info:", message)
    console.info(log)
    this.logHistory.push(log)
  }

  seeLogs() {
    console.table(this.logHistory);
  }

  public static getLogger() {
    if (!this.instance) {
      this.instance = new Logger()
    }
    return this.instance;
  }
}
