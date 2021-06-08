export default {
    debug: false,
    ossUrl: 'https://ailianwang.oss-cn-beijing.aliyuncs.com',
    // ossUrl: process.env.NODE_ENV === 'production' ? 'https://ailianwang.oss-cn-beijing-internal.aliyuncs.com' : 'https://ailianwang.oss-cn-beijing.aliyuncs.com',
    state: {
        is_authenticated: !!window.localStorage.getItem('dating-token'),
        is_admin_authenticated: !!window.localStorage.getItem('admin-token'),
        // 用户登录后，就算刷新页面也能再次计算出 user_id
        is_super_admin: window.localStorage.getItem('admin-token')
            ? JSON.parse(
                atob(window.localStorage.getItem('admin-token').split('.')[1])
            ).is_super
            : false,
        user_id: window.localStorage.getItem('dating-token')
            ? JSON.parse(
                atob(window.localStorage.getItem('dating-token').split('.')[1])
            ).user_id
            : 0,
        admin_id: window.localStorage.getItem('admin-token')
            ? JSON.parse(
                atob(window.localStorage.getItem('admin-token').split('.')[1])
            ).admin_id
            : 3
    },
    loginAction () {
        if (this.debug) {
            console.log('loginAction triggered')
        }
        this.state.is_authenticated = true
        this.state.user_id = JSON.parse(
            atob(window.localStorage.getItem('dating-token').split('.')[1])
        ).user_id
    },
    loginActionZZ () {
        if (this.debug) {
            console.log('loginAction triggered')
        }
        this.state.is_authenticated = false
    },
    logoutAction () {
        if (this.debug) console.log('logoutAction triggered')
        window.localStorage.removeItem('dating-token')
        this.state.is_authenticated = false
        this.state.user_id = 0
    },
    adminLoginAction () {
        if (this.debug) {
            console.log('admin loginAction triggered')
        }
        this.state.is_admin_authenticated = true
        this.state.is_super_admin = JSON.parse(
            atob(window.localStorage.getItem('admin-token').split('.')[1])
        ).is_super
        this.state.admin_id = JSON.parse(
            atob(window.localStorage.getItem('admin-token').split('.')[1])
        ).admin_id
    },
    adminLogoutAction () {
        if (this.debug) console.log('admin logoutAction triggered')
        window.localStorage.removeItem('admin-token')
        this.state.is_admin_authenticated = false
        this.state.is_super_admin = false
        this.state.admin_id = 0
    }
}
