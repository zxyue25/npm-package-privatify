import * as fs from 'fs-extra'

export const removedir = async (dirPath) => {
  let files = []
  if (fs.existsSync(dirPath)) {
    files = fs.readdirSync(dirPath)
    files.forEach(function(file) {
      let curPath = dirPath + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        removedir(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}
