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
                                <li class="active">
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
                    <div class="cart-box">
                        <h2 class="slide-tit"><span>1、收货地址</span></h2>
                        <el-form :model="ruleInfo" :rules="rules" status-icon ref="ruleInfo" label-width="100px" class="demo-ruleForm">
                        <div id="orderForm" name="orderForm" url="">
                            <div class="form-box address-info" style="width:600px">
                                <el-form-item label="收货人姓名" prop="accept_name">
                                    <el-input v-model="ruleInfo.accept_name"></el-input>
                                </el-form-item>
                                <!-- 省市联动 -->
                                <el-form-item label="所属地区" prop="accept_name">
                                    <VDistpicker 
                                    @selected='selected($event)'
                                    :province='ruleInfo.area.province.value' 
                                    :city='ruleInfo.area.city.value' 
                                    :area='ruleInfo.area.area.value'
                                    ></VDistpicker>
                                </el-form-item>
                                <el-form-item label="详细地址" prop="address">
                                    <el-input v-model="ruleInfo.address"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号码" prop="mobile">
                                    <el-input v-model="ruleInfo.mobile"></el-input>
                                </el-form-item>
                                <el-form-item label="电子邮箱" prop="email">
                                    <el-input v-model="ruleInfo.email"></el-input>
                                </el-form-item>
                                <el-form-item label="邮政编码" prop="post_code">
                                    <el-input v-model="ruleInfo.post_code" style="width:200px"></el-input>
                                </el-form-item>
                            </div>
                            <h2 class="slide-tit">
                                <span>2、支付方式</span>
                            </h2>
                            <ul class="item-box clearfix">
                                <!--取得一个DataTable-->
                                <li>
                                    <label>
                                        <el-radio v-model="ruleInfo.payment_id" label="6">在线支付</el-radio>
                                        <em>手续费：0.00元</em>
                                    </label>
                                </li>
                            </ul>
                            <h2 class="slide-tit">
                                <span>3、配送方式</span>
                            </h2>
                            <ul class="item-box clearfix">
                                <!--取得一个DataTable-->
                                <li>
                                    <label>
                                        <el-radio-group v-model="ruleInfo.express_id" @change='expressChange($event)'>
                                            <el-radio label="1">顺丰 (费用：20.00元)</el-radio>
                                            <el-radio label="2">圆通 (费用：10.00元)</el-radio>
                                            <el-radio label="3">韵达 (费用：8.00元)</el-radio>
                                        </el-radio-group>
                                    </label>
                                </li>
                            </ul>
                            <h2 class="slide-tit">
                                <span>4、商品清单</span>
                            </h2>
                            <div class="line15"></div>
                            <table width="100%" border="0" align="center" cellpadding="8" cellspacing="0" class="cart-table">
                                <tbody>
                                    <tr>
                                        <th colspan="2" align="left">商品信息</th>
                                        <th width="84" align="left">单价</th>
                                        <th width="84" align="center">购买数量</th>
                                        <th width="104" align="left">金额(元)</th>
                                    </tr>
                                    <tr v-for="(item, index) in goodsList" :key="item.id">
                                        <td width="68">
                                            <a target="_blank" href="/goods/show-89.html">
                                                <img :src="item.img_url" class="img">
                                            </a>
                                        </td>
                                        <td>
                                            <a target="_blank" href="/goods/show-89.html">{{item.title}}</a>
                                        </td>
                                        <td>
                                            <span class="red">
                                                ￥{{item.sell_price}}
                                            </span>
                                        </td>
                                        <td align="center">{{item.buycount}}</td>
                                        <td>
                                            <span class="red">
                                                ￥{{item.sell_price*item.buycount}}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="line15"></div>
                            <h2 class="slide-tit">
                                <span>5、结算信息</span>
                            </h2>
                            <div class="buy-foot clearfix">
                                <div class="left-box">
                                    <dl>
                                        <dt>订单备注(100字符以内)</dt>
                                        <dd>
                                            <textarea name="message" v-model="ruleInfo.message" class="input" style="height:35px;"></textarea>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="right-box">
                                    <p>
                                        商品
                                        <label class="price">{{totalNum}}</label> 件&nbsp;&nbsp;&nbsp;&nbsp; 商品金额：￥
                                        <label id="goodsAmount" class="price">{{totalPrice}}</label> 元&nbsp;&nbsp;&nbsp;&nbsp;
                                    </p>
                                    <p>
                                        运费：￥
                                        <label id="expressFee" class="price">{{ruleInfo.expressMoment}}.00</label> 元
                                    </p>
                                    <p class="txt-box">
                                        应付总金额：￥
                                        <label id="totalAmount" class="price">{{ruleInfo.goodsAmount}}.00</label>
                                    </p>
                                    <p class="btn-box">
                                        <a class="btn button" href="/cart.html">返回购物车</a>
                                        <a id="btnSubmit" class="btn submit" @click="submitForm('ruleInfo')">确认提交</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//引入省事联动
