import { checkPackage, readFile } from '../commands/utils'

const packageJson = readFile('src/__tests__/project-demo')

test('检查package.json下不存在scope私包', () => {
  expect(checkPackage(packageJson, '@jdd')).toBeFalsy()
})

test('检查package.json下存在scope私包', () => {
  expect(checkPackage(packageJson, '@jdd/**')).toEqual(['@jdd/cli-plugin-babel', '@jdd/cli-plugin-vue', '@jdd/cli-service'])
})
