<template>
  <div class="fans-and-integral-wrap">
    <img :src="resData.avatar" class="avatar" />

    <el-button
      type="primary"
      style="margin-top: 20px; margin-left: 0"
      @click="dialogVisible = true"
      >我的推广二维码
    </el-button>
    <p class="fans-num">
      推广粉丝<span style="color: #eb6a1a"> {{ resData.fans_num }} </span>人
    </p>
    <span class="tip">1人关注公众号 +10 分</span>
    <p class="my-integral" style="margin-top: 10px">
      我的积分：<span style="color: orange; font-weight: bold">{{
        points
      }}</span>
    </p>
    <p class="my-integral" style="margin: 10px 0">
      本周新增积分：<span style="color: orange; font-weight: bold">{{
        integralAndSearchNum.curWeekIntegral
      }}</span>
    </p>
    <el-button type="primary" style="margin-bottom: 20px" @click="toMyActive"
      >积分奖励</el-button
    >
    <el-button type="primary" style="margin-left: 0"
      >我推广的粉丝({{ fans_num }})</el-button
    >
    <div class="fans-item" v-for="(f, index) in fans" :key="index">
      <img :src="f.avatar" class="fans-avatar" />
      <span>{{ f.nickname }}</span>
    </div>
    <el-button
      type="primary"
      size="small"
      style="margin-top: 20px; margin-left: 0"
      @click="more"
      v-if="!showMsg"
      >查看更多
    </el-button>
    <span class="no-more" v-else>- 没有更多了 -</span>

    <el-dialog title="我的推广二维码" :visible.sync="dialogVisible" width="80%">
      <div style="display: flex; flex-direction: column; align-items: center">
        <vueQr :callback="qrBack" :text="resData.qrcode" :size="200"></vueQr>
        <div class="effect-time">
          <span>该二维码有效期截止到：</span>
          <span style="margin-top: 3px">{{ getYMDHMS(resData.qrdate) }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="个人资料"
      :visible.sync="loginVis"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="80%"
    >
      <div style="display: flex; flex-direction: column; align-items: center">
        <div class="person-info-tip">
          <span>1. 姓名和手机号为必填项，用于奖品兑换。</span>
          <span>2. 填写资料后才可进行积分查询等操作</span>
        </div>
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vueQr from "vue-qr";
import { Message } from 'element-ui'

export default {
  name: "FansAndIntegral",
  components: { vueQr },
  data() {
    return {
      dialogVisible: false,
      info: false,
      posterName: "",
      page: 1,
      showMsg: false,
      fans_num: 0,
      show: "my",
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "长度为11个字符", trigger: "blur" },
        ],
      },
      form: {
        name: "",
        phone: "",
      },
      resData: {
        id: 0,
        avatar: "",
        fans_num: 0,
        name: "",
        nickname: "",
        phone: "",
        qrcode: "",
        qrdate: 0,
        score: 0,
        sex: 0,
      },
      loginVis: false,
      activeName: "fans",
      fans: [],
      rank: [],
      poster_id: "",
      nickname: "用户昵称",
      points: 0,
      integralAndSearchNum: {
        curWeekIntegral: 0, // 本周新增积分
      },
    };
  },
  created() {
    if (this.$route.query.code && this.$route.query.state >= 0) {
      this.getData();
      // this.getIntegralData();
      // this.getIntegralAndSearchNum();
    } else {
      this.tohrefFistLink();
    }
  },
  methods: {
    tohrefFistLink(){
      const appid = "wxed3e5e820e4d6f19";
      const url = "lovelink.net.cn";
      let state = 0;
      const redirect_uri = `http://${url}/fans-and-integral`;
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    },
    toMyActive() {
      this.$router.push({ name: "Active" });
    },
    qrBack() {},
    onSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$http
            .post(
              "http://wechat.lovelink.net.cn/api/e-player/" + this.resData.id,
              this.form
            )
            .then((res) => {
              this.loginVis = false;
              this.info = false;
            })
            .catch((e) => {
              console.error(e);
            });
        }
      });
    },

    getYMDHMS(timestamp) {
      let time = new Date(timestamp * 1000);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minute = time.getMinutes();
      let second = time.getSeconds();

      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return `${year}-${month}-${date} ${hours}:${minute}:${second}`;
    },
    more() {
      let query = "";
      if (this.poster_id) {
        query = "?poster_id=" + this.poster_id;
      }
      this.page = this.page + 1;
      const url = `http://wechat.lovelink.net.cn/api/e-player/more/${this.resData.id}/${this.page}${query}`;
      this.$http
        .get(url)
        .then(({ data }) => {
          this.fans = this.fans.concat(data.data);
          if (data.data.length < 15) {
            this.showMsg = true;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    getData() {
      this.poster_id = this.$route.query.state;
      let data = {
        code: this.$route.query.code,
        state: this.$route.query.state,
      };
      this.$http
        .post("http://wechat.lovelink.net.cn/api/weChat/token", data)
        .then(({ data }) => {
          console.log("token", data);
          if (data.state === "ok") {
            this.resData = data.data; // 所有数据
            this.form.name = data.data.name; // 用户本人名称
            this.form.phone = data.data.phone; // 手机号
            this.fans_num = data.data.fans.count; // 粉丝数量
            this.fans = data.data.fans.list; // 粉丝
            this.integralAndSearchNum.curWeekIntegral =
              data.data.new_week_score || 0; // 新增积分
            this.posterName = data.data.posterName;
            this.rank = data.data.rank50;
            if (this.fans.length < 15) {
              this.showMsg = true;
            }
            // if (!this.form.phone) {
            //   this.loginVis = true;
            //   this.info = true;
            // }
            this.getIntegralData(data.data.openid);
          }else{
            if(data.msg === 'errcode: 40163'){
              this.tohrefFistLink();
            }else{
              essage.error('系统繁忙')
            }
            
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    getIntegralData(openid) {
      this.$http
        .get("http://wechat.lovelink.net.cn/api/score/" + openid)
        .then(({ data }) => {
          this.points = data.data.score; // 我的积分
          this.nickname = data.data.nickname;
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>
<style scoped>
.fans-and-integral-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px 0;
  box-sizing: border-box;
}

.avatar {
  width: 130px;
  height: 130px;
  border-radius: 5px;
}

.fans-num {
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.tip {
  font-size: 12px;
  color: #9b9b9b;
}

.no-more {
  font-size: 12px;
  color: #9b9b9b;
  margin-top: 20px;
}

.my-integral {
  font-size: 20px;
  margin: 0;
}

.effect-time,
.person-info-tip {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 15px;
  margin-top: 20px;
  font-size: 0.6rem;
  box-sizing: border-box;
  background-color: #faebd7;
}

.effect-time,
.person-info-tip span {
  display: block;
  margin-top: 3px;
}

.person-info-tip {
  margin-top: 0;
}

.el-form {
  width: 100%;
  margin-top: 20px;
}

.fans-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
  font-size: 14px;
  color: #4a4a4a;
}

.fans-avatar {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>
