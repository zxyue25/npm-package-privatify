import * as minimatch from 'minimatch'
import { warn } from '../../lib'

// 查找scope下的依赖包
export const checkPackage = (packageJson, scopeName) => {
  const dependObj = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }
  const targetPackages =
    Array.from(
      new Set(
        Object.keys(dependObj).filter((item) => minimatch(item, scopeName))
      )
    ) || []

  if (targetPackages.length === 0) {
    warn(
      `检测到${scopeName}下，没有私有包需要处理`
    )
    return false
  } else {
    warn(
      `检测到${scopeName}下，有${
        targetPackages.length
      }个私有包：${targetPackages.join('，')}`
    )
  }
  return targetPackages
}
