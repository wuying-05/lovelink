<template>
  <el-container>
    <el-dialog
      title="企业微信群号"
      :visible.sync="dialogVisible"
      style="text-align: center"
      :modal="false"
    >
      <img
        v-bind:src="wechatworkGroupUrl"
        style="max-width: 300px; max-height: 300px"
        v-bind:onerror="'this.src=\'' + ossUrl + '/default-avatar.png\''"
      />
    </el-dialog>
    <el-main
      class="detailMain"
    >
	<el-row>
		<el-col :lg="24" :md="24" :sm="22">
		<div style="margin: 12px">
		    <el-card>
		    <el-row style="margin-left: 20px;">
				<span style="font-size: 14px;font-weight: bold;">
					安全提示:加强自我防范意识,警惕各类诈骗行为。为保护隐私,未经过充分沟通,不建议您留下联系方式。
				</span>
				<div style="background-color: #eeeeee;height: 40px;margin-top: 5px;border-radius: 5px 5px 0 0;">
					<div style="float: left;color: #4a4a4a;font-size: 12px;margin-top: 12px;margin-left: 30px;cursor:pointer;"
					@click="useTemplate()"
					>使用模板</div>
					<!--<div style="float: left;color: #4a4a4a;font-size: 12px;margin-top: 12px;margin-left: 30px;cursor:pointer;">换一句</div>-->
				</div>
				<div style="background-color: #eeeeee;" v-show="showTemplate">
					<div style="cursor: pointer;font-size: 12px;margin-left: 30px;float: left;line-height: 26px;"  v-for="(value, key) in templateData" :key="key" 
					@click="chooseTemplate(value.id,value.content)"
					>{{value.des}}</div>
					<div style="clear: both;height: 10px;"></div>
				</div>
				<el-input
				  type="textarea"
				  :rows="8"
				  :cols="70"
				  maxlength="200"
				  show-word-limit
				  v-model="messageDate"
				  placeholder="认真看了你的资料,很真诚,愿意交个朋友吗?"
				></el-input>
				<div style="margin-top: 10px;margin-left: 5px;font-size: 14px;color: black;">修改模版：点击模版内容后，修改内容，再保存模版，即可修改原有的模版。</div>
				<!--<el-checkbox v-model="messageTop" label="在她的信件列表置顶(开通钻石会员免费使用)" style="margin-top: 20px;" border size="small"></el-checkbox>-->
				<div style="width: 100%;display:flex;justify-content: center;align-items: center;height: 100px;letter-spacing: 30px;">
					<el-button
					  type="primary"
					  @click="sendMessage()"
					  >发信息</el-button
					>
					<!--<el-button
					  icon="el-icon-message"
					  type="warning"
					  @click="sendMessage()"
					  >贴邮票发信</el-button
					>-->
					<el-button
					type="primary"
					  @click="saveTemplate()"
					  >存为模板</el-button
					>
					<div style="letter-spacing: 0px;font-size: 14px;margin-left: 15px;">(最多10个模板)</div>
				</div>
			</el-row>
			</el-card>
		</div>
		</el-col>
	</el-row>
    </el-main>
  </el-container>
</template>

<script>
// import postscribe from 'postscribe'
import store from "../store.js";

