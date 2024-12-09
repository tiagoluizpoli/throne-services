import 'reflect-metadata'

import { type LogLevel, Logger } from '../src/main'

const makeLogger = (level?: LogLevel) => {
  const logger = new Logger({
    level: level ?? 'info',
    targets: [
      {
        name: 'console',
      },
    ],
  })

  return { logger }
}

describe('Logger basic functionality', () => {
  it('should not throw if logger throws and still log the message', () => {
    // Arrange
    const { logger } = makeLogger()

    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    vi.spyOn(Date.prototype, 'toISOString').mockImplementationOnce(() => {
      throw new Error('something went wrong inside the logger')
    })

    // Act
    logger.info('this is a testing info log')

    // Assert
    expect(logger.info).not.toThrow()
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'An error occurred when trying to write the log' }),
    )
    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.objectContaining({ log: 'this is a testing info log' }))
  })

  it('should not console.info if a lower log level is set', () => {
    // Arrange
    const { logger } = makeLogger('warn')
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    // Act
    logger.info('this is a testing info log with tags')

    // Assert

    expect(consoleInfoSpy).not.toHaveBeenCalled()
  })

  it('should not console.info if other log level is called', () => {
    // Arrange
    const { logger } = makeLogger()
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    // Act
    logger.debug('this is a testing info log with tags')

    // Assert

    expect(consoleInfoSpy).not.toHaveBeenCalled()
  })

  it('should console.info with tags', () => {
    // Arrange
    const { logger } = makeLogger()
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    // Act
    logger.info('this is a testing info log with tags', {
      customKey: 'customValue',
      anotherCustomKey: 'anotherCustomValue',
    })

    // Assert
    const regex =
      /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) :: info :: (\w+-?\w*)* :: this is a testing info log with tags :: customKey=customValue, anotherCustomKey=anotherCustomValue$/

    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringMatching(regex))
  })

  it('should console.info without tags', () => {
    // Arrange
    const { logger } = makeLogger()
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    // Act
    logger.info('this is a testing info log without tags')

    // Assert
    const regex =
      /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) :: info :: (\w+-?\w*)* :: this is a testing info log without tags$/

    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringMatching(regex))
  })
})
