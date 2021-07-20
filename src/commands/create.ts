import * as path from 'path'
import * as fs from 'fs-extra'
import * as handlebars from 'handlebars'
import * as ora from 'ora'
import * as inquirer from 'inquirer'
import * as chalk from 'chalk'
import { cwd } from '../lib'
import * as execa from 'execa'

// 初始化工程
const downloadCode = async (projectName) => {
  const projectPath = path.join(cwd, projectName)
  if (!(await checkExist(projectName))) {
    return false
  }
  // 下载之前做loading提示
  const spinner = ora().start(
    `\n✨  开始创建私服仓库 ${chalk.cyan(projectPath)}.`
  )
  try {
    await fs.copy(
      path.join(__dirname, '..', 'template'),
      path.join(cwd, projectName)
    )
    spinner.succeed()
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
    const packagePath = `${projectName}/package.json`
    const packageContent = fs.readFileSync(packagePath, 'utf-8')
    //使用handlebars解析模板引擎
    const packageResult = handlebars.compile(packageContent)(answers)
    //将解析后的结果重写到package.json文件中
    fs.writeFileSync(packagePath, packageResult)

    try {
      execa.commandSync('npm install', {
        stdio: 'inherit',
        cwd: path.join(cwd, projectName),
      })
    } catch (err) {
      spinner.fail()
      console.log(err, chalk.red(err))
      return
    }

    console.log(`\n🎉  私服仓库创建完成 ${chalk.yellow(projectName)}.`)
    console.log(`👉  输入以下命令开启私服: \n`)
    console.log(chalk.cyan(`$ cd ${projectName}\n$ sh start.sh\n`))
  } catch (err) {
    spinner.fail()
    console.log(err, chalk.red(err))
    return
  }
}

// 检查是否已经存在相同名字工程
const checkExist = async (projectName) => {
  const projectPath = path.join(cwd, projectName)
  if (fs.existsSync(projectPath)) {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'checkExist',
      message: `\n仓库路径${projectPath}已存在，请选择`,
      choices: ['覆盖', '取消'],
    })
    if (answer.checkExist === '覆盖') {
      console.log(`删除 ${chalk.cyan(projectPath)}...\n`)
      fs.removeSync(projectPath)
      return true
    } else {
      return false
    }
  }
  return true
}

const action = (projectName) => {
  downloadCode(projectName)
}

export default {
  command: 'create <registry-name>',
  description: '创建一个npm私服仓库',
  action,
}
