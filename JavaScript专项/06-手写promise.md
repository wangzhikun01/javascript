```javascript
// https://www.jianshu.com/p/c633a22f9e8c
let pending = 'pending';
let resolved = "resolved";
let rejected = "rejected";

function myPromise(fn) {
    let that = this; // 再闭包中， 重新存储一个this，方便再 resolve 和 rejected 中进行计算
    this.state = pending; // 存储运行状态
    this.value = undefined; // 成功时，存储值
    this.reason = undefined; // 失败时，存储原因
    // 等待状态，增加 成功回调，和失败回调的数组
    this.onResolveList = [];
    this.onRejecteList = [];

    function resolve(value) {
        // 判断状态，决定是否更新状态
        if (that.state == pending) {
            that.value = value; // 保存成功的结果
            // then 中，把回调函数，存进了数组
            // 等待异步执行时，会调用传入的回调函数，这时候遍历
            this.onResolveList.forEach(fn => fn(value));
            that.state = resolved;
        }
    }
    function rejecte(reason) {
        // 判断状态，决定是否更新状态
        if (that.state == pending) {
            that.reason = reason; // 保存失败的原因
            // then 中，把回调函数，存进了数组
            // 等待异步执行时，会调用传入的回调函数，这时候遍历
            this.onRejecteList.forEach(fn => fn(reason));
            that.state = rejected;
        }
    }
    fn(resolve, rejecte);
}

// 原型方法，then
// 处理传入的回调函数
myPromise.prototype.then = function (onResolve, onRejecte) {
    // 成功状态，且传入的是函数，则执行
    if ((this.state == resolved) && (typeof onResolve == 'function')) {
        onResolve(this.value);
    }
    // 失败状态，且传入的是函数，则执行
    if ((this.state == rejected) && (typeof onRejecte == 'function')) {
        onRejecte(this.reason);
    }
    // 执行状态
    // 如果 promise 初始化时，传入的是异步函数
    // promise 示例调用了then 时，回调还不应该触发
    // 则使用一个数组，把回调函数分别进行存储
    // 调用then时，如果是处于 执行状态，则分别将成功回调，和失败回调的函数，存放进对应的数组
    if (this.state == pending) {
        if (typeof onResolve == 'function') {
            this.onResolveList.push(onResolve);
        }
        if (typeof onRejecte == 'function') {
            this.onRejecteList.push(onRejecte);
        }
    }
}


let test_obj = new Promise(function(suc,fail){
    console.log('promise 执行传入的函数')
    setTimeout(()=>{
        console.log('promise 传入的函数-异步执行');
        suc();
    },2000);
})

test_obj.then(()=>{
    console.log('成功回调执行')
})
```

