let http = require("http");
let net = require('net');
const crypto = require('crypto');
let emit = require('events');

let all_msg = [];
let new_list = [];
let user_list = [];


let server = new net.Server();
server.listen(3000, () => {
    console.log("ws://127.0.0.1:3000")
})
server.on('connection', io => {
    let isWebSocket = false;
    console.log('server connet events');
    // io.end('you send a msg');
    io.on('data', d => {
        if (isWebSocket) { // 非首次发生data事件，且协议已经升级过
            // 数据交换的方式，使用ws协议来交换，需要单独拼接数据帧的格式
            /*
            console.log('正常进行的ws协议')
            new_list.push(d.toString());
            user_list.forEach(v=>{
                v.write(JSON.stringify({list:new_list}))
            })
            all_msg = all_msg.concat(new_list);
            new_list = [];
            */
        } else { // 当前 io 首次进入，进行协议升级
            let key;
            let head = d.toString().split('\n');
            head.forEach(v => {
                let keys = v.split(':');
                if (keys[0] == 'Sec-WebSocket-Key') {
                    key = keys[1].trim();
                }
            })
            key = crypto
                .createHash('sha1')
                .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
                .digest('base64')
            let response = [
                'HTTP/1.1 101 Switching Protocols',
                'Upgrade: websocket',
                'Connection: Upgrade',
                'Sec-WebSocket-Accept: ' + key,
                'Sec-WebSocket-Version: 13',
                '\r\n'
            ].join('\r\n');
            // console.log(d.toString())
            // console.log(io.address())
            // console.log(response);
            io.write(response, () => {
                // console.log('io write . ')
                isWebSocket = true;
                user_list.push(io);
            });
        }
        // io.write('hello')
    })
})