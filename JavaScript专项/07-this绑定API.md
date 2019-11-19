### 1、Function的call 和 apply 方法

`call` 和`apply` 方法，使用来调用函数的。调用时，会给函数绑定一个指定的 `this` 值：

```javascript
function testFun(){
    // code
}
testFunc.call(this的值，参数1，参数2...，参数n)
testFunc.apply(this的值，[参数1，参数2])
```

`call` 和`apply` ，直接调用函数，这两个方法第一个参数，是要绑定的this值。然后传入函数执行需要的参数。两个方法的区别，就是执行函数的参数传递方式。

`call` 方法：参数正常传入；

`apply` 方法：原函数的参数，需要放在一个数组内，然后 apply 方法，会自动打散数组，再将参数传递给原函数

这两个方法，主要应用再改变函数作用域上。也可以用来实现继承时，调用父构造函数。

例如：

```javascript
function People(name){
    this.name = name;
}

function laoWang(name,age){
    // call 函数，把 People 函数，绑定在了老王这个实例上
    // 然后进行传参调用，就可以实现给老王添加成员属性
    People.call(this,name);
    // People.apply(this,[name]);
    // apply 和 call 的区别，就是传参，apply 用数组
    this.age = age;
}
```

### 2、Function的 bind 方法

bind 方法，是返回一个函数的拷贝。并且拥有指定的this ，和 参数。

假设有函数`globalFun` ：

```javascript
function globalFun(){
    console.log("输出函数绑定的this",this)
}
```

再默认情况下调用，函数 globalFun 输出的值是 所在的全局变量（window 或者 global）

然后我们使用 bind 方法，生成一个新的函数：

```javascript
/*
	bind 方法，会返回一个函数，所以要声明一个变量，接受返回值
	新返回的函数，this 绑定的就是指定的this
*/
let newGlobalFun = globalFun.bind(some_obj);
```

这时，如果再调用 newGlobalFun 函数，输出的就是 some_obj ，就是我们指定的this



### 3、使用 call 方法，实现bind 方法

常见的一道面试题，假设只有call 方法，或者 apply 方法，要求自己实现 bind 方法。

分析下 bind 方法的能力：

* 返回 一个函数
* 返回的函数，功能和调用时的function 是一样的
* 返回的函数，拥有指定的this

```javascript
/*
	第一步：
	bind方法的使用方式，是function来引用，所以myBind 方法，应该挂载到Function 构造函数
	方法接受一个 this ，用 context 来指代
*/
Function.prototype.myBind = function(context){
    // 第三步：当 myBind 被调用时，默认持有的this，就是调用myBind 的函数
    let old_fun = this;
    //第二步骤：myBind 方法，返回一个函数
    return function (...args){ // 第五步：接受参数
        // 第四步：bind 返回的函数，执行时，逻辑和原调用函数是一样的，但是this变了
        // 可以使用call 方法模拟
        old_fun.call(context,...args)// 第六步：将接受的参数，传递给原函数
    }
}
```



