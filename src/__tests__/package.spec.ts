import packageAction from '../commands/package'
import { execa, fs, cwd } from '../lib'
import * as path from 'path'
import { readFile } from '../commands/utils'
const targetFile = path.join(__dirname, './project-demo')
const packageName = '@jdd/cli-service'

describe('privatify package <package-name>', () => {
  beforeAll(() => {
    fs.removeSync(path.join(targetFile, 'private'))
  })

  test('将@jdd/cli-service包处理为离线包', async () => {
    expect.assertions(1)
    try {
      await packageAction.action(packageName, '', { context: targetFile })
      expect(
        fs.existsSync(
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
    execa.commandSync('git checkout src/__tests__/project-demo/package*.json', {
      stdio: 'inherit',
      cwd,
    })
    fs.removeSync(path.join(targetFile, 'private'))
  })
})

describe('privatify package <package-name> [scope]', () => {
  beforeAll(() => {
    fs.removeSync(path.join(targetFile, 'private'))
  })

  test('将@jdd/cli-service @jdd/*处理为离线包', async () => {
    expect.assertions(1)
    try {
      await packageAction.action(packageName, '@jdd/*', { context: targetFile })
      expect(
        fs.existsSync(
          path.join(targetFile, 'private', '@jdd/cli-service-1.0.14.tar.gz')
        )
      )
      expect(
        fs.existsSync(
          path.join(
            targetFile,
            'private',
            '@jdd/cli-shared-utils-1.0.14.tar.gz'
          )
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
    execa.commandSync('git checkout src/__tests__/project-demo/package*.json', {
      stdio: 'inherit',
      cwd,
    })
    fs.removeSync(path.join(targetFile, 'private'))
  })
})
