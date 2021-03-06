const minimist = require('minimist')
const rawArgs = process.argv.slice(2)
const args = minimist(rawArgs)

let regexPath = '../src/__tests__/(.*).spec.ts'
if (args.p || args.path) {
  const path = (args.p || args.package).split(',').join('|')
  regexPath = `../src/__tests__/(${path}).spec.ts`
  const i = rawArgs.indexOf('-p')
  rawArgs.splice(i, 2)
}

const jestArgs = ['--env', 'node', '--runInBand', ...rawArgs, regexPath]

console.log(`running jest with args: ${jestArgs.join(' ')}`)

require('jest').run(jestArgs)
