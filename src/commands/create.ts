import * as path from 'path'
import * as handlebars from 'handlebars'
import * as inquirer from 'inquirer'
import {
  cwd,
  chalk,
  execa,
  fs,
  startSpinner,
  succeedSpiner,
  failSpinner,
} from '../lib'

// 初始化工程
const downloadCode = async (projectName) => {
  const targetDir = path.join(cwd, projectName)
  if (!(await checkProjectExist(targetDir))) {
    return false
  }
  startSpinner(`开始创建私服仓库 ${chalk.cyan(targetDir)}`)
  try {
    // 复制'private-server-boilerplate'到目标路径下创建工程
    await fs.copy(
      path.join(__dirname, '..', '..', 'private-server-boilerplate'),
      targetDir
    )
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `package name: (${projectName})`,
        default: projectName,
      },
      {
        type: 'input',
        name: 'description',
        message: 'description',
      },
      {
        type: 'input',
        name: 'author',
        message: 'author',
      },
    ])

    // handlebars模版引擎解析用户输入的信息存在package.json
    const jsonPath = `${targetDir}/package.json`
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
    const jsonResult = handlebars.compile(jsonContent)(answers)
    fs.writeFileSync(jsonPath, jsonResult)

    // 新建工程装包
    try {
      execa.commandSync('npm install', {
        stdio: 'inherit',
        cwd: targetDir,
      })
    } catch (err) {
      failSpinner(err)
      return
    }

    succeedSpiner(
      `私服仓库创建完成 ${chalk.yellow(
        projectName
      )}\n👉 输入以下命令开启私服: \n`
    )

    console.log(chalk.cyan(`$ cd ${projectName}\n$ sh start.sh\n`))
  } catch (err) {
    failSpinner(err)
    return
  }
}

// 检查是否已经存在相同名字工程
const checkProjectExist = async (targetDir) => {
  if (fs.existsSync(targetDir)) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'checkExist',
      message: `\n仓库路径${targetDir}已存在，请选择`,
      choices: ['覆盖', '取消'],
    })
    if (answer.checkExist === '覆盖') {
      console.log(`删除 ${chalk.cyan(targetDir)}...\n`)
      fs.removeSync(targetDir)
      return true
    } else {
      return false
    }
  }
  return true
}

const action = async (projectName) => {
  await downloadCode(projectName)
}

export default {
  command: 'create <registry-name>',
  description: '创建一个npm私服仓库',
  action,
}
