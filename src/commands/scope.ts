
import { chalk} from '../lib'
import { getPackage } from './utils/get-package'
import { action as privatePackage } from './package'
import { readFile } from './utils'
// 获取作用域下有哪些包
const getPackageName = async (scopeName) => {
  try {
    let json = readFile()
    let packageNameArr = getPackage(json, scopeName)
    if (packageNameArr.length === 0) {
      console.log(
        chalk.yellow(`\n 检测到scopeName ${scopeName}下，没有私有包\n`)
      )
    } else {
      console.log(
        chalk.yellow(
          `\n检测到scopeName：${scopeName}下，有${
            packageNameArr.length
          }个私有包：${packageNameArr.join('，')} \n`
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
