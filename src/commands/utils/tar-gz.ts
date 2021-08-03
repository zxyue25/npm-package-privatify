import { cwd, fs, targetFile } from '../../lib'
import * as path from 'path'
import * as compressing from 'compressing'

// 将文件压缩为.tar.gz
export const tarGz = async (
  filePath,
  fileName,
  fileVersion
) => {
  const packagePath = `${targetFile}/${filePath}`
  const zipFileName = fileVersion ? `${fileName}-${fileVersion}` : fileName
  await compressing.tar.compressDir(
    path.join(cwd, packagePath, fileName),
    path.join(cwd, packagePath, `${zipFileName}.tar`)
  )
  await compressing.gzip.compressFile(
    path.join(cwd, packagePath, `${zipFileName}.tar`),
    path.join(cwd, packagePath, `${zipFileName}.tar.gz`)
  )
  fs.removeSync(path.join(cwd, packagePath, `${zipFileName}.tar`))
  fs.removeSync(path.join(cwd, packagePath, fileName))
}
