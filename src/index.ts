import * as globby from 'globby'
import * as commander from 'commander'
import { error } from './lib'
const { program } = commander

let commandsPath = []

// 获取命令
const getCommand = () => {
  commandsPath =
    (globby as any).sync('./commands/*.*s', { cwd: __dirname, deep: 1 }) || []
  return commandsPath
}

function start() {
  const commandsPath = getCommand()
  program.version('0.1.0')
  commandsPath.forEach((commandPath) => {
    const commandObj = require(`./${commandPath}`)
    const { command, description, action } = commandObj.default
    program.command(command).description(description).action(action)
  })

  program.arguments('[command]').action((cmd) => {
    if (!cmd) {
      program.outputHelp()
      return
    }
    error(`未知的命令${cmd}`)
    program.outputHelp()
  })

  program.parseAsync(process.argv)
}

start()
