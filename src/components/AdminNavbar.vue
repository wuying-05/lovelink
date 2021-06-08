<template>
    <section>
        <div class="container">
            <el-menu
                :default-active="activeItem"
                class="header"
                mode="horizontal"
                menu-trigger="hover"
                background-color="#409eff"
                text-color="#fff"
                active-text-color="#ffd04b"
                style="margin-bottom: 10px">
                <el-menu-item index="0" class="brand-logo" @click="$router.push('/admin/login')">
                    <img
                        src="../assets/logo1.png"
                        width="30"
                        height="30"
                        alt=""
                    />
                    <span class="brand-text">爱联网</span>
                    <!-- <span class="brand-text" v-if="sharedState.is_super_admin">爱联网超级管理后台</span> -->
                    <!-- <span class="brand-text" v-else>爱联网管理后台</span> -->
                </el-menu-item>
                <el-menu-item class="nav-item" index="2" @click="$router.push('/admin/super/admin')" v-if="sharedState.is_admin_authenticated && sharedState.is_super_admin">管理员管理</el-menu-item>
                <el-menu-item class="nav-item" index="13" @click="$router.push('/admin/super/adminWechatView')" v-if="sharedState.is_admin_authenticated && sharedState.is_super_admin">企业微信数据</el-menu-item>
                <el-menu-item class="nav-item" index="6" @click="$router.push('/admin/authentication')" v-if="sharedState.is_admin_authenticated">认证管理</el-menu-item>
                <el-menu-item class="nav-item" index="1" @click="$router.push('/admin/search')" v-if="sharedState.is_admin_authenticated">搜索</el-menu-item>
                <!--                普通管理员才显示 手动开通-->
                <el-menu-item class="nav-item" index="3" @click="$router.push('/admin/super/user')" v-if="sharedState.is_admin_authenticated && !sharedState.is_super_admin">套餐开通簿</el-menu-item>
<!--                <el-menu-item class="nav-item" index="3" @click="$router.push('/admin/super/user')">套餐开通簿</el-menu-item>-->
                <el-menu-item class="nav-item" index="5" @click="$router.push('/admin/product')" v-if="sharedState.is_super_admin">套餐管理</el-menu-item>
                <el-menu-item class="nav-item" index="7" @click="$router.push('/admin/qqwxgroup')" v-if="sharedState.is_admin_authenticated">群推广管理</el-menu-item>

				<el-menu-item class="nav-item" index="13" @click="$router.push('/admin/scoreconfig')" v-if="sharedState.is_admin_authenticated">扣分规则</el-menu-item>
				<el-menu-item class="nav-item" index="14" @click="$router.push('/admin/sendall')" v-if="sharedState.is_admin_authenticated">全站信</el-menu-item>
				<el-menu-item class="nav-item" index="15" @click="$router.push('/admin/settemplate')" v-if="sharedState.is_admin_authenticated ">自动发信模板</el-menu-item>
				<el-menu-item class="nav-item" index="16" @click="$router.push('/admin/scorelog')" v-if="sharedState.is_admin_authenticated">修改积分记录</el-menu-item>
                <el-menu-item class="nav-item" index="11" @click="$router.push('/admin/carousels')" v-if="sharedState.is_admin_authenticated && sharedState.is_super_admin">轮播图</el-menu-item>
                <el-menu-item class="nav-item" index="9" @click="openBaidu" v-if="sharedState.is_super_admin">统计</el-menu-item>
                <el-menu-item class="nav-item" index="12" @click="$router.push('/admin/ArticleShare')"  v-if="sharedState.is_admin_authenticated">文章分享</el-menu-item>
                <el-menu-item class="nav-item" index="10" @click="gowebsite" v-if="sharedState.is_admin_authenticated">主站</el-menu-item>

<!--                <el-menu-item class="nav-item" index="4" @click="$router.push('/admin/vip')" v-if="sharedState.is_admin_authenticated">套餐详情</el-menu-item>-->



<!--                <el-menu-item class="nav-item" index="8" @click="$router.push('/admin/super/create')" v-if="sharedState.is_super_admin">创建管理员</el-menu-item>-->

                

                <span style="float: right" v-if="sharedState.is_admin_authenticated">
                    <el-menu-item class="nav-item" index="11" @click="handlerLogout">退出</el-menu-item>
                </span>            </el-menu>
        </div>
    </section>
</template>
<script>
import store from '../store.js'
export default {
    name: 'AdminNavbar',
    data () {
        return {
            sharedState: store.state,
            activeItem: '0'
        }
    },
    methods: {
        // eslint-disable-next-line no-unused-vars
        handlerLogout (e) {
            store.adminLogoutAction()
            this.$router.push('/admin/login')
        },
        openBaidu () {
            window.open('https://tongji.baidu.com/web/homepage/index', '_blank')
            this.activeIndex = '0'
        },
        handleNavActive () {
            if (this.$route.name === 'Admin-Login') {
                this.activeItem = '0'
            } else if (this.$route.name === 'Search') {
                this.activeItem = '1'
            } else if (this.$route.name === 'SuperAdmin') {
                this.activeItem = '2'
            } else if (this.$route.name === 'SuperAdminUserList') {
                this.activeItem = '3'
            } else if (this.$route.name === 'Admin') {
                this.activeItem = '4'
            } else if (this.$route.name === 'Product') {
                this.activeItem = '5'
            } else if (this.$route.name === 'Authentication') {
                this.activeItem = '6'
            }else if (this.$route.name === 'QQWXGroup') {
                this.activeItem = '7'
            }else if (this.$route.name === 'Carousels') {
                this.activeItem = '11'
            }else if (this.$route.name === 'ArticleShare') {
                this.activeItem = '12'
            }else if (this.$route.name === 'ScoreConfig') {
                this.activeItem = '13'
            }else if (this.$route.name === 'Sendall') {
                this.activeItem = '14'
            }else if (this.$route.name === 'Settemplate') {
                this.activeItem = '15'
            }else if (this.$route.name === 'Scorelog') {
                this.activeItem = '16'
            }
        },
        gowebsite(){
            // this.$router.push('/');
            let routeData = this.$router.resolve({
                name: "/",
                params: {
                    id: 1
                }
            });
            window.open(routeData.href, '_blank');
        }
    },
    created () {
        this.handleNavActive()
    }
}
</script>

<style scoped>
.brand-logo {
    color: #fff !important;
    border-bottom-color: rgb(0, 0, 0, 0) !important;
}

.brand-text {
    font-size: 24px;
    padding-left: 5px;
}

.nav-item {
    font-size: 17px;
    vertical-align: top;
}

@media (max-width: 700px) {
    .nav-item {
        font-size: 16px;
        vertical-align: top;
    }
    .brand-text {
        font-size: 20px;
    }
}

@media (max-width: 850px) {
    .nav-item {
        padding: 0 5px;
    }
}
</style>
