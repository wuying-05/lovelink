<template>
  <!-- 普通用户（会员）顶部菜单 -->
  <section>
    <div class="container">
      <el-menu
        ref="menu"
        :default-active="activeItem"
        class="header alw-header"
        mode="horizontal"
        background-color="#FF7A8E"
        menu-trigger="click"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="margin-bottom: 10px"
      >
        <el-menu-item index="0" @click="$router.push('/')" class="brand-logo">
          <img src="../assets/logo1.png" width="30" height="30" alt="" />
          <span class="brand-text">爱联网</span>
        </el-menu-item>
        <el-menu-item
          class="nav-item"
          index="1"
          @click="$router.push('/promote')"
          >同省婚恋</el-menu-item
        >
        <el-menu-item
          class="nav-item"
          index="2"
          @click="$router.push('/recommend')"
          >推荐</el-menu-item
        >
        <el-menu-item
          class="nav-item"
          index="3"
          @click="$router.push('/follow')"
          >结缘</el-menu-item
        >
        <el-menu-item
          class="nav-item my-active-nav-btn"
          index="5"
          @click="$router.push('/active')"
          >我的活动</el-menu-item
        >
        <el-submenu
          class="nav-item my-active-nav-item"
          index="4"
          style="float: right"
          v-if="sharedState.is_authenticated"
        >
          <template slot="title"
            ><i
              class="el-icon-user"
              style="
                color: #fff;
                padding-right: 0;
                margin-right: 0;
                font-size: 25px;
              "
            ></i
          ></template>
          <!-- <el-menu-item index="4-2" @click="$router.go()" v-if="$route.name === 'Setting'">实名认证</el-menu-item>
                    <el-menu-item index="4-2" @click="$router.push('/setting#verify')" v-else>实名认证</el-menu-item> -->
          <el-menu-item index="4-2" @click="$router.push('/verified')"
            >我的认证</el-menu-item
          >
          <el-menu-item index="4-3" @click="$router.push('/profile')"
            >编辑资料</el-menu-item
          >
          <el-menu-item
            index="4-1"
            @click="
              $router.push({
                name: 'User',
                params: { id: sharedState.user_id },
              })
            "
            >我的主页</el-menu-item
          >
          <el-menu-item index="4-4" @click="$router.push('/setting')"
            >账号设置</el-menu-item
          >
          <el-menu-item index="4-5" @click="handlerLogout"
            >退出登录</el-menu-item
          >
        </el-submenu>
        <span v-else class="sg-mobile-login-register">
          <el-menu-item
            class="nav-item"
            index="7"
            style="float: right"
            @click="$router.push('/login')"
            >登录</el-menu-item
          >
          <el-menu-item
            class="nav-item"
            index="6"
            style="float: right"
            @click="$router.push('/register')"
            >注册</el-menu-item
          >
        </span>
      </el-menu>
    </div>
  </section>
</template>
<script>
import store from "../store.js";
export default {
  name: "Navbar",
  data() {
    return {
      sharedState: store.state,
      activeItem: "0",
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handlerLogout(e) {
      store.logoutAction();
      localStorage.removeItem("searchForm");
      this.$router.push("/login");
    },
    handleNavActive() {
      if (this.$route.name === "Home") {
        this.activeItem = "0";
      } else if (this.$route.name === "Promote") {
        this.activeItem = "1";
        // } else if (this.$route.name === 'Search') {
        //     this.activeItem = '2'
      } else if (this.$route.name === "Recommend") {
        this.activeItem = "2";
      } else if (this.$route.name === "Follow") {
        this.activeItem = "3";
      } else if (this.$route.name === "Active") {
        this.activeItem = "5";
      } else if (
        this.$route.name === "Setting" ||
        this.$route.name === "User" ||
        this.$route.name === "Profile"
      ) {
        this.activeItem = "4";
      } else if (this.$route.name === "Login") {
        this.activeItem = "7";
      } else if (this.$route.name === "Register") {
        this.activeItem = "6";
      }
    },
  },
  created() {
    this.handleNavActive();
  },
  watch: {
    // 根据访问的路由路径自动锁定菜单选中的栏目
    $route(to, from) {
      this.handleNavActive();
    },
  },
};
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
  .el-menu-item {
    padding: 0 5px;
  }
  .nav-item {
    font-size: 16px;
    vertical-align: top;
  }
  .brand-text {
    font-size: 20px;
  }

  /* 我的活动-移动端换行对齐到第一个菜单下面 */
  /* .header {
    height: 80px;
  }
  .my-active-nav-btn {
    position: absolute;
    top: 50px;
    left: 103px;
    height: 30px !important;
    line-height: 20px !important;
  } */
}

@media (max-width: 850px) {
  .nav-item {
    padding: 0 4px;
  }
}
</style>
<style lang='scss' scoped>
/* 调整顶部菜单在手机端的样式---------------------------------------- */
@media (max-width: 700px) {
  .header {
    .el-menu-item {
      font-size: 16px;
    }
    .el-menu-item:nth-of-type(5) {
      margin-left: 35px;
    }
  }
  .el-menu--horizontal > .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}
</style>
<style lang='scss' >
@media (max-width: 700px) {
  .my-active-nav-item .el-submenu__title {
    height: 40px !important;
    line-height: 30px !important;
  }
  .sg-mobile-login-register {
    width: 100%;
    // display: flex;
    justify-content: flex-end;
    display: none;
  }
}
.el-menu--horizontal {
  .el-menu--popup {
    min-width: 86px;
    .el-menu-item {
      width: 86px;
      padding: 0 0 0 10px !important;
    }
  }
}
@media (max-width: 700px) {
  .el-menu--horizontal {
    .el-menu--popup {
      max-width: 61px;
      position: relative;
      left: 1vw;
      .el-menu-item {
        width: 61px;
      }
    }
  }
}
</style>