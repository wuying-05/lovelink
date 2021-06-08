import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import { Message } from 'element-ui'
import isPlainObject from 'lodash/isPlainObject'

const http = axios.create({
    baseURL: 'https://lovelink.net.cn/',
    timeout: 1000 * 180,
    withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
    var token = window.localStorage.getItem('dating-token')
    if (router.currentRoute.path.startsWith('/admin')) {
        token = window.localStorage.getItem('admin-token')
    }

    console.log("router.currentRoute.path:", router.currentRoute.path)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    } else {

        // 不是以下页面就会判断是否有登录状态
        if (['/', '/user/promoteby', '/customer-rqcode', '/location-rqcode', '/register', '/admin/login', '/reset-password', '/register-promoter', '/Article'].includes(router.currentRoute.path)) {
            console.log("router.currentRoute.path:dump", router.currentRoute.path)
        } else {
            var regex = /^[/]user[/][0-9]{1,}$/;
            if (!regex.test(router.currentRoute.path)) {
                Message.warning('请注册会员登录网站');
                router.replace('/')
            }
        }
    }
    // 默认参数
    var defaults = {}
        // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
        config.params = {
            ...config.params,
            ... { '_t': new Date().getTime() }
        }
    }
    if (isPlainObject(config.params)) {
        config.params = {
            ...defaults,
            ...config.params
        }
    }
    if (isPlainObject(config.data)) {
        config.data = {
            ...defaults,
            ...config.data
        }
        if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
            config.data = qs.stringify(config.data)
        }
    }
    return config
}, error => {
    return Promise.reject(error)
})

/**
 * 响应拦截
 */
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


export default http