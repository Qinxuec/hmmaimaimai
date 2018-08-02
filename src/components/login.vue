<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/login.html">会员登录</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <div class="nav-tit">
                        <a class="selected" href="javascript:;">账户登录</a>
                        <i>|</i>
                        <a href="/register.html">免费注册</a>
                    </div>

                    <div id="loginform" name="loginform" class="login-box">
                        <div class="input-box">
                            <input id="txtUserName" name="txtUserName" v-model="user_name" type="text" placeholder="用户名/手机/邮箱" maxlength="50">
                        </div>
                        <div class="input-box">
                            <input id="txtPassword" name="txtPassword" v-model="password" type="password" placeholder="输入登录密码" maxlength="16">
                        </div>
                        <div class="btn-box">
                            <input id="btnSubmit" name="btnSubmit" type="submit" @click="login" value="立即登录">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'login',
    data:function(){
        return {
            user_name:'admin',
            password:'123'
        }
    },
    methods:{
        //用户登陆
        login(){
            this.axios.post('/site/account/login',{
                user_name:this.user_name,
                password:this.password
            })
            .then((response)=>{
                // console.log(response);
                if(response.data.status==0){
                    //登陆成功
                    this.$message.success(response.data.message);
                    //编程式导航到从哪来回哪去
                    this.$router.push(this.$store.state.fromPath);
                    //修改登陆状态
                    this.$store.commit("changeLogin",true);
                }else{
                    this.$message.error(response.data.message);
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }

    }
}
</script>
<style scoped>

</style>


