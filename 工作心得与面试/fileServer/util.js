/**
 * buffer 示例
 ------WebKitFormBoundaryL5AGcit70yhKB92Y\r\n
Content-Disposition: form-data; name="username"\r\n
\r\n
lee\r\n
------WebKitFormBoundaryL5AGcit70yhKB92Y\r\n
Content-Disposition: form-data; name="password"\r\n
\r\n
123456\r\n
Content-Disposition: form-data; name="file"; filename="upload.txt"\r\n
Content-Type: text/plain\r\n
\r\n
upload\r\n
------WebKitFormBoundaryL5AGcit70yhKB92Y--
可以简化为：
<分隔符>\r\n字段头\r\n\r\n内容\r\n
 */
function buffer_split(buffer, boundary) {
    let result = [];
    // let start = 0;
    while (true) {
        let index = buffer.indexOf(boundary);
        if (index != -1) {
            result.push(buffer.slice(0, index));
            buffer = buffer.slice(index + boundary.length);// 截取剩下的buffer
        } else {
            break;
        }
    }
    // 清楚result 的第一个， 和最后一个元素（最后一个不用删），
    // result.pop();
    result.shift();
    // 每一组，都是\r\n字段头\r\n\r\n内容\r\n，再清理掉头和尾的\r\n
    result = result.map(v => {
        return v.slice(2, v.length - 2);
    })
    // 再讲每一次，重复上面切割的步骤，\r\n\r\n，拼为一个对象，包括原始数据，和头信息
    result = result.map(item => {
        let index = item.indexOf('\r\n\r\n');
        let head = item.slice(0, index);
        let data = item.slice(index + 4);
        head = head.toString().split('\r\n')[0].split('; ');
        let name = head[1].split('=')[1].replace(/^\"|\"$/ig, '');
        let file_name = head[2] ? head[2].split('=')[1].replace(/^\"|\"$/ig, '') : undefined;
        // console.log('head:', head);
        return {
            name, file_name, data
        }
    })
    return result
}

module.exports = {
    buffer_split
}