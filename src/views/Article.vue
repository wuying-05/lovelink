<template>
  <div class="sg-news-detail" v-if="detailObject.title">
    <div class="sg-title">
      <h1>{{ detailObject.title }}</h1>
      <h2>
        作者：{{ detailObject.author }}{{ " | " }}更新时间：{{
          new Date(detailObject.modify_time)
            .toLocaleString("zh-Hans-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replace(/\//g, "-")
        }}
      </h2>
    </div>
    <hr />
    <div class="sg-detail" v-html="detailObject.content"></div>
    <hr />
    <!-- <div class="sg-detail-footer">
      <div class="sg-left sg-page" :disabled="curentIndex<=0" @click="goto(curentIndex-1)">
        <b>上一篇：</b>
        <p>{{0>=curentIndex?'没有了':items[curentIndex-1].title}}</p>
      </div>
      <div
        class="sg-right sg-page"
        :disabled="curentIndex>=items.length-1"
        @click="goto(curentIndex+1)"
      >
        <b>下一篇：</b>
        <p>{{curentIndex>=items.length-1?'没有了':items[curentIndex+1].title}}</p>
      </div>
      <div class="sg-right">
        <b></b>
        <p></p>
      </div>
    </div> -->
  </div>
</template>
<script>
import store from "../store.js";
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      apiUrl: "https://lovelink.net.cn/v1",
      ossUrl: store.ossUrl,
      items: [],
      detailObject: {},
      curentIndex: 0, //当前文章索引
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    init() {
      //   通过接口获取当前文章相关信息----------------------------------------
      this.getArticle((d) => {
        if (d.data && d.data.code == -1)
          return this.$message.error(
            "注意检查文章id是否准确，没有查询到对应的文章"
          );
       /*  if (!(d.data.status==1||d.data.status==3))
          return this.$message.error("文章未审核通过，请联系超管通过审核"); */
        this.detailObject = d.data || {};
        /*  this.detailObject = {
          title: d.data,
          desc: "摘要内容摘要内容摘要内容摘要内容摘要内容摘要内容",
          time: "2021年1月30日 14:54:56",
          content:
            "<h1>文本内容</h1>超长度的文字内容测试只是为了判断字段对应的文字最大长度是否有限制，以防止文字长度过长出现布局混乱，div被撑开，导致页面显示错位，UI破坏，以及其他的报错情况发生。超長度的文字內容測試只是為了判斷字段對應的文字最大長度是否有限制，以防止文字長度過長出現佈局混亂，div被撐開，導致頁面顯示錯位，UI破壞，以及其他的報錯情況發生。Ultra-length text content test is only to determine whether the maximum length of the text corresponding to the field to determine the length of the text to prevent the layout of the chaos, div was distraction, resulting in page dislocation, UI damage, and other error occurred.",
        }; */
        document.title = this.detailObject.title || "文章详情页"; //修改页面title
        this.setWechatShare();
      });
    },
    //b)	通过id获取具体某一条文章接口
    getArticle(c) {
      this.$axios
        .get(`${this.apiUrl}/admin/articles/get/${this.$route.query.id}`)
        .then((d) => {
          c && c(d);
        })
        .catch((d) => {
          this.$message.error("获取文章失败");
        });
    },
    setWechatShare() {
      const thisform = this;
      const url = location.href.split("#")[0];
      let str2 = encodeURIComponent(url);
      const path = `${this.apiUrl}/users/promote/wxshare?id=${this.$route.query.id}&url=${str2}`;
      const jsApiList = [
        "updateAppMessageShareData", // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
        "updateTimelineShareData", // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
        // "onMenuShareWeibo", //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
      ]; // 必填，需要使用的JS接口列表
      this.$axios
        .get(path)
        .then((response) => {
          wx.config({
            debug: false, // 开启调试模式
            appId: response.data.wechat.appId, // 必填，公众号的唯一标识
            timestamp: response.data.wechat.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.wechat.noncestr, // 必填，生成签名的随机串
            signature: response.data.wechat.signature, // 必填，签名
            jsApiList: jsApiList,
          });
          var avatarFilename;
          if (response.data.basic.avatar === "") {
            avatarFilename = this.ossUrl + "/default-avatar.png";
          } else {
            avatarFilename = response.data.basic.avatar;
          }
          // const avatarUrl = thisform.ossUrl + `/avatars/${avatarFilename}`;
          const avatarUrl = `https://lovelink.net.cn/favicon.png`;
          const title = this.detailObject.title;
          const desc = this.detailObject.abstract;
          // console.log("描述", desc);
          wx.ready(function () {
            wx.checkJsApi({
              jsApiList: jsApiList,
              success: function (res) {
                //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
                wx.updateTimelineShareData({
                  title: title,
                  desc: desc,
                  link: location.href.split("#")[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: avatarUrl, // 分享图标
                  success: function () {},
                });
                wx.updateAppMessageShareData({
                  title: title, // 分享标题
                  desc: desc, // 分享描述
                  link: location.href.split("#")[0], // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl: avatarUrl, // 分享图标
                  success: () => {},
                });
              },
            });
          });
          wx.error(function (res) {
            console.log(res);
          });
        })
        .catch((error) => {});
    },
    goto(index) {
      this.$router.push({
        path: "/singleNewsDetail",
        query: {
          item: this.$route.query.item,
          id: this.items[index].id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
$minWidth: 1160px;
.sg-news-detail {
  max-width: $minWidth;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .sg-title {
    // margin-top: 20px;
    h1 {
      text-align: center;
      font-size: 30px;
      color: black;
      margin-bottom: 10px;
      //   font-weight: normal;
    }
    h2 {
      text-align: center;
      font-size: 15px;
      color: #999;
      text-transform: uppercase;
      font-weight: normal;
    }
  }
  hr {
    border: none;
    height: 0;
    width: 100%;
    border-top: 1px solid #dbdbdb;
    margin: 10px 0;
  }
  .sg-detail {
    font-size: 14px;
    // text-align: center;
   /*  & >>> p {
      transition: 0.2s ease-out;
      font-size: 14px;
      // text-align: justify;
      line-height: 26px;
      color: #666;
      margin-bottom: 20px;
      &:hover {
        color: lightblue;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    } */
    & >>> img {
      transition: 0.2s ease-out;
      margin-bottom: 20px;
    }
  }
  .sg-detail-footer {
    font-size: 14px;

    display: flex;
    justify-content: space-between;
    .sg-page {
      width: 50%;
      cursor: pointer;
      b {
        color: black;
      }
      p {
        color: #666;
      }
      &[disabled] {
        /*全站变成灰色（去色）*/
        filter: grayscale(10%);
        -moz-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        -webkit-filter: grayscale(1);
        pointer-events: none;
        opacity: 0.5;
      }
      &:hover {
        b,
        p {
          color: lightblue;
        }
      }
      &:active {
        // @include active;
      }
    }
    .sg-left {
      //   @extend %dj-left;
      b {
      }
      p {
      }
    }
    .sg-right {
      //   @extend %dj-right;
      b {
      }
      p {
      }
    }
  }
}
</style>