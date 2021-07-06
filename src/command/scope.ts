const action = async () => {
    console.log('dd')
}

export default {
    command: 'scope <scopeName>',
    description: '将某一个包下的',
    action,
}