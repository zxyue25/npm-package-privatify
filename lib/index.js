"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby = require("globby");
const commander = require("commander");
const { program } = commander;
let commandsPath = [];
// 获取命令
const getCommand = () => {
    commandsPath = globby.sync('./commands/*.*s', { cwd: __dirname, deep: 1 }) || [];
    return commandsPath;
};
function start() {
    const commandsPath = getCommand();
    program.version('0.1.0');
    commandsPath.forEach(commandPath => {
        const commandObj = require(`./${commandPath}`);
        const { command, description, action } = commandObj.default;
        program
            .command(command)
            .description(description)
            .action(action);
    });
    program.parse(process.argv);
}
start();
//# sourceMappingURL=index.js.map