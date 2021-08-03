import { cwd, fs } from '../../lib'
import * as path from 'path'

export const readFile = (
  filePath: string = '',
  fileName: string = 'package.json'
) => {
  const data = fs.readFileSync(path.join(cwd, filePath, fileName), 'utf8')
  const json = JSON.parse(data)
  return json
}
