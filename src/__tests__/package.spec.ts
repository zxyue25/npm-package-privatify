import packageAction from '../commands/package'

describe('privatify package <package-name> [scope]', () => {
  test('将<package-name>包处理为离线包', async () => {
    const packageName = '@jdd/cli-service'
    await packageAction.action(packageName)
  })
  test('将<package-name>包处理为离线包，并将该私有包依赖子包在[scope]下的包也处理为离线包', async () => {
    const packageName = '@jdd/cli-service'
    const scopeName = '@jdd/**'
    await packageAction.action(packageName, scopeName)
  })
})
