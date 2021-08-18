import { cwd, fs, targetFile } from '../../lib'
import * as path from 'path'
import * as compressing from 'compressing'

// 将文件压缩为.tar.gz
export const tarGz = async (filePath, fileName, fileVersion, preFile = cwd) => {
  const packagePath = `${preFile}/${targetFile}/${filePath}`
  const zipFileName = fileVersion ? `${fileName}-${fileVersion}` : fileName
  await compressing.tar.compressDir(
    path.join(packagePath, fileName),
    path.join(packagePath, `${zipFileName}.tar`)
  )
  await compressing.gzip.compressFile(
    path.join(packagePath, `${zipFileName}.tar`),
    path.join(packagePath, `${zipFileName}.tar.gz`)
  )
  fs.removeSync(path.join(packagePath, `${zipFileName}.tar`))
  fs.removeSync(path.join(packagePath, fileName))
}
