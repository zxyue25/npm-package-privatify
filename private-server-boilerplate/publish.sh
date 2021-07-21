#!/bin/bash

function read_dir(){
    for file in `ls $1`       #注意此处这是两个反引号，表示运行系统命令
    do
        npm publish $1"/"$file --registry http://localhost:4873  #在此处处理文件即可
    done
}   
#读取第一个参数
read_dir $1