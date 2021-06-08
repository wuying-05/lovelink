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
				<el-tabs :tab-position="tabPosition" v-model="activeTab" @tab-click="clicktabs">
				    <el-tab-pane label="未读信" name="messageUnread">
				        <MessageUnread :changeActiveTab="changeActiveTab" ref='MessageUnread'/>
				    </el-tab-pane>
				    <el-tab-pane label="已读信" name="messageReaded">
				        <MessageReaded ref='MessageReaded'/>
				    </el-tab-pane>
				    <el-tab-pane label="已发信" name="messageSended" >
				        <MessageSended ref='MessageSended'/>
				    </el-tab-pane>
					<el-tab-pane label="管理员信" name="messageAdmin" >
					    <MessageAdmin ref='MessageAdmin'/>
					</el-tab-pane>
				</el-tabs>
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
import { CodeToText } from "element-china-area-data";
import MessageUnread from '../components/MessageUnread'
import MessageReaded from '../components/MessageReaded'
import MessageSended from '../components/MessageSended'
import MessageRegret from '../components/MessageRegret'
import MessageAdmin from '../components/MessageAdmin'
import MessageFeedback from '../components/MessageFeedback'
export default {
  name: "UserMessageBox", // this is the name of the component
  props: {
  },
  components: { MessageUnread, MessageReaded, MessageSended, MessageRegret,MessageAdmin,MessageFeedback },
  data() {
    return {
      dialogVisible: false,
      imgSrc: "",
      loading: false,
      sharedState: store.state,
      ossUrl: store.ossUrl,
      albumHeight: "500px",
	  wechatworkGroupUrl: "",
	  message_user_id: 0,
	  messageDate:'',
	  messageTop:'',
	  activeTab: 'messageUnread',
	  tabPosition: 'top',
    };
  },
  methods: {
    clicktabs(tab, event){
      console.log('tab:',tab.name) //返回的是一个vue对象，所以可以直接调用其方法
      // this.$refs.child1.childMethod(this.flag); 

      if(tab.name ==="messageReaded"){
        this.$refs.MessageReaded.resetData();
      }else if(tab.name ==="messageSended"){
        this.$refs.MessageSended.resetData();
      }else if(tab.name ==="messageAdmin"){
        this.$refs.MessageAdmin.resetData();
      }else if(tab.name ==="messageUnread"){
        this.$refs.MessageUnread.resetData();
      }

      
    },
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
	  changeActiveTab (name) {
	      this.activeTab = name
	  }
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
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate(to, from, next) {
    this.getUser(to.params.id);
    if (this.sharedState.is_authenticated) {
      this.getFollowStatus(to.params.id);
    }
    next();
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

