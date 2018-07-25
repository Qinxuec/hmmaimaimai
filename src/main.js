import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

// import news from './components/news.vue'
// import stars from './components/stars.vue'

// const router = new VueRouter({
//   routes:[
//     { path: '/news', component: news },
//     { path: '/stars', component: stars }
//   ] // (缩写) 相当于 routes: routes
// })



new Vue({
  render: h => h(App),
  // router
}).$mount('#app')
