### 1、vue3之前是如何实现响应式的

在VUE3之前，vue实现MVVM的方式，主要是通过 `Object.defineProperty` 来实现的。先遍历数据源`data` 对象，然后将其每个属性，都使用 `get ` 和`set` 的方式，重新添加为 vue 对象的属性，以此实现vue实例的属性读取和属性值设置时，能触发某些操作。

vue3中，采用了proxy的方式，来实现响应式。使用proxy方式来代理数据源，可以减少内存的占用量，尤其在数据源的数据较大时，能降低一半以上的内存使用量。

### 2、proxy

proxy可以理解为 “代理”。就是在一个对象的外部，进行一层包裹。以此能过滤或者修改对该对象的操作。

```
let obj = {
	name:"原对象",
	age：18
}
let n_obj = new Proxy(obj,{
	set(){...},
	get(){...},
})
```

在对象`n_obj` 和对象`obj` 之间，使用代理进行了连接。对`n_obj` 的操作，会直接体现为对`obj`对象的操作。Proxy函数的第一个参数，用来指向被代理的对象；第二个参数，用来设置处理函数对象（处理函数对象的具体属性，看 3 ）；返回值是代理对象。

### 3、代理处理函数

* function get(target,key,receiver):

  拦截对象的读取属性操作。需要有一个返回值，默认返回undefined

  target：目标对象

  property：被获取的属性名

  receiver：Proxy或者继承Proxy的对象

  函数内的this，绑定的是处理函数对象。

  









