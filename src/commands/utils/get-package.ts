import * as minimatch from 'minimatch'

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