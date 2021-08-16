import packageAction from '../commands/package'
import { execa, fs, cwd } from '../lib'
import * as path from 'path'
import { readFile } from '../commands/utils'
const targetFile = path.join(__dirname, './project-demo')
const packageName = '@jdd/cli-service'

describe('privatify package <package-name>', () => {
  test('将@jdd/cli-service包处理为离线包', async () => {
    expect.assertions(1)
    try {
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
    } catch (e) {
      console.log(e)
    }
  })

  test('从本地安装@jdd/cli-service', async () => {
    execa.commandSync(`npm install ${packageName}`, {
      stdio: 'inherit',
      cwd: targetFile,
    })
  })

  afterAll(() => {
    execa.commandSync(`git reset --hard HEAD`, {
      stdio: 'inherit',
      cwd,
    })
  })
})

describe('privatify package <package-name> [scope]', () => {
  test('将@jdd/cli-service包处理为离线包', async () => {
    expect.assertions(2)
    try {
      await packageAction.action(packageName, '@jdd/*', { context: targetFile })
      expect(
        fs.ensureDir(
          path.join(targetFile, 'private', '@jdd/cli-service-1.0.14.tar.gz')
        )
      )
      const packageJson = readFile(path.join(__dirname, './project-demo'))
      expect(packageJson.devDependencies['@jdd/cli-service']).toBe(
        'file:private/@jdd/cli-service-1.0.14.tar.gz'
      )
    } catch (e) {
      console.log(e)
    }
  })

  test('从本地安装@jdd/cli-service', async () => {
    execa.commandSync(`npm install ${packageName}`, {
      stdio: 'inherit',
      cwd: targetFile,
    })
  })

  afterAll(() => {
    execa.commandSync(`git reset --hard HEAD`, {
      stdio: 'inherit',
      cwd,
    })
  })
})
