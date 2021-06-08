<template>
    <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;text-align: center;">
        <div style="margin-top: 10vh">
            <div style="font-size: 32px;font-weight: 500;color: rgb(31, 41, 46);">{{title}}</div>
            <el-button @click="get_qr_code" type="text" v-loading="!!!qr_code_url">
                <img :src="qr_code_url" alt="" style="width: 270px;height: 270px">
            </el-button>
            <div style="color: rgb(65, 80, 88);font-size: 14px;">扫码关注公众号完成登录</div>
        </div>
    </div>
</template>

<script>
    import store from '../store'
    export default {
        name: 'WechatLogin',
        props: {
            type: {
                default: 'user',
                required: true
            }
        },
        watch: {
            type: {
                immediate: true,
                handler() {
                    if (!this.type) {
                        this.type = user
                    }
                    this.get_qr_code()
                }
            }
        },
        data() {
            return {
                qr_code_url: '',
                info: {},
                times: 30,
                timer: null,
                title: '微信扫一扫'
            }
        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
        methods: {
            get_qr_code() {
                this.qr_code_url = ''
                clearInterval(this.timer)
                this.title = '微信扫一扫'
                this.info = {
                    type: this.type,
                    data: new Date().getTime()
                }
                this.$axios.post('/wechat/generate/login/qrcode', this.info).then(Response => {
                    console.log('二维码获取成功')
                    console.log(Response.data)
                    this.qr_code_url = Response.data
                    return Response.data
                }).then(() => {
                    this.timer = setInterval(() => {
                        this.check_login_state()
                    }, 1500)
                })
            },
            check_login_state() {
                console.log('检查扫码状态...')
                this.$axios.post('/wechat/qrcode/login', this.info).then(Response => {
                    if (Response.data !== '') {
                        // clearInterval(this.timer)
                        // this.$message.error('登录失败')
                        // this.title='登录失败,请重写扫码'
                        // return
                        this.title = '扫码成功'
                        clearInterval(this.timer)
                        console.log(Response.data)
                    }

                    if (Response.data.type === 'user') {
                        if (Response.data.token) {
                            window.localStorage.setItem('dating-token', Response.data.token)
                            store.loginAction()
                            this.$router.push('/')
                            this.$message.success('登录成功，欢迎您！')
                            return
                        }
                        this.$router.push({name: 'Register', params: {wechat_id: Response.data.uid}})

                    }

                    if (Response.data.type === 'admin') {
                        if (Response.data.token) {
                            window.localStorage.setItem('admin-token', Response.data.token)
                            store.adminLoginAction()
                            this.$router.push('/admin')
                            this.$message.success('登录成功，欢迎您！')
                            return
                        }
                        this.$message.error('您不是管理员')
                        this.title = '您不是管理员,点击二维码刷新'
                    }

                }).catch(() => {
                    clearInterval(this.timer)
                })
            }
        }
    }
</script>

<style scoped>

</style>
