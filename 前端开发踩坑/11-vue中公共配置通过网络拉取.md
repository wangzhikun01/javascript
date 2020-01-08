## vue中的公共配置

### 1、需求背景
在实际开发中，对于使用到的API，我们常对其进行抽离，和业务代码进行解耦.

首先建立 api 文件，单独管理所有 api
> 仅仅是个例子，实际中的 API 管理，需要根据对象来划分模块
```javascript
// api.js

let base_url = 'http://cccc.com'
let down_url = '/down';

Vue.prototype.base_url = base_url
export default{}
```

然后在业务中进行使用
```javascript
// demo.vue
<template></template>
<script>
export default{
    created(){
        console.log(this.base_url);
    }
}
</script>
```

### 2、遇到的问题
