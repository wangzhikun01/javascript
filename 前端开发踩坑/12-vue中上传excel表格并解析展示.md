### 1、需求背景

前端提供上传文件的功能（文件类型限定为 excel表格），然后将文件的内容传输到服务端进行存储，并且在前端展示出表格的内容。

### 2、实现思路

input 组件，将文件获取后，会将文件内容读取进缓存内。同时，JavaScript提供的原生对象，`FileReader` 具有对文件的操作能力。可以使用  FileReader  来对input 组件存进缓存的文件，进行操作。文件的缓存格式，有两种：

* [[Int8Array]]
* [[Uint8Array]]

我们可以自己写一套规则，来对数组里的内容，逐个进行解析。

在项目中，为了避免重复造轮子，我采取了开源的工具库：`xlsx` 

### 3、实现代码

首先安装我们需要的函数库，并加载到vue 原型上：

```javascript
npm i xlsx -S
// 在 main.js文件中，导入
import xlsx from "xlsx";
vue.prototype.$xlsx = xlsx;
```

这样，我们就可以在vue的组件中进行使用。

上传表格的组件：

```vue
<template>
  <div>
    <input type="file" @change="handleFile" />
  </div>
</template>
<script>
export default {
  methods: {
    handleFile(e) {
        let files = e.target.files;
        let f = files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(f);
        reader.onload =  (e)=>{
            console.log(e.target.result);
            let data = new Uint8Array(e.target.result);
            let workbook = this.$xlsx.read(data,{type:"array"});
            console.dir(workbook);
            // work book 是一个对象
            // 对象内容有表格的所有内容
            // 可以解析该对象，并且根据实际的数据，渲染到页面中
        }
    }
  }
};
</script>
```











