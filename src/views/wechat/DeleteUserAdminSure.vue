<template>
  <div class="deleteuser-wrap">

    <div v-if="canDelete">

<el-row v-loading="dialog_loading">
    <div class='title'><span>确认删除此用户？</span></div>
    <el-card :body-style="{ padding: '0px' }" class="card">
      <div class="top-lay">

        <el-avatar :size="100" :src="userinfo.avatar">
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>

      </div>

      <div style="padding: 14px;" class='des-lay'>
        <span> {{ userinfo.name }}</span><span v-if="userinfo.gender==1">（男）</span><span v-else>（女）</span>
        <p class='des-create-time'>用户创建时间:{{ timestampToTime(userinfo.create_time) }}</p>
      </div>

      <div class="bottom clearfix">

        <el-button slot="reference" class='green okbtn' v-on:click="toBack()" v-if="isDeleteOk">已删除，退出</el-button>

        <el-button slot="reference" class='green btnlay' v-if="!isDeleteOk" v-on:click="toBack()">取消</el-button>
        <el-popconfirm  class='btnlay' v-if="!isDeleteOk" @confirm="deluser(code,openid,userid)" confirm-button-text='是的'  cancel-button-text='再考虑一下' icon="el-icon-info" icon-color="red" title="确认删除此用户吗？">
          <el-button slot="reference" class='gray popbtn' >删除</el-button>
        </el-popconfirm>
      </div>
    </el-card>

  </el-row> 


    </div>
    <div v-else-if="loading">
      <div class='tip'><span>加载中，请稍后</span></div>
    </div>
    <div v-else-if="isShowTip">
      <div class='tip'><span>{{tip}}</span></div>
      <el-button slot="reference" class='green backbtn' v-on:click="toBack()" >返回</el-button>
    </div>
    <div v-else>
<div class='tip'><span>您无权限此操作，请联系管理员！</span></div>
<el-button slot="reference" class='green backbtn' v-on:click="toBack()" >返回</el-button>

    </div>
  </div>
</template>




<script>
import { Message,Loading } from "element-ui";
import wx from "weixin-js-sdk";
export default {
  name: "DeleteUserAdminSure",
  data() {
    return {
      isShowTip:false,
      tip:"",
      dialog_loading :false,
      canDelete: false,
      loading:true,
      userid: "",
      openid: "",
      code: "",
      userinfo: {
        avatar: "",
      },
    };
  },
  created() {
    this.userid = this.$route.query.userid;
    this.code = this.$route.query.code;

    if (this.$route.query.code && this.$route.query.state >= 0) {
      this.getDeleteInfo(this.$route.query.code, this.$route.query.userid);
    } else {
      const appid = "wxed3e5e820e4d6f19";
      let state = 0;
      const redirect_uri =
        `https://lovelink.net.cn/deleteuser?userid=` + this.userid;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
    }
  },
  methods: {
    timestampToTime (ttt) {
        var date = new Date(ttt*1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y+M+D+h+m+s
    },
    toBack(){
      WeixinJSBridge.call('closeWindow');

    },
    getDeleteInfo(code, userid) {
      var datas = {
        code: code,
        userid: userid,
      };
      this.$http
        .post("http://wechat.lovelink.net.cn/api/deleteuser/sure", datas)
        .then(({ data }) => {
          if (data.state === "ok") {
            this.openid = data.data.openid;
            this.userinfo = data.data.user;
            this.userinfo.avatar =
              "https://ailianwang.oss-cn-beijing.aliyuncs.com/avatars/" +
              data.data.user.avatar;
            this.canDelete = true;
            this.loading = false;
            this.isShowTip = false;
          } else {
            
            this.canDelete = false;
            this.loading = false;
            this.isShowTip = true;
            this.tip = data.msg;
            alert(data.msg);
          }
        })
        .catch((e) => {
          this.canDelete = false;
          this.loading = false;
          this.isShowTip = true;
          this.tip = '';
          this.$message.error('网络链接失败，请检查网络后重试。'); 
        });
    },
    deluser(t_code,t_openid,t_userid){
      var datas = {
        code: t_code,
        userid:t_userid,
      };
      this.dialog_loading = true;
      this.$http
        .post("http://wechat.lovelink.net.cn/api/deleteuser/do", datas)
        .then(({ data }) => {
          this.dialog_loading = false;

          if (data.state === "ok") {
            this.isDeleteOk = true;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((e) => {
          console.error(e);
          this.$message.error('网络链接失败，请检查网络后重试。'); 
          this.dialog_loading = false;
        });
  }
}}
</script>
<style scoped>
.deleteuser-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px 0;
  box-sizing: border-box;
}


.tip{
  margin-top: 20px;
  display: flex;
  width: 100%;
  color: #444857;
  font-size: .8rem;
  justify-content: center;
  font-family: 'Telefon Black', Sans-Serif;
    line-height: 1.2;
}

.backbtn{
  padding: 10px 30px;
  margin: 20px auto;
}

.title{
  display: flex;
  width: 100%;
  color: #444857;
  font-size: 1.4rem;
  justify-content: center;
  font-family: 'Telefon Black', Sans-Serif;
    line-height: 1.2;
}
  .bottom {
    line-height: 12px;
  }


  .top-lay {
    
    width: 100%;
    height:150px;
    display: flex;
    justify-content: center;
    padding-top: 50px;
    
  }

.card{
  padding:0;
  width: 270px;
  height:380px;
  margin: 20px auto;
}

.des-lay{
  position: relative;
  width: 100%;
}

 
.clearfix{
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.btnlay{
  width: 40%;
  
}

.okbtn{
  width: 75%;
}

.popbtn{
  width: 100%;
}


.green{
  background: #47cf73;
  color: #000;
}

.gray{
  background: #808080;
  color: #fff;
}

.des-create-time{
  font-size: 13px;
    color: #999;
}


</style>