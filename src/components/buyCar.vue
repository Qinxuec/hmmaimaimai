<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/cart.html">购物车</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <!--购物车头部-->
                    <div class="cart-head clearfix">
                        <h2>
                            <i class="iconfont icon-cart"></i>我的购物车</h2>
                        <div class="cart-setp">
                            <ul>
                                <li class="first active">
                                    <div class="progress">
                                        <span>1</span>
                                        放进购物车
                                    </div>
                                </li>
                                <li>
                                    <div class="progress">
                                        <span>2</span>
                                        填写订单信息
                                    </div>
                                </li>
                                <li class="last">
                                    <div class="progress">
                                        <span>3</span>
                                        支付/确认订单
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--购物车头部-->
                    <!--商品列表-->
                    <div class="cart-box">
                        <input id="jsondata" name="jsondata" type="hidden">
                        <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
                            <tbody>
                                <!-- 购物车数据表头 -->
                                <tr>
                                    <th width="48" align="center">
                                        <a>选择</a>
                                    </th>
                                    <th align="left" colspan="2">商品信息</th>
                                    <th width="84" align="left">单价</th>
                                    <th width="104" align="center">数量</th>
                                    <th width="104" align="left">金额(元)</th>
                                    <th width="54" align="center">操作</th>
                                </tr>
                                <!-- 购物车没有数据时显示的内容 -->
                                <tr v-if="message && message.length==0">
                                    <td colspan="10">
                                        <div class="msg-tips">
                                            <div class="icon warning">
                                                <i class="iconfont icon-tip"></i>
                                            </div>
                                            <div class="info">
                                                <strong>购物车没有商品！</strong>
                                                <p>您的购物车为空，
                                                    <a href="/index.html">马上去购物</a>吧！</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <!-- 购物车有数据会自动渲染的内容 -->
                                <tr v-for="(item, index) in message" :key="item.id">
                                    <td width="48" align="center">
                                        <el-switch v-model="item.isSelected" @click="item.isSelected=!item.isSelected" active-color="#409eff" inactive-color="#555555">
                                        </el-switch>
                                    </td>
                                    <td align="left" colspan="2">
                                        <div class="shopInfo"><img :src="item.img_url" alt="" style="width: 50px; height: 50px; margin-right: 10px;">
                                            <span>{{item.title}}</span>
                                        </div>
                                    </td>
                                    <td width="84" align="left">{{item.sell_price}}</td>
                                    <td width="104" align="center">
                                        <!-- element-ui中提供了数据改变时会触发的change事件,注册事件来同步改变vuex中保存的购物车数据 -->
                                        <el-input-number v-model="item.buycount" @change="buyChange($event,index)" size="mini" :min="1" :max="10" label="描述文字"></el-input-number>
                                    </td>
                                    <td width="104" align="left"></td>
                                    <td width="54" align="center">
                                        <el-button type="text" @click="del(index)">删除</el-button>
                                    </td>
                                </tr>
                                <!-- 购物车数据表格底部 -->
                                <tr>
                                    <th align="right" colspan="8">
                                        已选择商品
                                        <b class="red" id="totalQuantity">{{proNum}}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                                        <span class="red">￥</span>
                                        <b class="red" id="totalAmount">{{totalPrice}}</b>元
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--/商品列表-->
                    <!--购物车底部-->
                    <div class="cart-foot clearfix">
                        <div class="right-box">
                            <button class="button" onclick="javascript:location.href='/index.html';">继续购物</button>
                            <!-- 需要挈带选中的商品id,不能直接跳转,用$route.push的方式跳转 -->
                            <!-- <router-link to="/payOrder"> -->
                                <button class="submit" @click="toPayOrder">立即结算</button>
                            <!-- </router-link> -->
                        </div>
                    </div>
                    <!--购物车底部-->
                </div>
            </div>
        </div>
        <!-- 加载中 -->
        <el-button type="primary">服务方式</el-button>
    </div>
</template>
<script>
export default {
  name: "car",
  data: function() {
    return {
      message: undefined,//本来是一个[],需求加载时不要显示没有数据
      loding:'',
    };
  },
  beforeCreate(){
    // 未加载成功显示loding
    this.loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });  
  },
  //在钩子函数组件创建好立马调接口获取数据
  created() {
    //准备参数
    let buyList = this.$store.state.buyList;
    // console.log(buyList);
    let proIds = "";
    for (const key in buyList) {
      proIds += key;
      proIds += ",";
    }
    proIds = proIds.slice(0, -1);
    // console.log(proIds);
    if(proIds==''){
        this.message=[];
        //隐藏loding加载中
        this.loading.close();
        return;
    }
    this.axios
      .get(`/site/comment/getshopcargoods/${proIds}`)
      .then(response => {
        // console.log(response);
        //先增加属性,后赋值给message,vue就可以跟踪
        response.data.message.forEach(v => {
          //在得到的参数中添加每个产品购买的数量
          v.buycount = buyList[v.id];
          //添加控制每个商品选中状态的参数
          v.isSelected = true;
        });
        this.message = response.data.message;
        // console.log(this.message);
        //数据回来隐藏loding加载中
        this.loading.close();
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    // 总个数
    proNum() {
      let num = 0;
      if(!this.message){
          return num
      }
      this.message.forEach(v => {
        if (v.isSelected) {
          num += v.buycount;
        }
      });
      return num;
    },
    // 商品总价
    totalPrice() {
      let price = 0;
      if(!this.message){
          return price
      }
      this.message.forEach(v => {
        if (v.isSelected) {
          price += v.buycount * v.sell_price;
        }
      });
      return price;
    }
  },
  methods: {
    //更改vuex库中的数据同步
    buyChange(count, index) {
      // console.log(count);
      this.$store.commit("changeCount", {
        goodId: this.message[index].id,
        goodNum: count
      });
    },
    //弹出确认删除逻辑
    del(index) {
      this.$confirm("确定不买了吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          //确认删除
          //更新vuex中的数据
          this.$store.commit("delete", this.message[index].id);
          //更新本页面数据
          this.message.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          //取消删除
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //跳转到payorder,需携带ids(id1,id2....)
    toPayOrder(){
        let ids='';
        this.message.forEach(v=>{
            if(v.isSelected){
                ids+=v.id;
                ids+=',';
            }
        });
        ids=ids.slice(0,-1);
        if(ids==''){
            this.$message.error("没有选中任何商品");
        }else{
            this.$router.push('/payOrder/'+ids);
        }
    }
  }
};
</script>
<style scoped>
</style>