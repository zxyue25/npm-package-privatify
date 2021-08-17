import scopeAction from '../commands/scope'
import * as path from 'path'
import { fs } from '../lib'
const targetFile = path.join(__dirname, './project-demo')

describe('privatify scope', () => {
  beforeAll(() => {
    fs.removeSync(path.join(targetFile, 'private'))
  })
  test('将@jdd处理为离线包', async () => {
    const scopeName = '@jdd'
    expect.assertions(1)
    try {
      await scopeAction.action(scopeName, { context: targetFile })
      expect(fs.existsSync(path.join(targetFile, 'private'))).toBeFalsy()
    } catch (e) {
      console.log(e)
    }
  })
  test('将@jdd/**处理为离线包', async () => {
    const scopeName = '@jdd/**'
    expect.assertions(2)
    try {
      await scopeAction.action(scopeName, { context: targetFile })
      expect(
        fs.existsSync(
          path.join(targetFile, 'private', 'jdd/cli-shared-utils-1.0.14.tar.gz')
        )
      ).toBeTruthy()
      expect(
        fs.existsSync(
          path.join(targetFile, 'private', 'jdd/cli-service-1.0.14.tar.gz')
        )
      ).toBeTruthy()
    } catch (e) {
      console.log(e)
    }
  })
})
