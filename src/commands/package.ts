import * as path from 'path'
import * as globby from 'globby'
import {
  cwd,
  targetFile,
  chalk,
  execa,
  fs,
  startSpinner,
  succeedSpiner,
  failSpinner,
  info,
} from '../lib'
import { checkPackage, readFile, tarGz } from './utils'

// 将私有包及私有子包离线化
export const privatePackage = async (packageName, scopeName) => {
  startSpinner(`开始下载包 ${packageName}`)
  execa.commandSync(`npm install ${packageName}`, {
    stdio: 'inherit',
    cwd,
  })
  succeedSpiner(`包下载完成 ${packageName}`)
  await updatePackage(packageName, scopeName)
}

// 更新包package.json信息，复制、压缩文件等
const updatePackage = async (
  packageName,
  scopeName,
  parentPackagePath = ''
) => {
  startSpinner(`开始离线化 ${packageName}`)
  fs.removeSync(path.join(cwd, targetFile, packageName))
  // 复制包从node_modules到targetFile
  fs.copySync(
    path.join(cwd, 'node_modules', packageName),
    path.join(cwd, targetFile, packageName)
  )
  // 读取包package.json文件
  const packageJson = readFile(`${targetFile}/${packageName}`)
  if (scopeName) {
    // 检查package的依赖子包是否有scope下的私有包
    const subPackages = checkPackage(packageJson, scopeName)
    if (subPackages) {
      const copyedPackages =
        (globby as any).sync(`${scopeName}`, {
          cwd: path.join(cwd, targetFile),
          deep: 1,
        }) || []
      for (const subPackage of subPackages) {
        const subPackageJson = readFile(`node_modules/${subPackage}`)
        const { version } = subPackageJson
        if (!copyedPackages.includes(`${subPackage}-${version}.tar.gz`)) {
          await updatePackage(
            subPackage,
            scopeName,
            `${targetFile}/${packageName}`
          )
        } else {
          info(`检测到${subPackage}-${version}已处理`)
        }
      }
    }
  }
  const { version } = packageJson
  // 更新包的package.json
  await updatePackageJson(packageName, version, parentPackagePath)
  // 压缩包
  await zipPackage(packageName, version)
  succeedSpiner(`包离线化完成 ${packageName}`)
}

// 更新package.json文件
const updatePackageJson = async (packageName, version, parentPackagePath) => {
  const filePath = parentPackagePath ? '../../' : ''
  const packageJson = readFile(parentPackagePath)
  const packagePath = `file:${filePath}${targetFile}/${packageName}-${version}.tar.gz`
  if (packageJson.dependencies && packageJson.dependencies[packageName]) {
    packageJson.dependencies[packageName] = packagePath
  }
  if (packageJson.devDependencies && packageJson.devDependencies[packageName]) {
    packageJson.devDependencies[packageName] = packagePath
  }
  fs.writeFileSync(
    path.join(cwd, parentPackagePath, 'package.json'),
    JSON.stringify(packageJson, null, 4),
    'utf8'
  )
}

// 在targetFile目录下压缩package为${packageName}.${version}.tar.gz，删除package
const zipPackage = async (packageName, version) => {
  const packageNames = packageName.split('/')
  const name = packageNames[packageNames.length - 1]
  packageNames.pop()
  const packagePath = packageNames.join('/')
  await tarGz(packagePath, name, version)
  chalk.green(`私有化处理完成 ${packageName}`)
}

const action = async (packageName: string, scopeName?: string) => {
  try {
    await privatePackage(packageName, scopeName)
  } catch (err) {
    failSpinner(err)
    return
  }
}

export default {
  command: 'package <package-name> [scope]',
  description: '将<package-name>包处理为离线包', //，并将该私有包依赖子包在[scope]下的包也处理为离线包
  action,
}
