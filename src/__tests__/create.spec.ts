import createAction from '../commands/create'

describe('privatify create', () => {
  test('创建私服仓库', async () => {
    const projectName = '_test-pro1'
    await createAction.action(projectName)
  })
})
