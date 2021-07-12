"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const execa = require("execa");
const ora = require("ora");
const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const globby = require("globby");
const compressing = require("compressing");
const lib_1 = require("../lib");
const minimatch = require("minimatch");
// 安装私有包
const downloadPackage = async (packageName) => {
    const spinner = ora().start(chalk.yellow(`\n 开始下载包： ${packageName}... \n`));
    try {
        execa.commandSync(`npm install ${packageName}`, {
            stdio: 'inherit',
            cwd: path.join(lib_1.cwd),
        });
        spinner.succeed(chalk.green('下载完成'));
    }
    catch (err) {
        spinner.fail(chalk.red('下载失败'));
        throw err;
        return;
    }
};
// 从node_modules复制package到private目录下
const copyPackage = async (packageName, scopeName, parentPackagePath = '') => {
    try {
        fs.removeSync(path.join(lib_1.cwd, 'private', packageName));
        fs.copySync(path.join(lib_1.cwd, 'node_modules', packageName), path.join(lib_1.cwd, 'private', packageName));
        if (scopeName) {
            // 检查package的子包是否有私有包
            const subPackages = await checkSubPackage(packageName, scopeName);
            if (subPackages) {
                const copyedPackages = globby.sync(`./${scopeName}`, {
                    cwd: path.join(lib_1.cwd, 'private'),
                    deep: 1,
                }) || [];
                for (const subPackage of subPackages) {
                    if (!copyedPackages.includes(subPackage)) {
                        try {
                            await copyPackage(subPackage, scopeName, `private/${packageName}`);
                        }
                        catch (err) {
                            throw err;
                            return;
                        }
                    }
                }
            }
        }
        const data = fs.readFileSync(path.join(lib_1.cwd, 'private', packageName, 'package.json'), 'utf8');
        const json = JSON.parse(data);
        const version = json.version;
        try {
            await updatePackageJson(packageName, version, parentPackagePath);
        }
        catch (err) {
            throw err;
            return;
        }
    }
    catch (err) {
        throw err;
        return;
    }
};
// 在private目录下压缩package为${packageName}.${version}.tar.gz，删除package
const zipPackage = async (packageName, version) => {
    try {
        const packageNames = packageName.split('/');
        const name = packageNames[packageNames.length - 1];
        packageNames.pop();
        const packagePath = packageNames.join('/');
        await compressing.tar.compressDir(path.join(lib_1.cwd, 'private', packagePath, name), path.join(lib_1.cwd, 'private', packagePath, `${name}-${version}.tar`));
        await compressing.gzip.compressFile(path.join(lib_1.cwd, 'private', packagePath, `${name}-${version}.tar`), path.join(lib_1.cwd, 'private', packagePath, `${name}-${version}.tar.gz`));
        fs.removeSync(path.join(lib_1.cwd, 'private', packagePath, `${name}-${version}.tar`));
        fs.removeSync(path.join(lib_1.cwd, 'private', packagePath, name));
    }
    catch (err) {
        throw err;
        return;
    }
};
// 检查package的子包是否有私有包
const checkSubPackage = async (packageName, scopeName) => {
    try {
        const data = fs.readFileSync(path.join(lib_1.cwd, 'private', packageName, 'package.json'), 'utf8');
        let json = JSON.parse(data);
        let packageNameArr1 = json.dependencies
            ? Object.keys(json.dependencies).filter((item) => minimatch(item, scopeName))
            : [];
        let packageNameArr2 = json.devDependencies
            ? Object.keys(json.devDependencies).filter((item) => minimatch(item, scopeName))
            : [];
        let packageNameArr = Array.from(new Set([...packageNameArr1, ...packageNameArr2]));
        if (packageNameArr.length === 0) {
            return false;
        }
        else {
            console.log(chalk.yellow(`\n检查到${packageName}子包存在scope=${scopeName}下的私有包:\n${packageNameArr.join(',')},需做离线化处理\n`));
            return packageNameArr;
        }
    }
    catch (err) {
        throw err;
        return;
    }
    return false;
};
// 更新package.json文件
const updatePackageJson = async (packageName, version, parentPackagePath) => {
    const filePath = parentPackagePath ? '../../' : '';
    try {
        const data = fs.readFileSync(path.join(lib_1.cwd, parentPackagePath, 'package.json'), 'utf8');
        const json = JSON.parse(data);
        if (json.dependencies && json.dependencies[packageName]) {
            json.dependencies[packageName] = `file:${filePath}private/${packageName}-${version}.tar.gz`;
        }
        if (json.devDependencies && json.devDependencies[packageName]) {
            json.devDependencies[packageName] = `file:${filePath}private/${packageName}-${version}.tar.gz`;
        }
        let newJson = JSON.stringify(json, null, 4);
        fs.writeFileSync(path.join(lib_1.cwd, parentPackagePath, 'package.json'), newJson, 'utf8');
        try {
            await zipPackage(packageName, version);
        }
        catch (err) {
            throw err;
            return;
        }
    }
    catch (err) {
        console.log(err, 'parentPackagePathparentPackagePathparentPackagePath');
        throw err;
        return;
    }
};
const action = async (packageName, scopeName) => {
    try {
        await downloadPackage(packageName);
    }
    catch (err) {
        if (scopeName) {
            throw err;
        }
        else {
            console.log(chalk.red(err));
        }
        return;
    }
    try {
        await copyPackage(packageName, scopeName);
    }
    catch (err) {
        console.log(chalk.red(err));
        return;
    }
    console.log(chalk.green(`\n 完成${packageName}包离线处理`));
};
exports.action = action;
exports.default = {
    command: 'package <package> [scope]',
    description: '将所声明的<package>私有包处理为离线包，并将该私有包依赖子包在[scope]下的包也处理为离线包',
    action: exports.action,
};
//# sourceMappingURL=package.js.map