import { chalk } from '../lib'
import { checkPackage } from './utils/check-package'
import { privatePackage } from './package'
import { readFile } from './utils'

const action = async (scopeName) => {
  try {
    // 读取包package.json文件
    let packageJson = readFile()
    // 检查依赖包是否有scope下的私有包
    const targetPackages = checkPackage(packageJson, scopeName)
    if (targetPackages) {
      for (const targetPackage of targetPackages) {
        await privatePackage(targetPackage, scopeName)
      }
    }
  } catch (err) {
    console.log(chalk.red(err))
  }
}

export default {
  command: 'scope <scope>',
  description: '将作用域<scope>下的包处理为离线包', //将所声明作用域<scope>下的私有包及私有包依赖子包处理为离线包
  action,
}
