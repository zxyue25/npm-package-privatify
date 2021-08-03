import * as path from 'path'
import * as globby from 'globby'
import {
  cwd,
  chalk,
  execa,
  fs,
  startSpinner,
  succeedSpiner,
  failSpinner,
} from '../lib'
import { getPackage, readFile, tagGz } from './utils'

// 安装私有包
const downloadPackage = async (packageName) => {
  startSpinner(`开始下载包 ${packageName}`)
  try {
    execa.commandSync(`npm install ${packageName}`, {
      stdio: 'inherit',
      cwd: path.join(cwd),
    })
    succeedSpiner(`包下载完成 ${chalk.yellow(packageName)}`)
  } catch (err) {
    failSpinner(err)
    throw err
    return
  }
}

// 从node_modules复制package到private目录下
const copyPackage = async (packageName, scopeName, parentPackagePath = '') => {
  try {
    fs.removeSync(path.join(cwd, 'private', packageName))
    fs.copySync(
      path.join(cwd, 'node_modules', packageName),
      path.join(cwd, 'private', packageName)
    )

    if (scopeName) {
      // 检查package的子包是否有私有包
      const subPackages = await checkSubPackage(packageName, scopeName)
      if (subPackages) {
        const copyedPackages =
          (globby as any).sync(`./${scopeName}`, {
            cwd: path.join(cwd, 'private'),
            deep: 1,
          }) || []
        for (const subPackage of subPackages) {
          if (!copyedPackages.includes(subPackage)) {
            try {
              await copyPackage(subPackage, scopeName, `private/${packageName}`)
            } catch (err) {
              throw err
              return
            }
          }
        }
      }
    }
    const json = readFile(`private/${packageName}`)
    const version = json.version
    try {
      await updatePackageJson(packageName, version, parentPackagePath)
      chalk.green(`私有化处理完成 ${packageName}`)
    } catch (err) {
      throw err
      return
    }
  } catch (err) {
    throw err
    return
  }
}

// 在private目录下压缩package为${packageName}.${version}.tar.gz，删除package
const zipPackage = async (packageName, version) => {
  try {
    const packageNames = packageName.split('/')
    const name = packageNames[packageNames.length - 1]
    packageNames.pop()
    const packagePath = packageNames.join('/')
    await tagGz(packagePath, name, version)
    chalk.green(`私有化处理完成 ${packageName}`)
  } catch (err) {
    throw err
    return
  }
}

// 检查package的子包是否有私有包
const checkSubPackage = async (packageName, scopeName) => {
  try {
    let json = readFile(`private/${packageName}`)
    let packageNameArr = getPackage(json, scopeName)
    if (packageNameArr.length === 0) {
      return false
    } else {
      console.log(
        chalk.yellow(
          `\n检测到${packageName}子包下，有${
            packageNameArr.length
          }个私有包：${packageNameArr.join('，')}`
        )
      )
      return packageNameArr
    }
  } catch (err) {
    throw err
    return
  }
  return false
}

// 更新package.json文件
const updatePackageJson = async (packageName, version, parentPackagePath) => {
  const filePath = parentPackagePath ? '../../' : ''
  try {
    const json = readFile(`${parentPackagePath}`)
    if (json.dependencies && json.dependencies[packageName]) {
      json.dependencies[
        packageName
      ] = `file:${filePath}private/${packageName}-${version}.tar.gz`
    }
    if (json.devDependencies && json.devDependencies[packageName]) {
      json.devDependencies[
        packageName
      ] = `file:${filePath}private/${packageName}-${version}.tar.gz`
    }
    let newJson = JSON.stringify(json, null, 4)
    fs.writeFileSync(
      path.join(cwd, parentPackagePath, 'package.json'),
      newJson,
      'utf8'
    )
    try {
      await zipPackage(packageName, version)
    } catch (err) {
      throw err
      return
    }
  } catch (err) {
    throw err
    return
  }
}

export const action = async (packageName, scopeName) => {
  try {
    await downloadPackage(packageName)
  } catch (err) {
    if (scopeName) {
      throw err
    } else {
      console.log(chalk.red(err))
    }
    return
  }
  try {
    await copyPackage(packageName, scopeName)
  } catch (err) {
    console.log(chalk.red(err))
    return
  }
  console.log(chalk.green(`\n完成包离线处理 ${packageName}`))
}

export default {
  command: 'package <package-name> [scope]',
  description: '将<package-name>包处理为离线包', //，并将该私有包依赖子包在[scope]下的包也处理为离线包
  action,
}
