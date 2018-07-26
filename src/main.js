import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// 挂载
Vue.use(VueRouter)

Vue.config.productionTip = false

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import index from './components/index.vue'
import car from './components/car.vue'

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  // 将跟目录重定向到index
  { path: '/', redirect: '/index' },
  // { path: '/', component: index },
  { path: '/index', component: index },
  { path: '/car', component: car }
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})



new Vue({
  render: h => h(App),
  router
}).$mount('#app')
