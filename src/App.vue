<template>
    <div id="app">
        <template v-if="!$route.meta.iswechat">
            <AdminNavbar v-if=" ($route.params.type === 'admin') || $route.name.startsWith('Admin')|| $route.name.startsWith('UserAdmin') || $route.name.startsWith('Super') || $route.name === 'Search'|| $route.name === 'Authentication'|| $route.name === 'QQWXGroup'|| $route.name === 'ScoreConfig'|| $route.name === 'Sendall'|| $route.name === 'Settemplate'|| $route.name === 'Scorelog'|| $route.name === 'ArticleShare'|| $route.name === 'Product'|| $route.name === 'Carousels'|| $route.name === 'AddGroupChat'|| $route.name === 'AddCsRQ'"></AdminNavbar>
            <!-- <Navbar v-else></Navbar> -->
            <Navbar v-else-if="!$route.meta.isHideNavBar"></Navbar>
        </template>

        <keep-alive>
            <router-view v-if="$route.meta.needCache"/>
        </keep-alive>
        <router-view v-if="!$route.meta.needCache"/>
    </div>
</template>

<script>
import Navbar from '_c/Navbar'
import AdminNavbar from '_c/AdminNavbar'
export default {
    components: { Navbar, AdminNavbar },
    methods:{

    }
}
</script>

<style lang="scss">
body,html {
    width: 100%;
    height: 100%;
    margin: 0;
}
#app{
    width: 100%;
    height: 100%;
    overflow: auto;
}
.grey {
    color: #8c939d;
}
.left {
    float: left;
}

.right {
    float: right;
}
.container {
    max-width: 1160px;
    margin: 0 auto;
}
.el-message {
    margin-top: 80px;
    height: 80px;
    width: 400px;
    font-size: 40px
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: orange !important;
    color: #FFF;
}
.el-pager li {
    border-radius: 50% !important;
}

.btn-next, .btn-prev {
    padding: 3px 6px !important;
}

.el-select .el-input .el-select__caret {
    font-size: 20px !important;
    font-weight: bold !important;
}

.el-cascader .el-input .el-icon-arrow-down {
    font-size: 20px !important;
    font-weight: bold !important;
}

.el-tabs__nav-next, .el-tabs__nav-prev {
    font-size: 20px !important;
}

.el-icon-arrow-right, .el-icon-arrow-left {
    font-weight: bold !important;
}

.el-menu--horizontal>.el-submenu .el-submenu__icon-arrow {
    margin-left: 5px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    color: black !important;
}

@media (max-width: 700px) {
    .el-upload-dragger {
        width: 260px !important;
    }
}
</style>
