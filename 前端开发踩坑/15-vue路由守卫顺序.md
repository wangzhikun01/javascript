> 注意：以下观点，仅仅是通过现象观察出来的，并没有看过 源码，如有问题，欢迎斧正
### 1、需求背景
在实际开发中，我们会设置全局的路由守卫，来检测用户是否登录。那么，随之而来的问题是：
* 全局导航守卫拦截的时机是什么？
* 导航守卫触发的条件是什么？
* 页面首次加载时，是否能触发全局守卫？
* .....
### 2、导航守卫分类
#### 2.1 全局守卫
> 全局守卫，是作用在全局导航的钩子函数。就是只要当路由进行了变化时，就会按照顺序进行触发。
* 全局前置守卫：

导航变化时，先触发的守卫，如果不确认，将一直阻塞路由的跳转。
```javascript
router.beforeEach((to, from, next) => {
    next();
    // 不调用next 方法，钩子函数将不被确认，不会向下执行
    // next() ; 确认路由，然后向下执行
    // next（false): 否认，中断路由，如果地址发生变化，则回到from 的url
    // next('/') : 跳转到指定的链接
})
```
* 全局解析守卫：和前置守卫差不多，但是没有用过
* 全局后置守卫:

导航被确认后，最后触发的钩子函数
```javascript
router.afterEach((to, from) => {
    // 后置守卫，不接受next 函数，不会改变导航本身
})
```
#### 2.2 路由独享守卫
> 当某个固定的路由发生了变化时，才会触发的钩子函数

在定义路由时，一个route对象中，可以定义一个`beforeEnter`钩子函数。
```javascript
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```
#### 2.3 组件内守卫
> 当路由对应的某个组件发生创建或者销毁时触发的钩子函数

组件内导航守卫包括：
* beforeRouteEnter
* beforeRouteUpdate (2.2 新增)
* beforeRouteLeave
```javascript
<template></template>
<script>
export default{
    beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
</script>
```
### 3、导航守卫触发顺序
> 假设场景：点击了按钮，然后离开当前页面，去另一个页面，url 发生了变化
* 触发导航：如上介绍，导航就是路由发生变化时，然后会一次触发各种钩子函数
* 离开当前组件：调用组件内-离开守卫`beforeRouteLeave`
* 先调用全局守卫-前置守卫，导航确认后，进入路由，路由开始导入对应的视图组件
* 如果视图组件复用了，触发该组件的` beforeRouteUpdate` 钩子函数
* 然后按照路由，去调用视图组件，在调用之前，触发路由守卫`beforeEnter`，触发后解析组件
* 组件解析完成，开始渲染，触发组件激活的路由守卫`beforeRouteEnter` 
* 调用全局的路由解析守卫`router.beforeResolve`
* 导航完全被确认，进入全局后置守卫`afterEach`
* 然后DOM 更新，创建组件，此时会触发组件的`created` 等钩子函数
### 4、首次加载时导航守卫的触发
导航，在官方文档中，特意进行了说明，就是路由正在变化。那么导航守卫，就是路由正在变化时，触发的函数。所以，这里我们明确了一个问题，就是导航守卫的触发，是在路由变化的时候。

看看 main.js 文件：
```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
```
先生成一个 router 对象，然后再用来初始化vue。

生成 router 对象后，就已经对路由开始了监听，所以在初始化vue对象之前，就已经可以触发设定的全局守卫，所以全局守卫，在首次加载时，就已经生效了。所以一些鉴权的操作，完全可以放在全局前置守卫中，即会在项目加载的时候进行守卫，在跳转页面时，也能进行守卫。

### 5、APP.vue的导航守卫
APP.vue 和公共组件，不会触发导航守卫，同样也无法设置组件内守卫。