import VDistpicker from 'v-distpicker'
export default {
    name:'payOrder',
    data:function(){
        //自定义表单验证手机号
        var validatemobile = (rule, value, callback) => {
            let reg=/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
            if(reg.test(value)){
                callback();
            }else{
                callback(new Error('手机号码不合法'));
            }
        };
        //自定义表单验证邮箱
        var validateemail = (rule, value, callback) => {
            let exp=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if(exp.test(value)){
                callback();
            }else{
                callback(new Error('邮箱格式不正确'));
            }
        };
        //自定义表单验证邮政编码
        var validatePostCode = (rule, value, callback) => {
            let reg=/^[1-9]\d{5}(?!\d)$/;
            if(reg.test(value)){
                callback();
            }else{
                callback(new Error('邮编不合法'));
            }
        };
        return {
            goodsList:[],
            ruleInfo:{
                accept_name:'张三',
                address:'中粮商务公园',
                area:{
                    "province": {
                        "code": "440000",
                        "value": "广东省"
                    },
                    "city": {
                        "code": "440300",
                        "value": "深圳市"
                    },
                    "area": {
                        "code": "440305",
                        "value": "南山区"
                    }
                },
                mobile:'18888888888',
                email:'659289765@qq.com',
                post_code:'610000',
                payment_id:'6',
                express_id:'1',
                expressMoment:20,
                goodsAmount:0,
                message:'请尽快发货',
                //购买商品的id
                goodsids:'',
                //购买商品的对象{id1:num1,id2:num2....}
                cargoodsobj:{}
            },
            //表单验证
            rules: {
                accept_name: [
                    { required: true, message: '收件人不能为空', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2到 5 个字符', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2到 30个字符', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请填写电话号码', trigger: 'blur' },
                    { validator: validatemobile, trigger: 'change' }
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { validator: validateemail, trigger: 'blur' }
                ],
                post_code:[
                    { required: true, message: '请填写邮编', trigger: 'blur' },
                    { validator: validatePostCode, trigger: 'blur' }
                ]
            }
        }
    },
    //注册省市联动组件
    components: { VDistpicker },
    //注册事件
    methods:{
        //省市联动内容发生变化时调用
        selected(value){
            this.ruleInfo.area=value;
        },
        //快递方式发生变化时调用,来改变快递费用
        expressChange(value){
            // console.log(value);
            switch (value) {
                case '1':
                    this.ruleInfo.expressMoment=20;
                    break;
                case '2':
                    this.ruleInfo.expressMoment=10;
                    break;
                case '3':
                    this.ruleInfo.expressMoment=8;
                    break;
                default:
                    break;
            };
            //给总价赋值
            this.ruleInfo.goodsAmount=this.ruleInfo.expressMoment+this.totalPrice;
        },
        //确认提交
        submitForm(formName){
            // 表单提交前最后验证
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证成功 掉接口下订单 删除购物车中已购买数据 跳转到订单详情页
                    this.axios.post('/site/validate/order/setorder/',this.ruleInfo)
                    .then(response=>{
                        // console.log(response);
                        if(response.data.status==0){
                            //携带返回的订单orderid跳转页面
                            this.$router.push('/orderItem/'+response.data.message.orderid);
                            //清除购物车数据
                            let goodsidsArr=this.ruleInfo.goodsids.split(',');
                            goodsidsArr.forEach(v=>{
                                this.$store.commit('delete',v);
                            })
                            
                        }else{
                            //未登录状态 satatus:2.message:'登陆后才能下单'
                            this.$message.error(response.data.message);
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    
                } else {
                    //验证失败
                    this.$message.error("请填写完整的信息再提交!")
                    return false;
                }
            });
            
        }
    },
    //计算属性
    computed:{
        totalNum(){
            let num=0;
            this.goodsList.forEach(v=>{
                num+=v.buycount;
            })
            return num;
        },
        totalPrice(){
            let price=0;
            this.goodsList.forEach(v=>{
                price+=v.buycount*v.sell_price;
            })
            return price;
        }
    },
    //在钩子函数中调接口渲染订单数据
    created(){
        this.axios.get(`/site/validate/order/getgoodslist/${this.$route.params.ids}`)
        .then(response=>{
            // console.log(response);
            //更新商品购买数量到数据中
            let buyList=this.$store.state.buyList;
            response.data.message.forEach(v => {
                v.buycount=buyList[v.id];
            });
            this.goodsList=response.data.message;
            //给总价赋值
            this.ruleInfo.goodsAmount=this.ruleInfo.expressMoment+this.totalPrice;
            //购买商品的id赋值
            this.ruleInfo.goodsids=this.$route.params.ids;
            //购买商品的对象{id1:num1,id2:num2....}赋值
            let idsArr=this.$route.params.ids.split(',');
            // console.log(idsArr);
            let goodsObj={};
            this.goodsList.forEach(v=>{
                goodsObj[v.id]=v.buycount
            });
            this.ruleInfo.cargoodsobj=goodsObj
        }).catch(err=>{
            console.log(err);
        })
    }
}
</script>
<style scoped>
    
</style>


