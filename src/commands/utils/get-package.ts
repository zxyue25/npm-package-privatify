import * as minimatch from 'minimatch'

// 查找scope下的依赖包
export const getPackage = (json, filterName) => {
  const packageNameArr =
    Array.from(
      new Set(
        Object.keys({
          ...json.dependencies,
          ...json.devDependencies,
        }).filter((item) => minimatch(item, filterName))
      )
    ) || []
  return packageNameArr
}