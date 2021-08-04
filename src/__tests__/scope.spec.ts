import scopeAction from '../commands/scope'

describe('privatify create', () => {
  test('创建私服仓库', async () => {
    const scopeName = '@jdd/**'
    await scopeAction.action(scopeName)
  })
})
