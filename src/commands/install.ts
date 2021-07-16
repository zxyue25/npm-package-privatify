export const action = async () => {
  console.log('安装搭建的npm私服的包')
}

export default {
  command: 'package registry install',
  description: '安装搭建的npm私服的包',
  action,
}
