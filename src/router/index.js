import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import Ping from '@/views/test/Ping.vue'
import Recommend from '@/views/Recommend'
import Login from '@/views/Login'
import Register from '@/views/Register'
import User from '@/views/User'

import UserSendMessage from '@/views/UserSendMessage'

import UserMessageBox from '@/views/UserMessageBox'
import UserAdmin from '@/views/UserAdmin'
import Profile from '@/views/Profile'
import Setting from '@/views/Setting'
import ResetPassword from '@/views/ResetPassword'
import Search from '@/views/Search'
import Authentication from '@/views/Authentication'
import Promote from '@/views/Promote'
import PromoteConfirm from '@/views/PromoteConfirm'
import NotFound from '@/views/NotFound'
import Redirect from '@/views/Redirect'
import AdminLogin from '@/views/AdminLogin'
import Admin from '@/views/Admin'
import SuperAdmin from '@/views/SuperAdmin'
import Carousels from '@/views/Carousels'
import WXGroupRQCodeManager from '@/views/WXGroupRQCodeManager'
import SuperAdminUserList from '@/views/SuperAdminUserList'
import AdminCreate from '@/views/AdminCreate'
import Follow from '@/views/Follow'
import IdConfirm from '@/views/IdConfirm'
import IdConfirmResult from '@/views/IdConfirmResult'
import PrePay from '@/views/PrePay'
import QQWXGroup from '@/views/QQWXGroup'

import ScoreConfig from '@/views/ScoreConfig'
import Sendall from '@/views/Sendall'
import Settemplate from '@/views/Settemplate'
import Scorelog from '@/views/Scorelog'
import ArticleShare from '@/views/ArticleShare'
import Article from '@/views/Article'
import Product from '@/views/Product'
import WechatLogin from '@/views/WechatLogin.vue'
import Verified from '@/views/Verified.vue';
import Active from '@/views/Myactive.vue'
import AdminChatView from '@/views/adminChatView.vue'
import FansAndIntegral from '@/views/wechat/FansAndIntegral.vue'
import RegisterPromoter from '@/views/wechat/RegisterPomoter.vue'
import LocationRQcode from '@/views/wechat/LocationRQcode.vue'
import LocationRQcodeCustomerService from '@/views/wechat/LocationRQcodeCustomerService.vue'
import AddGroupChat from '@/views/AddGroupChat'
import AddCsRQ from '@/views/AddCsRQ'
import DeleteUserAdminSure from '@/views/wechat/DeleteUserAdminSure'

import DeleteCsRQSure from '@/views/wechat/DeleteCsRQSure'
import DeleteGroupChatSure from '@/views/wechat/DeleteGroupChatSure'
import DeleteQQWXGroupSure from '@/views/wechat/DeleteQQWXGroupSure'


Vue.use(VueRouter)

const mainTitle = ' - ?????????'

