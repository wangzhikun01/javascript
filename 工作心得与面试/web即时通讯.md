# 前言
主流的web即时通讯技术，有四种：
* 传统Ajax短轮询
* Comet技术
* WebSocket技术
* SSE（Server-sent Events）

# 一、传统Ajax短轮询
# 二、Comet技术
> Comet技术，也叫“服务器推送”技术。在其他新兴技术，还没有解决浏览器兼容性的前提下，服务器推送技术，目前存在着很广泛的需求。

[参考文档](http://www.52im.net/thread-334-1-1.html)

## 1、基于HTTP长链接
“Comet”技术，是一种种基于 HTTP 长连接、无须在浏览器端安装插件的“服务器推”技术，目前有两种实现模型：
* 基于 AJAX 的长轮询（long-polling）方式
* 基于 Iframe 及 htmlfile 的流（streaming）方式

### 1.1 基于AJAX的长轮询方式
这种模式下，ajax请求的过程：
* 如果未和服务端建立联系，首先建立联系
* 服务端阻塞这个请求，不进行返回
* 如果有新消息进入，或者请求超时，再将这个请求进行返回
* 客户端ajax，在获取到请求结果后，进行结果处理
* 这个过程是断开连接的，服务端依然会积攒消息
* 客户端处理完了请求结果，再次进行连接请求

ajax的请求对象，XMLHttpRequest，的readystate == 4时，代表传输结束。所以我们可以监听 XHRHttpRequest 的 onreadystatechange 事件。

### 1.2 使用iframe
在页面中，嵌入一个隐藏的iframe，然后src 设置为请求的服务端地址，就可以不停的获取数据。缺点是只能获取对前端JavaScript函数的调用，有点类似jsonp。不做深入了解。

## 2、基于HTTP的长链接实现
以下示例，基于express框架演示。

新建express 项目，添加 im.js 路由模块，并且在 app.js 模块中进行导入：
```javascript
/**
 *  IM 通讯模块
 */
var express = require('express');
var router = express.Router();
let emit = require('events');
let msg_list = []; // {from:"",to:'',msg:''}
let msg_emit = new emit();
let wait_response;
msg_emit.on('pushMsg', () => {
    if (wait_response) {
        clearTimeout(wait_response.time_out);
        let m = msg_list.shift();
        wait_response.res.end("hello " + m.to + ' , message from ' + m.from + ' : ' + m.msg);
    }
})
/* send : 发送消息接口*/
router.get('/comet-send', function (req, res, next) {
    console.log(req.query);
    msg_list.push(req.query);
    msg_emit.emit('pushMsg');
    res.end("ok");
});
/* 获取消息接口 */
router.get('/comet-get', function (req, res, next) {
    // 超时处理
    let time_out = setTimeout(function () {
        res.end('5000 : no message .');
    }, 5000);
    // 有消息主动发入
    wait_response = {
        res, time_out
    }
});
module.exports = router;

```

访问：http://localhost:3000/im/comet-get ，获取消息接口，当没有消息时，会阻塞不返回。
访问：http://localhost:3000/im/comet-send?msg=welcome&from=root&to=admin ，发送消息接口。

当获取消息接口阻塞时，如果立即调用发送消息接口，可以看到，获取消息接口立即进行返回。


# 三、WebSocket技术
# 四、SSE（Server-sent Events）