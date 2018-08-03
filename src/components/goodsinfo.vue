<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/goods.html">购物商城</a> &gt;
                <a href="/goods/42/1.html">商品详情</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <div class="left-925">
                        <div class="goods-box clearfix">
                            <div class="pic-box" v-if="imglist.length!=0">
                                <!-- 图片部分用放大镜组件生成 -->
                                <ProductZoomer :baseImages="images" :base-zoomer-options="zoomerOptions">
                                </ProductZoomer>
                            </div>
                            <div class="goods-spec">
                                <h1>{{goodsinfo.title}}</h1>
                                <p class="subtitle">{{goodsinfo.sub_title}}</p>
                                <div class="spec-box">
                                    <dl>
                                        <dt>货号</dt>
                                        <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>市场价</dt>
                                        <dd>
                                            <s id="commodityMarketPrice">¥{{goodsinfo.sell_price}}</s>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>销售价</dt>
                                        <dd>
                                            <em id="commoditySellPrice" class="price">¥{{goodsinfo.market_price}}</em>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="spec-box">
                                    <dl>
                                        <dt>购买数量</dt>
                                        <dd>
                                            <div class="stock-box">
                                                <div class="el-input-number el-input-number--small">
                                                    <span role="button" class="el-input-number__decrease" :class="{'is-disabled':buyNum==1}" @click="buyNum==1?1:buyNum--">
                                                        <i class="el-icon-minus"></i>
                                                    </span>
                                                    <span role="button" class="el-input-number__increase" :class="{'is-disabled':buyNum==goodsinfo.stock_quantity}" @click="buyNum==goodsinfo.stock_quantity?goodsinfo.stock_quantity:buyNum++">
                                                        <i class="el-icon-plus"></i>
                                                    </span>
                                                    <div class="el-input el-input--small">
                                                        <!---->
                                                        <input autocomplete="off" v-model="buyNum" size="small" type="text" rows="2" max="60" min="1" validateevent="true" class="el-input__inner" role="spinbutton" aria-valuemax="60" aria-valuemin="1" aria-valuenow="1" aria-disabled="false">
                                                        <!---->
                                                        <!---->
                                                        <!---->
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="stock-txt">
                                                库存
                                                <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                                            </span>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd>
                                            <div id="buyButton" class="btn-buy">
                                                <button onclick="cartAdd(this,'/',1,'/shopping.html');" class="buy">立即购买</button>
                                                <button @click="cartAdd" class="add">加入购物车</button>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div id="goodsTabs" class="goods-tab bg-wrap">
                            <!-- iview ui框架中的图钉组件 -->

                            <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                                <ul>
                                    <li>
                                        <a @click="isShowDesc=true" href="javascript:;" :class="{selected:isShowDesc}">商品介绍</a>
                                    </li>
                                    <li>
                                        <a @click="isShowDesc=false" href="javascript:;" :class="{selected:!isShowDesc}">商品评论</a>
                                    </li>
                                </ul>
                            </div>

                            <div v-html="goodsinfo.content" class="tab-content entry" :style="{display: isShowDesc?'block':'none'}">
                                <!-- 内容为绑定的v-html渲染 -->
                            </div>
                            <div class="tab-content" :style="{display: isShowDesc?'none':'block'}">
                                <div class="comment-box">
                                    <div id="commentForm" name="commentForm" class="form-box">
                                        <div class="avatar-box">
                                            <i class="iconfont icon-user-full"></i>
                                        </div>
                                        <div class="conn-box">
                                            <div class="editor">
                                                <textarea id="txtContent" name="txtContent" sucmsg=" " v-model.trim="commentCount" datatype="*10-1000" nullmsg="请填写评论内容！"></textarea>
                                                <span class="Validform_checktip"></span>
                                            </div>
                                            <div class="subcon">
                                                <input id="btnSubmit" name="submit" type="submit" @click="subComment" value="提交评论" class="submit">
                                                <span class="Validform_checktip"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="commentList" class="list-box">
                                        <p v-if="commentlist.length==0" style="margin: 5px 0px 15px 69px; line-height: 42px; text-align: center; border: 1px solid rgb(247, 247, 247);">暂无评论，快来抢沙发吧！</p>
                                        <li v-for="(item, index) in commentlist" :key="item.id">
                                            <div class="avatar-box">
                                                <i class="iconfont icon-user-full"></i>
                                            </div>
                                            <div class="inner-box">
                                                <div class="info">
                                                    <span>{{item.user_name}}</span>
                                                    <span>{{item.add_time | cutTime('YYYY/MM/DD hh:mm:ss')}}</span>
                                                </div>
                                                <p>{{item.content}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="page-box" style="margin: 5px 0px 0px 62px;">
                                        <div id="pagination" class="digg">
                                            <!-- element中的分页器 -->
                                            <el-pagination
                                            background
                                            @size-change="handleSizeChange($event)"
                                            @current-change="handleCurrentChange($event)"
                                            :current-page.sync="pageIndex"
                                            :page-sizes="[10, 20]"
                                            :page-size="pageSize"
                                            layout="sizes, prev, pager, next"
                                            :total="commentTotalcount">
                                            </el-pagination>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-220">
                        <div class="bg-wrap nobg">
                            <div class="sidebar-box">
                                <h4>推荐商品</h4>
                                <ul class="side-img-list">
                                    <li v-for="(item, index) in hotgoodslist" :key="item.id">
                                        <div class="img-box">
                                            <router-link :to="'/goodsinfo/'+item.id">
                                                <img :src="item.img_url">
                                            </router-link>
                                        </div>
                                        <div class="txt-box">
                                            <router-link :to="'/goodsinfo/'+item.id">{{item.title}}</router-link>
                                            <span>{{item.add_time | cutTime}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <Back-top></Back-top> -->
        <img :src="imglist[0].original_path" v-if="imglist.length!=0" style="display:none" class="addCarImg" alt="">
    </div>
</template>
<script>
//引入放大镜模块
import ProductZoomer from "vue-product-zoomer";
//引入jquery
import $ from "jquery";
export default {
  // name:"goodsinfo",
  data: function() {
    return {
      goodsinfo: {},
      imglist: [],
      hotgoodslist: [],
      //控制显示商品介绍或商品评价的数据
      isShowDesc: true,
      //购买数量
      buyNum: 1,
      //评论页数
      pageIndex: 1,
      //每页条数
      pageSize: 10,
      //评论总条数
      commentTotalcount:0,
      //评论数据
      commentlist: [],
      //发表评论内容
      commentCount: "",
      // 放大镜模块数据
      images: {
        normal_size: []
      },
      zoomerOptions: {
        zoomFactor: 2,
        pane: "container-round",
        hoverDelay: 300,
        namespace: "inline-zoomer",
        move_by_click: true,
        scroll_items: 5,
        choosed_thumb_border_color: "#bbdefb"
      }
    };
  },
  methods: {
    //抽取的公共方法,获取商品详情
    getgoodsinfo() {
      this.imglist = [];
      //清空预览图片的数组
      this.images.normal_size = [];
      this.axios
        .get("/site/goods/getgoodsinfo/" + this.$route.params.id)
        .then(response => {
          // console.log(response);
          this.goodsinfo = response.data.message.goodsinfo;
          this.imglist = response.data.message.imglist;
          this.hotgoodslist = response.data.message.hotgoodslist;
          // console.log(this.imglist);
          this.imglist.forEach((v, i) => {
            this.images.normal_size.push({
              id: v.id,
              url: v.original_path
            });
          });
          // console.log(this.images);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //抽取的公共方法,获取评论信息
    getcomment() {
      this.axios
        .get(
          `/site/comment/getbypage/goods/${this.$route.params.id}?pageIndex=${
            this.pageIndex
          }&pageSize=${this.pageSize}`
        )
        .then(response => {
        //   console.log(response);
          this.commentlist = response.data.message;
          this.commentTotalcount=response.data.totalcount;
        })
        .catch(err => {});
    },
    //每页条数发生变化时调用
    handleSizeChange(pagesize){
        // console.log('页容量改变'+pagesize);
        this.pageSize=pagesize;
        this.getcomment();
    },
    //页码发生改变时调用
    handleCurrentChange(pageIndex){
        // console.log('页码改变'+pageIndex);
        this.pageIndex=pageIndex;
        this.getcomment();
    },
    //提交评论
    subComment() {
      if (this.commentCount == "") {
        this.$message.error("评论内容空");
      } else {
        this.axios
          .post(`/site/validate/comment/post/goods/${this.$route.params.id}`, {
            commenttxt: this.commentCount
          })
          .then(response => {
            console.log(response);
            if (response.data.status == 0) {
              this.$message.success(response.data.message);
              //重新渲染评论内容
              //去第一页
              this.pageIndex = 1;
              this.getcomment();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    //点击加入购物车
    cartAdd() {
      //添加购物车图片动画$('.addCarImg')
      let offset = $("#buyButton .add").offset();
      let carOffset = $(".icon-cart").offset();
      $(".addCarImg")
        .show()
        .addClass("move")
        .css(offset)
        .animate(carOffset, 1000, () => {
          $(".addCarImg")
            .hide()
            .removeClass("move");
        });
      //改变vuex中购物车数据
      this.$store.commit("buyGood", {
        goodId: this.$route.params.id,
        goodNum: this.buyNum
      });
    }
  },
  //放大镜模块中定义组件
  components: {
    ProductZoomer
  },
  //z在钩子函数中调用ajax获取数据
  created: function() {
    this.getgoodsinfo();
    // 获取评论
    this.getcomment();
  },
  //监听$route的变化,重新渲染数据
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      this.getgoodsinfo();
    }
  }
};
</script>
<style>
/* 导入字体图标样式 */
@import url("../../node_modules/font-awesome/css/font-awesome.min.css");
.inline-zoomer-zoomer-box {
  width: 368px;
}
.pic-box .control-box .thumb-list {
  display: flex;
}
.thumb-list img {
  height: 78px;
  width: 78px;
  margin: 5px;
}
.control i {
  text-align: center;
}
.addCarImg {
  width: 40px;
  position: absolute;
  top: 0;
  left: 1200px;
}
.addCarImg.move {
  transform: scale(0.5) rotateZ(720deg);
  opacity: 0.5;
  transition: transform 1s, opacity 1s;
}
</style>

