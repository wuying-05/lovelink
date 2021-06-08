<template>
    <el-container>
        <el-main class="container" v-loading="loading" element-loading-text="加载中">
            <div class="">
                <el-card  style="margin-bottom: 10px;padding: 80px 0; text-align:center">
                    <el-button type="primary" @click="getResult()" plain>查看认证结果</el-button>
                </el-card>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import store from '../store'
export default {
    name: 'IdConfirmResult', // this is the name of the component
    components: { },
    data () {
        return {
            loading: false,
            sharedState: store.state
        }
    },
    methods: {
        getResult () {
            this.loading = true
            const path = '/idconfirm/getResult'
            const payload = {}
            this.$axios
                .post(path, payload)
                .then(response => {
                    this.loading = false
                    console.log(response)
                    if(response.data.data.idConfirmed==1){
                            this.$message({
                                showClose: true,
                                message: '恭喜，认证成功！',
                                type: 'success',
                                duration: 5000,
                                center: true
                            })
                        }else{
                            this.$message({
                                showClose: true,
                                message: '认证失败！',
                                type: 'warning',
                                duration: 5000,
                                center: true
                        })
                         
                     }

                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
        },
        created () {
            //this.getUsers()
        }
    }
}
</script>

<style scoped>
  .grey {
    color: #8c939d;
}
</style>
