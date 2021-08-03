import * as path from 'path'
import { cwd, chalk, fs } from '../lib'
import * as minimatch from 'minimatch'
import { action as privatePackage } from './package'

// 获取作用域下有哪些包
const getPackageName = async (scopeName) => {
  try {
    const data = fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')
    let json = JSON.parse(data)
    let packageNameArr1 = json.dependencies
      ? Object.keys(json.dependencies).filter((item) =>
          minimatch(item, scopeName)
        )
      : []
    let packageNameArr2 = json.devDependencies
      ? Object.keys(json.devDependencies).filter((item) =>
          minimatch(item, scopeName)
        )
      : []
    let packageNameArr = Array.from(
      new Set([...packageNameArr1, ...packageNameArr2])
    )
    if (packageNameArr.length === 0) {
      console.log(
        chalk.yellow(`\n 检测到scopeName ${scopeName}下，没有私有包\n`)
      )
    } else {
      console.log(
        chalk.yellow(
          `\n检测到scopeName：${scopeName}下，有${
            packageNameArr.length
          }个私有包：${packageNameArr.join(',')} \n`
        )
      )
      for (const packageName of packageNameArr) {
        try {
          await privatePackage(packageName, scopeName)
        } catch (err) {
          throw err
          return
        }
      }
    }
  } catch (err) {
    throw err
    return
  }
}

const action = async (scopeName) => {
  try {
    await getPackageName(scopeName)
    console.log(chalk.green(`\nscopeName：${scopeName}下私有包处理完毕`))
  } catch (err) {
    console.log(chalk.red(err))
    return
  }
}

export default {
  command: 'scope <scope>',
  description: '将作用域<scope>下的包处理为离线包', //将所声明作用域<scope>下的私有包及私有包依赖子包处理为离线包
  action,
}
