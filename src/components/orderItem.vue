<template>
<div>
{{orderid}}
</div>
    
</template>
<script>
export default {
    data:function(){
        return {
            orderid:''
        }
    },
    created() {
        this.orderid=this.$route.params.orderid
    },
}
</script>
<style scoped>

</style>


