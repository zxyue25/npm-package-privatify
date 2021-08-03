import * as ora from 'ora'
import * as chalk from 'chalk'

const spinner = ora()

export const startSpinner = (text?: string) => {
  const msg = chalk.yellow(`${text} ...\n`)
  spinner.start(msg)
  spinner.stopAndPersist({
    symbol: '✨',
    text: msg,
  })
}

export const succeedSpiner = (text?: string) => {
  spinner.stopAndPersist({
    symbol: '🎉',
    text: chalk.green(`${text}`)
  })
}

export const failSpinner = (text?: string) => {
  spinner.fail(chalk.red(text))
}
