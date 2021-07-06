import * as fs from 'fs-extra'
import * as path from 'path'
import * as chalk from 'chalk'
import {cwd} from '../lib'
import { action as  privatePackage } from './package'
// 获取作用域下有哪些包
const getPackageName = async (scopeName) => {
    try {
        fs.readFile(path.join(cwd, 'package.json'), 'utf8', function(err, data) {
          if (err) throw err
          let json = JSON.parse(data)
          let packageNameArr1 = Object.keys(json.dependencies).filter(item => item.includes(scopeName))
          let packageNameArr2 = Object.keys(json.devDependencies).filter(item => item.includes(scopeName))
          let packageNameArr = Array.from(new Set([...packageNameArr1, ...packageNameArr2]))
          packageNameArr.forEach(packageName => {
            privatePackage(packageName)
          })
        })
      }
      catch (err) {
        console.log(err, chalk.red(err))
        return
      }
}

const action = async (scopeName) => {
    await getPackageName(scopeName)
}

export default {
    command: 'scope <scopeName>',
    description: '将所声明作用域下的包处理为离线包',
    action,
}