<template>
  <div class="location-rq-wrap">
    <img
      v-if="location_info.show_image_url !== ''"
      v-bind:src="location_info.show_image_url"
      class="avatar"
    />
    <!-- <span v-if="location_info.city_code !== ''">
      {{ location_info.country }}-{{ location_info.province }}-{{
        location_info.city
      }}-{{ location_info.city_code }}
    </span> -->

     <span v-if="location_info.city_code !== ''">
      我的客服
    </span>

  </div>
</template>
<script>
import wx from "weixin-js-sdk"; //注意路径

export default {
  name: "LocationRQcodeCustomerService",
  data() {
    return {
      appid: "wxed3e5e820e4d6f19",
      redirect_uri: "https://lovelink.net.cn/customer-rqcode",
      token: "",
      curUrl: "",
      code: "",
      des: "",
      access_token: "",
      openid: "",
      signature: "",
      location_info: {
        rq_code_wx_image_url: "",
        rq_code_oos_image_url: "",
        country: "",
        province: "",
        city: "",
        city_code: "",
        show_image_url: "",
      },
    };
  },
  methods: {
    query_location_rq_code: function (openid, callback) {
      console.log("查询定位记录");
      var url = "http://wechat.lovelink.net.cn/api/query_location_rq_cs_code";
      var parms = {
        openid: openid,
        type: "location",
      };
      this.$http.post(url, parms)
        .then((data) => {
          callback(data.data.state, data.data, openid);
          console.log("当前URL地址：" + window.location.href);
        })
        .catch(function (error) {
          callback("error", error, openid);
        });
    },
    inster_location_record: function (
      latitude,
      longitude,
      precision,
      openid,
      callback
    ) {
      "precision 精度";
      "";
      var url = "http://wechat.lovelink.net.cn/api/inster_location_record";

      console.log("插入定位信息 inster_location_record");
      var parms = {
        type: "location",
        openid: openid,
        Latitude: latitude,
        Longitude: longitude,
        Precision: precision,
      };
      this.$http.post(url, parms)
        .then((data) => {
          callback(data.data.state, data.data, openid);
        })
        .catch(function (error) {
          callback("error", error, openid);
        });
    },
    get_wx_signature_config: function (code, url) {
      var type = "location";

      url =
        "http://wechat.lovelink.net.cn/api/get_wx_signature_h5?type=" +
        type +
        "&code=" +
        code +
        "&url=" +
        encodeURIComponent(url);

      console.log("获取签名信息 get_wx_signature_h5");
      this.$http.post(url)
        .then((data) => {
          if (data.data.data.openid && data.data.data.signature) {
            this.openid = data.data.data.openid;
            this.signature = data.data.data.signature;
            this.timestamp = data.data.data.timestamp;
            this.nonceStr = data.data.data.nonceStr;

            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: this.appid, // 必填，公众号的唯一标识
              timestamp: this.timestamp, // 必填，生成签名的时间戳
              nonceStr: this.nonceStr, // 必填，生成签名的随机串
              signature: this.signature, // 必填，签名
              jsApiList: ["getLocation"], // 必填，需要使用的JS接口列表
            });
          } else {
            alert("服务器异常 （ 3001 ）");
            // console.log("服务器返回的数值缺失，检查服务器返回格式是否正确");
          }
        })
        .catch(function (error) {
          alert("网络获取失败 请检查您的网络");
          //   console.log("获取签名出现问题");
          //   console.log(error);
        });
    },
  },

  created() {
    this.code = this.$route.query.code;
    this.access_token = this.$route.query.access_token;
    this.openid = this.$route.query.openid;

    // rq_imag_url="+encodeURIComponent(show_image_url)+"&country="+data.data.data.country+"&province="+data.data.data.province+"&city="+data.data.data.city+"&city_code
    if (!this.code && !this.access_token && !this.openid) {
      //  微信公众号首次进入页面 需要进行重定向操作

      let fistUrl =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        this.appid +
        "&redirect_uri=" +
        encodeURIComponent(this.redirect_uri) +
        "&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
      console.log("啥都没有进入网页中！即将要进行重定向：" + fistUrl);

      window.location.href = fistUrl;
      this.curUrl = window.location.href;
    } else {
      // 已完成重定向操作再次进入到界面

      console.log("完成重定向：" + window.location.href);
      wx.ready(() => {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        // console.log("微信SDK配置成功");
        wx.getLocation({
          type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: (res) => {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度

            // （status,openid）=>
            this.inster_location_record(
              latitude,
              longitude,
              accuracy,
              this.openid,
              (status, data, openid) => {
                //   这一步只是进行定位数据纪录上传的功能
                //   此次是否成功失败 都会进入下一步查询

                // if (status === "ok") {
                //   console.log("添加用户位置信息ok");
                // } else {
                //   console.log("添加用户位置信息 失败");
                // }

                this.query_location_rq_code(
                  this.openid,
                  (rq_status, rq_data, rq_openid) => {
                    // console.log("根据openid 查询二维码的结果为：" + rq_status);
                    // console.log(rq_data);
                    if (rq_status === "ok") {
                      this.location_info = rq_data.data;
                      if (
                        rq_data.data.rq_code_wx_image_url &&
                        rq_data.data.rq_code_wx_image_url != ""
                      ) {
                        this.location_info.show_image_url =
                          rq_data.data.rq_code_wx_image_url;
                      } else {
                        this.location_info.show_image_url =
                          rq_data.data.rq_code_oos_image_url;
                      }
                    } else if (
                      rq_status == "error" &&
                      rq_data.data.errorcode === 2000
                    ) {
                      alert("暂无客服信息");
                    } else if (
                      rq_status == "error" &&
                      rq_data.data.errorcode === 1003
                    ) {
                      alert("定位信息获取失败，请检查是否开启定位权限");
                    } else {
                      alert(
                        "网络获取失败 请检查您的网络：" + rq_data.data.errorcode
                      );
                    }
                  }
                );
              }
            );
            // console.log("查询地理位置信息ok：");
            // console.log(res);
          },
          cancel: () => {
            //   取消定位，查询是否数据库有记录 如果有的话 就显示原记录
            //  如果没有的话 提示此功能需同意开启定位权限才能使用

            this.query_location_rq_code(
              this.openid,
              (rq_status, rq_data, rq_openid) => {
                // console.log("根据openid 查询二维码的结果为：" + rq_status);
                if (rq_status === "ok") {
                  this.location_info = rq_data.data;
                  if (
                    rq_data.data.rq_code_wx_image_url &&
                    rq_data.data.rq_code_wx_image_url != ""
                  ) {
                    this.location_info.show_image_url =
                      rq_data.data.rq_code_wx_image_url;
                  } else {
                    this.location_info.show_image_url =
                      rq_data.data.rq_code_oos_image_url;
                  }
                } else if (
                  rq_status == "error" &&
                  rq_data.data.errorcode === 2000
                ) {
                  alert("暂无匹配群组信息 请联系客服");
                } else if (
                  rq_status == "error" &&
                  rq_data.data.errorcode === 1003
                ) {
                  alert("此功能需同意开启定位权限才能使用");
                } else {
                  alert(
                    "网络获取失败 请检查您的网络：" + rq_data.data.errorcode
                  );
                }
              }
            );
          },
          fail: (error) => {
            //   定位失败
            this.query_location_rq_code(
              this.openid,
              (rq_status, rq_data, rq_openid) => {
                // console.log("根据openid 查询二维码的结果为：" + rq_status);
                if (rq_status === "ok") {
                  this.location_info = rq_data.data;
                  if (
                    rq_data.data.rq_code_wx_image_url &&
                    rq_data.data.rq_code_wx_image_url != ""
                  ) {
                    this.location_info.show_image_url =
                      rq_data.data.rq_code_wx_image_url;
                  } else {
                    this.location_info.show_image_url =
                      rq_data.data.rq_code_oos_image_url;
                  }
                } else if (
                  rq_status == "error" &&
                  rq_data.data.errorcode === 2000
                ) {
                  alert("暂无匹配群组信息 请联系客服");
                } else if (
                  rq_status == "error" &&
                  rq_data.data.errorcode === 1003
                ) {
                  alert("定位信息获取失败，请检查是否开启定位权限");
                } else {
                  alert(
                    "网络获取失败 请检查您的网络：" + rq_data.data.errorcode
                  );
                }
              }
            );
          },
        });
      });

      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        // console.log("微信SDK配置失败");
        alert("服务获取失效，请联系客服。");
        // console.log(res);
      });

      //   console.log("获取sdk签名配置");
      this.get_wx_signature_config(
        this.code,
        window.location.href.split("#")[0]
      );
    }
  },
};
</script>

<style scoped>
.location-rq-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 40px 0;
  box-sizing: border-box;
}
</style>