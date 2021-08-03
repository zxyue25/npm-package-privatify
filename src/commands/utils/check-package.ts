import * as minimatch from 'minimatch'
import * as chalk from 'chalk'

// 查找scope下的依赖包
export const checkPackage = (packageJson, scopeName) => {
  const targetPackages =
    Array.from(
      new Set(
        Object.keys({
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        }).filter((item) => minimatch(item, scopeName))
      )
    ) || []

  if (targetPackages.length === 0) {
    return false
  } else {
    console.log(
      chalk.yellow(
        `\n检测到${scopeName}下，有${
          targetPackages.length
        }个私有包：${targetPackages.join('，')}\n`
      )
    )
  }
  return targetPackages
}
