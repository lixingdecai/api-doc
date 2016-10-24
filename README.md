##在线文档<br>
```
匹配[美柚](http://www.meiyou.com/)现在的业务和需求开发的 start at 2016-8-30
适合根据公司的业务场景 进行二次开发。

相关参考：仿照阿里开源项目[RAP](https://github.com/thx/RAP)、谷歌postman、[汉化版Swagger-UI](http://helei112g.github.io/swagger-ui/#!/pet/findPetsByStatus)
```
##使用场景
```
痛点：传统接口交互都是根据技术聊天信息或者简易文本交流,没有一个具体存放和管理的地方。前端、后端、需求或者测试都会很容易出些各种扯皮 和互相等待的情况。极度浪费时间和降低开发效率。  
场景：在需求确立 建立模型后，前端 后端人员能根据在线文档并行开发。并对接口做统一的记录和管理，免除不必要扯皮和等待，提高开发效率。
```
##网页截屏 
   ![接口详情](https://github.com/lixingdecai/api-doc/raw/master/public/images/ScreentShot1.png)

##技术栈
```
前端：angularjs 1.x + bootstrap3.0 + gulp + sass + webpack  
后端：nodejs + express + redis + moongodb + mongoose  
前后端分离，前端采用MVC分层架构，前端有ng自己的路由配置 轻量级、搭建简单上手容易。
```
##安装&&运行

```
// 下载依赖包
npm i  
// 运行node 服务器
npm run start
// 另起个命令窗口 运行前端编译监听命令
cd tools
gulp
```

##功能描述

```
接口详情按 项目->页面->接口 的层级划分。  
接口详情属性：  
         -名称  
         -请求类型  
         -请求url  
         -网络协议类型 （http 、 https）  
         -所在产品线 (不同产品线可能会使用同一个api)  
         -请求参数  （拼在链接里的数据）  
         -请求数据  （post 附带的data数据，有三种类型：form-data、x-wwww-urlencoded、raw）  
         -请求头信息  
         -响应参数  
         -备注  

接口详情功能：  -增、删、改
          -添加订阅 （接口变更会通知提醒）
          -历史列表 （可查看历史详情）
          -添加标签 （自定义分类信息）

其他功能模块（围绕接口详情的）： -接口列表
                        -产品列表
                        -项目列表
                        -标签管理
                        -用户管理(工程为内部使用，只有管理员有增删改用户的功能)
```

##项目结构说明

```
-bin
  -www          node启动入口文件
-config         mongodb、redis、mongoose启动 的配置信息
-models         服务器mongodb数据模型
-public         前端所有文件
  -bulid        前端编译后存放文件位置
  -css          sass等css
  -images       图片
  -js           前端的脚本 controller、service
  -libs         前端引用静态文件
  -template     ng的页面模版（可以直接理解为页面）
-tool           
  -gulpfile     自动化工具 浏览器自动刷新、文件监听、sass转译、调用webpack
  -webpack      合并打包 es6语法转译、静态资源的加载、
-.editorconfig  ide格式化配置
-.eslintignore  eslint忽略
-.eslintrc      eslint配置
-.gitignore     git忽略配置
```

##开发帮助 
```
命令&&工具
supervisor 命令 服务器修改自动重启
node-inspector 命令 服务器debug监听命令
browser-sync gulp工具 监听修改自动刷新浏览器
```
##注意
```
安装的初始化的时候，可能会报一些错，有些工具是安装在全局, 没有列在package.json中
需提前安装mongodb 和 redis 。网上都有相应的教程，挺简单的。
```
##坑
```
redis 在windows下只能安装版本需为2.8：其他版本出现redis无法存储的问题
```
