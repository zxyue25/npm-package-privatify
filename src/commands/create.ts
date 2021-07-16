export const action = async () => {
  console.log('初始化一个npm私服仓库')
}

export default {
  command: 'package registry create',
  description: '初始化一个npm私服仓库',
  action,
}