export default {
  name: "User", // this is the name of the component
  props: {
    user_id: {
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      imgSrc: "",
      loading: false,
      sharedState: store.state,
      ossUrl: store.ossUrl,
      user: "",
      albumHeight: "500px",
	  wechatworkGroupUrl: "",
	  message_user_id: 0,
	  messageDate:'',
	  messageTop:'',
	  showTemplate:true,
	  templateData:[],
	  tid:0,
    };
  },
  methods: {
	  isMobile() {
	    if (
	      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
	        navigator.userAgent
	      )
	    ) {
	      return true;
	    } else {
	      return false;
	    }
	  },
	  sendMessage(){
		  if(this.messageDate == ''){
			  this.$message.warning('发送信息不能为空')
			  return;
		  }
		  let path = "/users/send/info/" + this.sharedState.user_id;
		  let params = {
		    receive_id: parseInt(this.message_user_id),
			content: this.messageDate
		  };
		  this.$axios
		    .post(path, params)
		    .then((response) => {
					
				if(response.data.code == 0){
					this.$message.success('已发送')
					this.$router.go(-1);
				}else{
					this.$message.info(response.data.msg)
				}
		    })
		    .catch((error) => {});
	  },
	  chooseTemplate(tid,tcontent){
		  this.messageDate = tcontent;
		  this.tid = tid;
	  },
	  useTemplate(){
		  this.showTemplate = true;
		  let path = "/users/info/template/" + this.sharedState.user_id;
		  this.$axios
		    .get(path)
		    .then((response) => {
				this.templateData = response.data.items || [];
				for(var i=0;i<this.templateData.length;i++){
					if(this.templateData[i].content.length >= 20){
						this.templateData[i].des = this.templateData[i].content.substring(0,20) + '...'
					}else{
						this.templateData[i].des = this.templateData[i].content
					}
				}
		    })
		    .catch((error) => {
		  	});
	  },
	  saveTemplate(){
		  if(this.messageDate == ''){
		  			  this.$message.warning('发送信息不能为空');
		  			  return;
		  }
		  if(this.tid == 0){
			  if(this.templateData.length >= 10){
				  this.$message.warning('模板最多保存10个');
				  return;
			}
			  let path = "/users/info/template/" + this.sharedState.user_id;
			  let params = {
			  	content: this.messageDate
			  };
			  this.$axios
			    .post(path, params)
			    .then((response) => {
			  				if(response.data.error_code == 0){
			  					this.$message.success('操作成功！')
			  					this.messageDate = ''
								this.useTemplate();
								this.tid = 0;
			  				}
			    })
			    .catch((error) => {
			  	});
		  }else{
			  let path = "/users/info/template/" + this.sharedState.user_id;
			  let params = {
			  	content: this.messageDate,
				t_id:this.tid,
			  };
			  this.$axios
			    .put(path, params)
			    .then((response) => {
			  				if(response.data.error_code == 0){
			  					this.$message.success('操作成功！')
			  					this.messageDate = ''
								this.useTemplate();
								this.tid = 0;
			  				}
			    })
			    .catch((error) => {
			  	});
		  }
		  
	  },
  },
  created() {
    // eslint-disable-next-line camelcase
    let user_id = 0;
    if (this.user_id) {
      user_id = this.user_id;
    } else {
      user_id = this.$route.params.id;
    }
	this.message_user_id = user_id;
    if (this.isMobile()) {
      this.albumHeight = "150px";
    }
	this.useTemplate()
  },
};
</script>

<style scoped>
.detailMain {
  max-width: 1160px;
  margin: 0 auto;
}

.profile-item {
  margin-bottom: 5px;
}

.title {
  color: #8c939d;
}

.small-title {
  color: #8c939d;
  font-size: 14px;
}

.right {
  float: right;
}

.title-line {
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 16px;
  border-left: rgb(255, 122, 142) 4px solid;
  padding-left: 10px;
  top: 3px;
}

.title-line:first-of-type {
  margin-top: 0;
}

/* .title-line:before {
    content: "";
    position: absolute;
    left: 0;
    top: 3px;
    width: 4px;
    height: 16px;
    background: rgb(255, 122, 142);
} */

.profile-tag {
  height: auto !important;
  margin: 3px;
}

.radio-option {
  margin-bottom: 10px;
  font-size: 14px;
}
.grey {
  width: 100px;
  height: auto;
  padding: 5px;
  margin: 5px;
  background-color: #f1f1f1;
  color: #ccc;
  border-radius: 100px;
}
.info {
  width: 100px;
  height: auto;
  padding: 5px;
  margin: 5px;
  background-color: rgb(247, 146, 17);
  color: #fff;
  border-radius: 100px;
}
.middle {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-input.is-disabled .el-input__inner {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #c0c4cc;
}
.el-icon-arrow-down:before {
  display: none !important;
  content: none !important;
}
</style>
<style lang='scss' scoped>
/* .el-tag--plain.el-tag--info {
    border-color: transparent;
} */
</style>

