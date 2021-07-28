import create from '../src/commands/create'

describe('创建私服仓库', () => {
  test('创建私服仓库', () => {
    create.action("projectName")
  })
})
