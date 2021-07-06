import * as globby from 'globby'
import * as commander from 'commander'
const { program } = commander

let commandsPath = []

// 获取命令
const getCommand = () => {
    commandsPath = (globby as any).sync('./command/*.*s', { cwd:__dirname, deep:1 }) || []
    return commandsPath
}

function start() {
    const commandsPath = getCommand()
    program.version('0.1.0')
    commandsPath.forEach( commandPath => {
        const commandObj = require(`./${commandPath}`)
        const { command, description, action } = commandObj.default
        program
            .command(command)
            .description(description)
            .action(action)
    })
    program.parse(process.argv);
}

start()