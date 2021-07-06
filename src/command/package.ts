import * as execa from 'execa'
import * as ora from 'ora'
import * as path from 'path'
import * as chalk from 'chalk'
import * as fs from 'fs-extra'
import { cwd, removedir } from '../lib'

// 安装私有包
const downloadPackage = async (packageName) => {
  console.log(`🗃  npm install ${packageName}`)
  const spinner = ora().start('This might take a while...\n')
  try {
    execa.commandSync(`npm install ${packageName}`, {
      stdio: 'inherit',
      cwd: path.join(cwd),
    })
    spinner.succeed()
  } catch (err) {
    spinner.fail()
    console.log(err, chalk.red(err))
    return
  }
}

// 从node_modules复制package到private目录下
const copyPackage = async(packageName) => {
  try {
  await fs.copy(
    path.join(cwd, 'node_modules', packageName),
    path.join(cwd, 'private', packageName)
  )
  } catch (err) {
    console.log(err, chalk.red(err))
    return
  }
}

// 在private目录下压缩package为package.tar.gz，删除package
const zipPackage = async(packageName) => {
  try {
    const packageNames = packageName.split('/')
    const name = packageNames[packageNames.length - 1]
    packageNames.pop()
    const packagePath = packageNames.join('/')
    execa.commandSync(`tar -zcvf ${name}.tar.gz ${name}`, {
      stdio: 'inherit',
      cwd: packagePath ? path.join(cwd, 'private', packagePath) : path.join(cwd, 'private') 
    })
    removedir(path.join(cwd, 'private', packagePath, name))
  } catch (err) {
    console.log(err, chalk.red(err))
    return
  }
}

// 更新package.json文件
const updatePackageJson = async (packageName) => {
  try {
    fs.readFile(path.join(cwd, 'package.json'), 'utf8', function(err, data) {
      if (err) throw err
      let json = JSON.parse(data)
      if (json.dependencies[packageName]) {
        json.dependencies[packageName] = `./private/${packageName}.tar.gz`
      }
      if (json.devDependencies[packageName]) {
        json.devDependencies[packageName] = `./private/${packageName}.tar.gz`
      }
      let newJson = JSON.stringify(json, null, 4)
      fs.writeFile(path.join(cwd, 'package.json'), newJson, 'utf8', function(err, data) {
        if (err) throw err
      })
    })
  }
  catch (err) {
    console.log(err, chalk.red(err))
    return
  }
}

export const action =  async (packageName) => {
  await downloadPackage(packageName)
  await copyPackage(packageName)
  await zipPackage(packageName)
  await updatePackageJson(packageName)
}

export default {
  command: 'package <packageName>',
  description: '将所声明的npm包处理为离线包',
  action,
}