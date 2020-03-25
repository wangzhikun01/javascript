> JavaScript异步：使用环境提供的线程，来单独完成一些耗时操作，比如网络请求，文件读取等。异步线程执行完毕，会通知主线程来执行相关的回调函数。

## 一、传统异步编程
传统的异步编程，是通过回调函数的方式来实现的。异步操作，通过参数，来接受一个传入的函数，当异步操作返回结果时，就执行这个函数。我们使用经典的ajax请求，来看一下这个问题：
```javascript
let xhr = new XMLHttpRequest();
xhr.addEventListener('readystatechange', (e) => {
    console.log("ready state change :", xhr.readyState);
    if (xhr.readyState === 4) {
        console.log('成功获取了响应 : ', xhr.responseText);
        // 这里是响应成功后的操作
    }
});
xhr.open('get', 'http://127.0.0.1:80/')
xhr.send();
```
这种回调的方式，是使用最广泛的方式，也是用的最多的方式。但是这种方式带来的问题就是，如果多个异步操作存在依赖关系，则会产生难以维护的代码，造成业内著名的难题“回调地狱”。而且还存在一个问题，就是回调中如果插入大量的逻辑，回导致代码难以维护。

## 二、`Promiese`对象解决方案
在es6中，统一提供了 Promise 对象，这个对象提供了对异步操作更强大，更合理的解决方案。
### 1、`Promise` 构造函数
```javascript
let promise_obj = new Promise(function (suc, fail) {
    // 操作逻辑，可以是异步操作
    if ('用过') {
        suc('值'); // 如果操作结果是成功，变更promise 对象的状态为成功
    } else {
        fail('值'); // 如果操作的结果是失败，变更 promise 对象的状态为失败
    }
});

promise_obj
    .then(v => {
    // 执行了suc 函数时，promise 对象变为成功状态，执行成功时的回调
    // v 是在执行suc 时，传入的值
    })
    .catch(e => {
    // 执行了fail 函数时，promise 对象变为失败状态，执行失败时的回调
    // e 是在执行 fail 时，传入的值
    })
```

### 2、suc 和 fail 函数
promise 的构造函数，传入的参数是一个函数，该函数再初始化promise对象时候就会被执行。传入函数的两个参数 `suc` 和 `fail` ，是两个用来变化primise容器执行状态的函数。`suc`会将promise 对象的状态从执行中（pending）变为已完成（resolved）。`fail` 会将怕promise 对象的状态从执行中（pending）变为以失败（rejected）。

`then` 函数中，传入的第一个参数函数，用于处理调用了`suc` 函数后要执行的逻辑。参数函数的参数（上面例子中的 v ）是调用`suc`函数时传入的值。then 函数会再次返回一个promise 对象，如果返回值不是一个promise 对象，则会调用原型方法封装为promise 对象。

`then` 函数中传入的第二个参数函数，或者`catch`函数中传入的参数函数，用于处理调用了`fail`函数后要执行的逻辑。



### 3、finally函数
在ES2018中，新增加了`finally`函数。不管promise的状态是 resolved 还是 rejected，当执行完对应的状态函数后，都会执行 finally 函数，进行收尾。也就是说，finally函数执行的逻辑，是不依赖promise 状态的。

### 4、`Promise.all` 函数
如果需要同步处理多个异步操作，例如同时发起多个网络请求，当所有请求都返回时，再进行下一步操作。这时候就需要使用得到了 Promise 原型函数：`Promise.all`。

```javascript
let p1 = new Promise((resolved, rejected) => {
    if (Math.random() > 0.5) {
        resolved();
    } else {
        rejected();
    }
});
p1.then(_ => {
        console.log('p1 ：通过');
    })
    .catch(_ => {
        console.log('p1 ： 失败');
    })

let p2 = new Promise((resolved, rejected) => {
    if (Math.random() > 0.5) {
        resolved();
    } else {
        rejected();
    }
})
p2.then(_ => {
        console.log('p2 ：通过');
    })
    .catch(_ => {
        console.log('p2 ： 失败,');
    })


let p = Promise.all([p1, p2]);
p
    .then(_ => {
    console.log('all - then');
    })
    .catch(_ => {
    console.log('all - catch');
    })
```
promise.all 传入的参数，必须是一个数组，或者类数组对象（必须具备迭代能力），数组的元素，需要是promise对象，如果不是的话，会调用自身方法进行转换。Promise.all 会返回新的promise 对象。

新的 promise 对象`p` 的状态，由传入的 promise 对象列表中的每个 promise 对象的状态共同决定：
* 数组中所有 promise 对象的状态如果都是 resolved ，则`p`的状态也是 resolved ，`p`的then函数，传入的参数是数组中元素 p1 , p2 等所有 promise 对象变为 resolved 状态时传入的值。
* 如果数组中某个promise对象，出现了rejected状态，则 `p` 对象的状态变为 rejected。