const routes = [{
        path: '/fans-and-integral',
        name: '???????????????',
        component: FansAndIntegral,
        meta: {
            title: '???????????????' + mainTitle,
            iswechat: true
        }
    }, {
        path: '/register-promoter',
        name: '?????????????????????',
        component: RegisterPromoter,
        meta: {
            title: '?????????????????????' + mainTitle,
            iswechat: true
        }
    }, {
        path: '/location-rqcode',
        name: '',
        component: LocationRQcode,
        meta: {
            title: '???????????????' + mainTitle,
            iswechat: true
        }
    }, {
        path: '/customer-rqcode',
        name: '',
        component: LocationRQcodeCustomerService,
        meta: {
            title: '?????????????????????' + mainTitle,
            iswechat: true
        }
    }, {
        path: '/deleteuser',
        name: '',
        component: DeleteUserAdminSure,
        meta: {
            title: '????????????' + mainTitle,
            iswechat: true
        }
    },
    {
        path: '/delete_groupchat',
        name: '',
        component: DeleteGroupChatSure,
        meta: {
            title: '????????????????????????' + mainTitle,
            iswechat: true
        }
    },
    {
        path: '/delete_csrq',
        name: '',
        component: DeleteCsRQSure,
        meta: {
            title: '?????????????????????' + mainTitle,
            iswechat: true
        }
    },
    {
        path: '/delete_qqwxgroup',
        name: '',
        component: DeleteQQWXGroupSure,
        meta: {
            title: '???????????????' + mainTitle,
            iswechat: true
        }
    },
    {
        path: '/wechat/login',
        name: '????????????',
        component: WechatLogin,
        meta: {
            title: '????????????' + mainTitle
        },
        props: true,
    },
    {
        path: '/ping',
        name: 'Ping',
        component: Ping,
        meta: {
            title: 'Ping' + mainTitle
        }
    }, {
        path: '/prePay',
        name: 'prePay',
        component: PrePay,
        meta: {
            title: '??????' + mainTitle
        }
    }, {
        path: '/idConfirm',
        name: 'idConfirm',
        component: IdConfirm,
        meta: {
            title: '????????????' + mainTitle
        }
    },
    {
        path: '/idConfirmResult',
        name: 'idConfirmResult',
        component: IdConfirmResult,
        meta: {
            title: '??????????????????' + mainTitle
        }
    },
    {
        path: '/recommend',
        name: 'Recommend',
        component: Recommend,
        meta: {
            title: '??????' + mainTitle,
            requiresAuth: true,
            needCache: true
        }
    },
    {
        path: '/promote',
        name: 'Promote',
        component: Promote,
        meta: {
            title: '????????????' + mainTitle,
            requiresAuth: true,
            needCache: true
        }
    },
    {
        path: '/user/promoteby',
        name: 'PromoteConfirm',
        component: PromoteConfirm,
        meta: {
            title: '????????????' + mainTitle
        }
    },
    {
        path: '/user/:id/promoteby/:promoteid',
        name: 'PromoteConfirm',
        component: PromoteConfirm,
        meta: {
            title: '????????????' + mainTitle
        }
    },
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            title: '??????' + mainTitle
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        props: true,
        meta: {
            title: '??????' + mainTitle
        }
    },
    {
        path: '/user/:id',
        name: 'User',
        component: User,
        meta: {
            title: '????????????' + mainTitle
        }
        // meta: {
        //     requiresAuth: true
        // }
    },

	{

	    path: '/userSendMessage/:id',

	    name: 'UserSendMessage',

	    component: UserSendMessage,

	    meta: {

	        title: '????????????' + mainTitle

	    }

	},{

	    path: '/userMessageBox/:id',

	    name: 'UserMessageBox',

	    component: UserMessageBox,

	    meta: {

	        title: '?????????' + mainTitle

	    }

	},
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
	},
    {
        path: '/setting',
        name: 'Setting',
        component: Setting,
        meta: {
            title: '????????????' + mainTitle,
            requiresAuth: true
        }
    },
    {
        path: '/verified',
        name: 'Verified',
        component: Verified,
        meta: {
            title: '????????????' + mainTitle,
            requiresAuth: true
        }
    },
    {
        path: '/admin/search',
        name: 'Search',
        component: Search,
        meta: {
            title: '??????' + mainTitle,
            requiresAdmin: true
        }
    }, {
        path: '/admin/user/:id',
        name: 'UserAdmin',
        component: UserAdmin,
        meta: {
            title: '??????' + mainTitle,
            requiresAdmin: true
        }
    }, {
        path: '/admin/authentication',
        name: 'Authentication',
        component: Authentication,
        meta: {
            title: '????????????' + mainTitle,
            requiresAdmin: true
                // requiresAuth: true
        }
    }, {
        path: '/admin/qqwxgroup',
        name: 'QQWXGroup',
        component: QQWXGroup,
        meta: {
            title: '???????????????' + mainTitle,
            requiresAdmin: true
        }
    }, {
        path: '/admin/scoreconfig',
        name: 'ScoreConfig',
        component: ScoreConfig,
        meta: {
            title: '????????????' + mainTitle,
            requiresAdmin: true
        }
    },{
        path: '/admin/sendall',
        name: 'Sendall',
        component: Sendall,
        meta: {
            title: '???????????????' + mainTitle,
            requiresAdmin: true
        }
    },{
        path: '/admin/settemplate',
        name: 'Settemplate',
        component: Settemplate,
        meta: {
            title: '????????????' + mainTitle,
            requiresAdmin: true
        }
    },{
        path: '/admin/scorelog',
        name: 'Scorelog',
        component: Scorelog,
        meta: {
            title: '????????????' + mainTitle,
            requiresAdmin: true
        }
    }, {
        path: '/admin/ArticleShare',
        name: 'ArticleShare',
        component: ArticleShare,
        meta: {
            title: '????????????',
            requiresAdmin: true
        }
    }, {
        path: '/Article',
        name: 'Article',
        component: Article,
        meta: {
            title: '??????',
            isHideNavBar: true
        }
    }, {
        path: '/admin/product',
        name: 'Product',
        component: Product,
        meta: {
            title: '????????????' + mainTitle,
            requiresAdmin: true
        }
    },  {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: {
            title: '????????????' + mainTitle
        }
    },  {
        path: '/redirect/:endpage',
        name: 'Redirect',
        component: Redirect,
        meta: {
            title: '?????????????????????' + mainTitle
        }
    },{
        path: '/redirect/:endpage',
        name: 'Redirect',
        component: Redirect,
        meta: {
            title: '?????????????????????' + mainTitle
        }
    }, {
        name: 'AddGroupChat',
        path: '/admin/AddGroupChat',
        component: AddGroupChat,
        meta: {
            title: '????????????????????????????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        name: 'AddCsRQ',
        path: '/admin/AddCsRQ',
        component: AddCsRQ,
        meta: {
            title: '?????????????????????' + mainTitle,
            requiresAdmin: true
        }
    }, {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: {
            title: '???????????????' + mainTitle
        }
    },
    {
        path: '/admin/vip',
        name: 'Admin',
        component: Admin,
        meta: {
            title: '???????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/super/admin',
        name: 'SuperAdmin',
        component: SuperAdmin,
        meta: {
            title: '?????????????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/super/adminWechatView',
        name: 'AdminChatView',
        component: AdminChatView,
        meta: {
            title: '??????????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/carousels',
        name: 'Carousels',
        component: Carousels,
        meta: {
            title: '?????????????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/super/user',
        name: 'SuperAdminUserList',
        component: SuperAdminUserList,
        meta: {
            title: '?????????????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        path: '/admin/super/create',
        name: 'AdminCreate',
        component: AdminCreate,
        meta: {
            title: '???????????????' + mainTitle,
            requiresAdmin: true
        }
    },
    {
        path: '/admin',
        redirect: '/admin/login'
    },
    {
        path: '/follow',
        name: 'Follow',
        component: Follow,
        meta: {
            title: '??????' + mainTitle,
            requiresAuth: true,
            needCache: true

        }
    },
    {
        path: '/active',
        name: 'Active',
        component: Active,
        meta: {
            title: '????????????' + mainTitle,
            requiresAuth: true,
            needCache: true

        }
    },
    {
        name: '404',
        path: '/404',
        component: NotFound,
        meta: {
            title: '404' + mainTitle
        }
    },
    {
        path: '/login',
        redirect: '/'
    },
    {
        path: '/home',
        redirect: '/'
    },
    {
        path: '/auth',
        redirect: '/setting'
    },
    {
        path: '*', // ????????????????????????????????????
        redirect: '/' // ????????????????????????
    }
]

const router = new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        // return { x: 0, y: 0 }
        return { x: 0, y: to.meta.scrollTop || 0 }; //?????????????????????????????????????????????????????????
    }
})

/* router.beforeEach((to, from, next) => {
    const token = window.localStorage.getItem('dating-token')
    if (
        to.matched.some(record => record.meta.requiresAuth) &&
        (!token || token === null)
    ) {
        Message.warning('???????????????')
        next({
            path: '/login',
            query: {redirect: to.fullPath}
        })
    } else if (token && to.name === 'Register') {
        // ???????????????????????????????????????????????????????????????
        next({
            path: from.fullPath
        })
    } else {
        next()
    }
    const adminToken = window.localStorage.getItem('admin-token')
    if (
        to.matched.some(record => record.meta.requiresAdmin) &&
        (!adminToken || adminToken === null)
    ) {
        Message.warning('??????????????????????????????')
        next({
            path: '/admin/login',
            query: {redirect: to.fullPath}
        })
    } else {
        next()
    }
}) */

export default router