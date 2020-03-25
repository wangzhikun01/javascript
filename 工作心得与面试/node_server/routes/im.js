/**
 *  IM 通讯模块
 */

var express = require('express');
var router = express.Router();
let emit = require('events');

/**
 *  comet 方式
 */
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

