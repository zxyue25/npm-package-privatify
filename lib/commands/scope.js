"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const lib_1 = require("../lib");
const minimatch = require("minimatch");
const package_1 = require("./package");
// 获取作用域下有哪些包
const getPackageName = async (scopeName) => {
    try {
        const data = fs.readFileSync(path.join(lib_1.cwd, 'package.json'), 'utf8');
        let json = JSON.parse(data);
        let packageNameArr1 = json.dependencies
            ? Object.keys(json.dependencies).filter((item) => minimatch(item, scopeName))
            : [];
        let packageNameArr2 = json.devDependencies
            ? Object.keys(json.devDependencies).filter((item) => minimatch(item, scopeName))
            : [];
        let packageNameArr = Array.from(new Set([...packageNameArr1, ...packageNameArr2]));
        if (packageNameArr.length === 0) {
            console.log(chalk.green(`\nscopeName：${scopeName}下，没有私有包\n`));
        }
        else {
            console.log(chalk.green(`\nscopeName：${scopeName}下，有${packageNameArr.length}个私有包：${packageNameArr.join(',')} \n`));
            for (const packageName of packageNameArr) {
                try {
                    await package_1.action(packageName, scopeName);
                }
                catch (err) {
                    throw err;
                    return;
                }
            }
        }
    }
    catch (err) {
        throw err;
        return;
    }
};
const action = async (scopeName) => {
    try {
        await getPackageName(scopeName);
        console.log(chalk.green(`\nscopeName：${scopeName}下私有包处理完毕`));
    }
    catch (err) {
        console.log(chalk.red(err));
        return;
    }
};
exports.default = {
    command: 'scope <scope>',
    description: '将所声明作用域<scope>下的私有包及私有包依赖子包处理为离线包',
    action,
};
//# sourceMappingURL=scope.js.map