<template>
    <div @click="goWechatLogin" class="wechat-login-btn">
        <img alt="" src="../assets/icons/wechat.png"
             style="width: 30px;height: 30px;display: inline-block;margin-right: 10px">
        <span>微信登录</span>
    </div>
</template>

<script>
    export default {
        name: 'WechatLoginButton',
        props: {
            type: null
        },
        methods: {
            goWechatLogin() {
                return this.$router.push({name: '微信登录', params: {type:this.type}})
            }
        }
    }
</script>

<style scoped>
    .wechat-login-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        cursor: pointer;
        background-color: #409EFF;
        border: 1px solid #409EFF;
        color: #FFF;
        padding: 0 10px;
        border-radius: 4px;
    }

    .wechat-login-btn:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #FFF;
    }
</style>
