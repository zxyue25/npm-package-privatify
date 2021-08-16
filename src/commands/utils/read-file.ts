import { cwd, fs } from '../../lib'
import * as path from 'path'

// 读取文件
export const readFile = (
  filePath: string = '',
  fileName: string = 'package.json'
) => {
  const data = fs.readFileSync(path.join(filePath, fileName), 'utf8')
  const packageJson = JSON.parse(data)
  return packageJson
}
