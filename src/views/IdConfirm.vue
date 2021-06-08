<template>
    <el-container>
        <el-main class="container" v-loading="loading" element-loading-text="加载中">
            <div class="" style="text-align:center">
                
                <el-button type="primary" @click="getEnterUrl()" plain :disabled="id_confirmed">开始身份认证</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import store from '../store'
export default {
    name: 'IdConfirm', // this is the name of the component
    components: { },
    data () {
        return {
            idConfirmed:false,
            loading: false,
            sharedState: store.state
        }
    },
    methods: {
        getEnterUrl () {
            this.loading = true
            const path = '/idconfirm/getEnterUrl'
            const payload = {
            }
            this.$axios
                .post(path, payload)
                .then(response => {
                    if(response.data.code==0){
                        var url = response.data.data.url
                        window.location.href=url+'&timestamp='+(new Date().getTime())+Math.random()
                    }else{
                        this.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'warning',
                            duration: 5000,
                            center: true
                        })
                        this.$router.push('/idconfirmResult')
                    }
                    this.loading = false
                    
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false

                })
        },getResult () {
            this.loading = true
            const path = '/idconfirm/getResult'
            const payload = {}
            this.$axios
                .post(path, payload)
                .then(response => {
                    this.loading = false
                    if(response.data.data.idConfirmed==1){
                            this.$message({
                                showClose: true,
                                message: '恭喜，认证成功！',
                                type: 'success',
                                duration: 5000,
                                center: true
                            })
                            this.idConfirmed = true
                        }else{
                            this.idConfirmed = false
                     }

                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
        }
    },
    created () {
        this.getResult()
    }
}
</script>

<style scoped>
  .grey {
    color: #8c939d;
}
</style>
