import packageAction from '../commands/package'
import { fs } from '../lib'
import * as path from 'path'
import { readFile } from '../commands/utils'
const targetFile = path.join(__dirname, './project-demo')
const packageName = '@jdd/cli-service'
describe('privatify package <package-name> [scope]', () => {
  test('将@jdd/cli-service包处理为离线包', async () => {
    await packageAction.action(packageName, '', { context: targetFile })
    expect(
      fs.ensureDir(
        path.join(targetFile, 'private', '@jdd/cli-service-1.0.14.tar.gz')
      )
    )
    const packageJson = readFile(path.join(__dirname, './project-demo'))
    expect(packageJson.devDependencies['@jdd/cli-service']).toBe(
      'file:private/@jdd/cli-service-1.0.14.tar.gz'
    )
  })

  test('从本地安装@jdd/cli-service', async () => {
    await packageAction.action(packageName, '', { context: targetFile })
    expect(
      fs.ensureDir(
        path.join(targetFile, 'private', '@jdd/cli-service-1.0.14.tar.gz')
      )
    )
    const packageJson = readFile(path.join(__dirname, './project-demo'))
    expect(packageJson.devDependencies['@jdd/cli-service']).toBe(
      'file:private/@jdd/cli-service-1.0.14.tar.gz'
    )
  })

  // test('将<package-name>包处理为离线包，并将该私有包依赖子包在[scope]下的包也处理为离线包', async () => {
  //   const packageName = '@jdd/cli-service'
  //   const scopeName = '@jdd/**'
  //   await packageAction.action(packageName, scopeName)
  // })
})
