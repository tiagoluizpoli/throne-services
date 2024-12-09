export class TimerHelper {
  private readonly start: number

  constructor() {
    this.start = performance.now()
  }

  public stopTimer = (): number => {
    const stop = performance.now()
    const duration = Number(stop - this.start)
    return duration
  }
}
