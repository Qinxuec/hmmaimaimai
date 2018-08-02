import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import index from './components/index.vue'
import goodsinfo from './components/goodsinfo.vue'
import buyCar from './components/buyCar.vue'
import payOrder from './components/payOrder.vue'
import login from './components/login.vue'
import orderItem from './components/orderItem.vue'

import './assets/statics/site/css/style.css';
//引入elementui模块
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入懒加载模块
import VueLazyload from 'vue-lazyload';
//过滤器中用到的插件
import moment from 'moment';

//每个路由都用到的抽取到入口中,必须添加到Vue构造函数中才可使用
import axios from 'axios';
//设置携带cookie
axios.defaults.withCredentials = true
Vue.prototype.axios=axios;

//引入iView框架,使用其中的图钉组件和回顶部效果
// import iView from 'iview';
// import 'iview/dist/styles/iview.css';    // 使用 CSS
//引入vuex模块 用来多组件数据保存
import Vuex from 'vuex'

//设置baseURL后调接口会自动拼接上这个地址
axios.defaults.baseURL='http://47.106.148.205:8899';

// 挂载路由
Vue.use(VueRouter)
//挂载框架
Vue.use(ElementUI);
//挂载iView
// Vue.use(iView);
//挂载懒加载
Vue.use(VueLazyload,{
  loading: require('./assets/img/01.gif')
})
// 挂载vuex
Vue.use(Vuex)



const routes = [
  // 将跟目录重定向到index
  { path: '/', redirect: '/index' },
  // { path: '/', component: index },
  { path: '/index', component: index },
  { path: '/goodsinfo/:id', component: goodsinfo},
  { path: '/buyCar', component: buyCar },
  { path:'/payOrder/:ids', component: payOrder},
  { path:'/login', component: login},
  { path:'/orderItem/:orderid', component: orderItem}  
];

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
//定义全局过滤器
Vue.filter('cutTime',function(value){
  return moment(value).format('YYYY-MM-DD');
})

//进入页面先取购物车常驻数据,如果没有则为空
let buyList=JSON.parse(window.localStorage.getItem('buyList')) || {};
//new一个vuex仓库
const store = new Vuex.Store({
  state: {
    //购物车数据
    buyList,
    //来的路由
    fromPath:'/',
    //记录登陆状态
    islogin:false
  },
  //更改仓库数据需通过注册函数在其它路由中通过commit的方式修改
  mutations: {
    //info的格式{goodId:x,goodNum:x}
    //商品详情页中添加购物车
    buyGood (state,info) {
      if(state.buyList[info.goodId]){
        state.buyList[info.goodId]+=+info.goodNum;
      }else{
        // state.buyList[info.goodId]=+info.goodNum;
        Vue.set(state.buyList, info.goodId, +info.goodNum)
      }
      // console.log(store.state.buyList);
    },
    //购物车中改变商品购买数量
    changeCount(state,info){
      state.buyList[info.goodId]=info.goodNum;
    },
    //删除购买商品
    delete(state,id){
      Vue.delete(state.buyList,id);
    },
    //保存来的路由
    rememberFromPath(state,fromPath){
      state.fromPath=fromPath;
    },
    //修改登陆状态的函数
    changeLogin(state,islogin){
      state.islogin=islogin;
    }

  },
  //用vuex中类似于计算属性的getters计算购物车数量
  getters: {
    buyCarNum(state) {
      let num=0;
      for(let key in state.buyList){
        num+=state.buyList[key];
      }
      return num;
    },
    //在购物车中更新数据添加到vuex中

  }
})

//导航守卫
router.beforeEach((to, from, next) => {
  //保存来的路由
  store.commit('rememberFromPath',from.path);
  // console.log(to);
  if(to.path=='/payOrder'){
    //要进入的是立即结算页面,需判断是否登陆
    axios.get('/site/account/islogin')
    .then((response)=>{
      // console.log(response);
      // 判断登录状态
      if(response.data.code=="nologin"){
        //未登录.编程式导航去登陆页
        router.push('/login')
      }else{
        //已登陆,继续
        next();
      }
    })
    .catch(err=>{
      console.log(err);  
    })
  }else{
    next();
  } 
})

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

//页面关闭时,存储购物车数据到localStorage,满足数据常驻的需求
window.onbeforeunload=function(){
  window.localStorage.setItem("buyList",JSON.stringify(store.state.buyList));
}

