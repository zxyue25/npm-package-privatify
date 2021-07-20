offline-npm-registry
====
npm 私有库离线包。

### 部署步骤：

1. git clone 本仓库到本地有网环境；
2. 有网环境安装私服， 执行 `sh start.sh`.
3. 通过本地私服安装项目依赖, 进入项目目录执行 `npm i --registry http://localhost:4873`；
4. 依赖安装成功后，storage 目录会缓存依赖包；
5. 将本目录所有文件（包含 storag目录 ）上传至无网环境，执行 `sh start.sh` 安装 npm 私服。