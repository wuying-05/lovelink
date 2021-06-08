import axios from 'axios'
// import Vue from 'vue'
import router from './router'
import store from './store'
import { Message } from 'element-ui'

// const baseURL = process.env.NODE_ENV === 'production' ? 'https://lovelink.net.cn:8000/v1' : 'http://localhost:8000/v1'
// const baseURL = 'http://120.53.117.29:8000/v1'
//远程测试用：部署时注释
// const baseURL = 'http://lk.api.tongchengbin.com/v1'
// const baseURL = 'http://127.0.0.1:5000/v1'
const baseURL = 'https://lovelink.net.cn/v1'	
// const baseURL = 'http://120.53.117.29:8989/v1'
    // const baseURL = 'http://api.lovelink.net.cn/v1'
axios.defaults.timeout = 100000 // 超时时间
axios.defaults.baseURL = baseURL
    // axios.defaults.baseURL = 'http://d4d8f0b5.ngrok.io/v1'
    // axios.defaults.baseURL = 'http://192.168.0.112:8000/v1'

axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        var token = window.localStorage.getItem('dating-token')
        if (router.currentRoute.path.startsWith('/admin')) {
            token = window.localStorage.getItem('admin-token')
        }

        console.log("path:", router.currentRoute.path);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        } else {
            // 不是以下页面就会判断是否有登录状态
            if (['/', '/user/promoteby', '/customer-rqcode', '/location-rqcode', , '/register', '/admin/login', '/reset-password', '/register-promoter', '/Article'].includes(router.currentRoute.path)) {
                console.log("router.currentRoute.path:dump", router.currentRoute.path)
            } else {
                var regex = /^[/]user[/][0-9]{1,}$/;
                if (!regex.test(router.currentRoute.path)) {
                    Message.warning('请注册会员登录网站');
                    router.replace('/')
                }
            }
        }
        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

// Add a response interceptor
axios.interceptors.response.use(
    function(response) {
        // Do something with response data
        return response
    },
    function(error) {
        // Do something with response error
        switch (error.response.status) {
            case 406:
                // 跳转到登录页
                // 清除 Token 及 已认证 等状态
                /* store.logoutAction()
                if (router.currentRoute.path !== '/' && router.currentRoute.path !== '/admin/login') {
                    // Message.warning('认证已失效，请先登录！')
                    router.replace({
                        path: '/',
                        query: { redirect: router.currentRoute.path }
                    })
                } */
                break

            case 404:
                (window.localStorage.getItem('token')) && Message.warning('页面未找到或对应的资源不存在。')
                    // router.push('/')
                router.back()
                break
        }
        return Promise.reject(error)
    }
)

export default axios