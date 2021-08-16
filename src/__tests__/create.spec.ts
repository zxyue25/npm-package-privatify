import { cloneProject } from '../commands/create'
import * as path from 'path'
import { fs } from '../lib'
import { readFile } from '../commands/utils'

const targetDir = path.join(__dirname, './_test-pro1')
describe('privatify create', () => {
  test('创建私服仓库', async () => {
    const projectName = '_test-pro1'
    const projectInfo = {
      name: '_test-pro1',
      description: 'test privatify create cloneProject',
      author: 'zxyue25',
    }
    await cloneProject(targetDir, projectName, projectInfo)
    expect(fs.ensureDir(targetDir)).toBeTruthy()
    const packageJson = readFile('src/__tests__/_test-pro1')
    expect(packageJson.name).toBe(projectInfo.name)
    expect(packageJson.description).toBe(projectInfo.description)
    expect(packageJson.author).toBe(projectInfo.author)
  })

  afterAll(() => {
    fs.remove(targetDir)
  })
})
