<template>
    <el-container>
        <el-main class="container" v-loading="loading" element-loading-text="加载中">
            <div class="">
                <el-card  style="margin-bottom: 10px;padding: 80px 0; text-align:center">
                    <el-button type="primary" @click="getEnterUrl()" plain>开始</el-button>
                </el-card>
            </div>
        </el-main>
    </el-container>
</template>

<script>
export default {
    name: 'PrePay', // this is the name of the component
    data () {
        return {
            loading: false,
        }
    },
    methods: {
        getEnterUrl () {

            var ua = window.navigator.userAgent;
            var type = 'other'
            //判断是不是微信
            if ( true||ua.indexOf("MicroMessenger") > 0 ) {  
                type = "WeiXIN"; 
                this.startWxPay() 
            }
            else{
                type = "Alipay";  
                this.startAliPay()
            }
            
            this.$message({
                            showClose: true,
                            message: type,
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
            
        },startWxPay(){
            var productid = this.$route.query.productid
            var userid = this.$route.query.userid
            const path = '/order/wxpay?userid='+userid+'&productid='+productid
            this.$axios
                .get(path)
                .then(response => {
                    console.log(response.data.data.url)
                    
                    this.$nextTick(() => {response.data.data.url})
                    this.loading = false
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
                })
            },startAliPay(){

            }
    },
    created () {
        //this.getUsers()
    }
}
</script>

<style scoped>
  .grey {
    color: #8c939d;
}
</style>
