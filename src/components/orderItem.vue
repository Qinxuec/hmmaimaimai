<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="javascript:;">支付中心</a>
            </div>
        </div>

        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <div class="nav-tit pay">
                        <a href="javascript:;" class="selected">支付中心</a>
                    </div>
                    <div class="form-box payment" v-if="orderInfo">
                        <div class="el-row">
                            <div class="el-col el-col-18">
                                <div class="el-row">
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>订 单 号：</dt>
                                            <dd>{{orderInfo.order_no}}</dd>
                                        </dl>
                                    </div>
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>收货人姓名：</dt>
                                            <dd>{{orderInfo.accept_name}}</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="el-row">
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>送货地址：</dt>
                                            <dd>{{orderInfo.area}}{{orderInfo.address}}
                                            </dd>
                                        </dl>
                                    </div>
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>手机号码：</dt>
                                            <dd>{{orderInfo.mobile}}</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="el-row">
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>支付金额：</dt>
                                            <dd>{{orderInfo.order_amount}} 元</dd>
                                        </dl>
                                    </div>
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>支付方式：</dt>
                                            <dd>在线支付</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="el-row">
                                        <div class="el-col el-col-12">
                                                <dl class="form-group">
                                                    <dt>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</dt>
                                                    <dd>{{orderInfo.message}}</dd>
                                                </dl>
                                            </div>
                                </div>
                            </div>
                            <div class="el-col el-col-6">
                                <qrcode v-if="pay" :value="pay" :options="{ size: 200 }"></qrcode>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>   
</template>
<script>
// 引入二维码模块
import VueQrcode from '@xkeshi/vue-qrcode';
export default {
    data:function(){
        return {
            orderid:'',
            orderInfo:undefined,
            pay:undefined
        }
    },
    //注册二维码组件
    components:{
        qrcode:VueQrcode
    },
    created() {
        this.orderid=this.$route.params.orderid;
        //获取订单信息
        this.axios.get('/site/validate/order/getorder/'+this.orderid)
        .then(response=>{
            console.log(response);
            this.orderInfo=response.data.message[0];
        }).catch(err=>{
            console.log(err);
        })
        //将支付信息嵌入二维码中
        // this.axios.get(`site/validate/pay/alipay/${this.orderid}`)
        // .then(response=>{
        //     console.log(response);
        // }).catch(err=>{
        //     console.log(err);
        // })
        this.pay=`http://47.106.148.205:8899/site/validate/pay/alipay/${this.orderid}`;
        //利用计时器循坏调用接口判断是否支付成功
        let timeId=setInterval(()=>{
            this.axios.get(`/site/validate/order/getorder/${this.orderid}`)
            .then(response=>{
                // console.log(response);
                //判断是否支付成功
                if(response.data.message[0].status==2){
                    this.$message.success('恭喜支付成功');
                    //跳转到支付成功页面
                    this.$router.push('/paySuccess');
                    // 清空计时器
                    clearInterval(timeId);
                }
            }).catch(err=>{
                console.log(err);
            })
        },1000)
    },
}
</script>
<style scoped>

</style>


