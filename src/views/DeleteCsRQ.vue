<template>
  <div class="detailMain">
    <div class="vq">
        <!-- :logoSrc="logoSrc" -->
      <vueQr
        :autoColor="false"
        colorDark="#313a90"
        :text="codeUrl"
        :size="200"
        :margin="0"
        :logoMargin="3"
        v-if="codeUrlok"
      ></vueQr>
    </div>
    <div class="des">请管理员用微信扫此二维码确认删除</div>
  </div>
</template>

<script>
// import postscribe from 'postscribe'
import vueQr from "vue-qr";
export default {
  name: "DeleteCsRQ", // this is the name of the component
  components: { vueQr },
  props: {
    rqid: {
      default: 0,
      required: false,
    },
    showguide: {
      default: true,
      required: false,
    },
  },
  data() {
    return {
      codeUrlok: false,
      logoSrc: require("../assets/logo.png"),
      codeUrl: "",
    };
  },
  methods: {},
  created() {
    // eslint-disable-next-line camelcase
    let rqid = 0;
    if (this.rqid) {
      rqid = this.rqid;
    } else {
      rqid = this.$route.params.rqid;
    }
    this.codeUrl = "https://lovelink.net.cn/delete_csrq?rqid="+rqid;
    this.codeUrlok = true;
  },
};
</script>


<style lang='scss' scoped>
.detailMain {
  margin: 0 auto;
  width: 100%;
}

.vq {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.des {
  width: 100%;
  color: #8c939d;
  font-size: 14px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

