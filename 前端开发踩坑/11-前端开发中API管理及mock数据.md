### 1、需求背景

在前后端分离的项目中，前端开发工作，不再依赖后端及时提供接口。一般的工作流程是，在需求确定后，前后端约定接口名称，和接口字段，然后依照文档进行开发；开发完毕且测试通过后，进入测试环境进行联调。在这样的开发流程中，可靠的前端开发手段，就是前端本地进行接口mock。

### 2、实现思路

在使用 vue 开发的前端工程中，开发环境采用的是 webpack 的 devserver 。我们可以将前端发出来的请求，在开发服务器上直接，直接在中间件中拦截掉，直接返回预期的数据。这样的效果是，前端开发中，可以按照真实情况下来请求API，相关的鉴别工作，放在配置中

### 3、API请求管理

前端请求接口，一般使用的模块是 `axios` .

在vue 中集成axios 模块，并进行相关配置：

```javascript
// 1. 添加 axios 依赖
npm i axios
// 2. axios 配置
// 这里配置请求的前缀，如果配置axios的baseURL为test，那么所有的请求，都以test开头
axios.defaults.baseURL = ''
// 3. 导入axios，添加到vue上
let axios = require("axios");
Vue.prototype.$axios = axios;
```

然后将接口进行集中管理，建立API文件夹，导出一个API对象，并挂载到vue上

```javascript
let base = '/user'
let u_list = base + '/list';
let u_info = base + '/info';

vue.prototype.$api = {
    u_list,u_info
}
```

这样，在组件中，需要调用某个接口的时候，只需要 `this.$api.u_list` 即可获取到接口名。

### 4、本地mock管理

vue/cli 配置覆盖了webpack的配置。在webpack的配置中，提供关于开发环境服务器的配置：

```javascript
devServer: { // 开发服务器的配置
    port: "8087",       // 端口号
    host: "localhost",  // 域名
    open: true,         // 配置自动启动浏览器
    proxy: { // 代理服务器配置
        // 对于匹配的请求，去对应的url下使用开发服务进行请求，返回后再由开发服务，返回给前端，从而解决跨域
        '/axios': {
            target: 'http://10.15.255.9:8001/',//跨域请求头信息
            changeOrigin: true,
            secure: false, // 如果是https接口，需要配置这个参数
            pathRewrite: {
                '^/axios': ''
            }
        }
    },
    before(app){ // 开发服务的中间件 - 所有中间件中最先执行的功能
        // 本地接口，使用 test 作为前缀，开发服务进行拦截，直接返回 mock 数据
        app.get('/test/peolist',(req,res)=>{
            res.json(peo_list);
        })
    }
},
```

具体的创建步骤：

* 添加mock 数据

  在项目中，建立 mock 文件夹（mock文件夹，可以分设子文件夹）。添加 json 文件，文件内容，采取和接口一样的结构。

* 设置 axios 测试前缀

  将axios 的baseURL，设置为`/test` 。这样会在所有的请求前面，都加一个 'test' 。

* 配置 vue.config.js

  在 vue 配置文件中，设置开发服务的接口：

  ```javascript
  devServer :{
      before:function (){}
  }
  ```

* 在 mock 中，集中添加请求

  在mock 文件下，给 3 步骤中的before 字段，到处一个具体的函数,建立 mockAPI.js文件：

  ```javascript
  /**
   * 导出的方法，用于在 vue.config.js 中引入，作为 devServer 对象的一个方法函数
   * 方法调用时，会传入app，服务实例
   */
  let demoResponse = require('./demo.json'); // 1步骤中，设置的json 文件
  module.exports = function (app){
      app.get('/test/demo',(req,res)=>{
          res.json(demoResponse); // response 返回对应的json 文件
      })
  }
  ```

  







