let http = require('http');
let fs = require('fs');
let util = require('./util.js');

let app = http.createServer();

app.on("request", (req, res) => {
    // 设置跨域响应头
    res.setHeader("Access-Control-Allow-Origin", "*")

    console.log('请求进入：', req.method);
    // 只接受post请求，
    if (req.method == 'POST') {
        // 总的缓存区
        let chunk = [];
        // post请求的分割标识
        const boundary = '--' + req.headers['content-type'].split('; ')[1].split('=')[1];
        // 接收数据 事件
        req.on('data', d => {
            chunk.push(d);
        })
        // 数据接收完毕
        req.on('end', () => {
            // 拼接整体的post信息
            let data = Buffer.concat(chunk);
            // 用post分隔符进行切割， 分成很多缓存区
            let data_list = util.buffer_split(data, boundary);
            console.log(data_list);
            data_list.forEach(value => {
                console.log('检查一个字段：-----')
                if (value.file_name) {
                    fs.writeFile(value.file_name, value.data, e => {
                        if (e) {
                            console.log('文件保存失败', e)
                        } else {
                            console.log('文件保存成功')
                        }
                    })
                } else {
                    console.log('纯粹表单，无文件上传')
                }
            })
            res.end('上传文件成功')
        })
    } else if (req.method == 'GET') {
        let file_name = req.url.slice(1);
        let size = req.headers.range.split('-');
        // console.log(req.headers);
        fs.readFile(file_name, (e, d) => {
            if (e) {
                console.log('文件读取出错：', e)
                res.end("文件读取出错")
            } else {
                res.end(d.slice(size[0], size[1]));
            }
        })
        // console.log(req.url);
        // console.log(req.headers)
        // res.end('下载文件')
    } else {
        //  OPTIONS
        // 假设全部都是预检测
        // console.log('非 get 和 post',req.url,req.headers)
        res.setHeader('Access-Control-Allow-Headers', 'Range')
        res.end("200");
    }
})

app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/')
})