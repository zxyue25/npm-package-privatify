import { tarGz } from '../commands/utils'
import { fs, targetFile, cwd } from '../lib'
import * as path from 'path'

beforeAll(() => {
  fs.copySync(
    path.join(cwd, 'node_modules', '@babel/code-frame'),
    path.join(__dirname, './project-demo', targetFile, '@babel/code-frame')
  )
})
test('压缩', async () => {
  expect.assertions(1)
  try {
    await tarGz('@babel', 'code-frame', '1.0.1', 'src/__tests__/project-demo')
    expect(
      fs.existsSync(
        path.join(
          __dirname,
          './project-demo',
          targetFile,
          '@babel/code-frame-1.0.1.tar.gz'
        )
      )
    ).toBeTruthy()
  } catch (e) {
    console.log(e)
  }
})
afterAll(() => {
  fs.remove(path.join(__dirname, './project-demo', targetFile, '@babel'))
})
