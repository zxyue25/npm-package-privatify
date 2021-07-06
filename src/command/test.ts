const action = () => {
  
console.log(process.env.npm_package_name);
}

export default {
  command: 'test',
  description: '初始化',
  action,
}
