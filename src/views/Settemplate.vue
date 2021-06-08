<template>
  <el-container>
    
    <el-main class="container" element-loading-text="加载中" v-loading="loading">
    	<div class="">
			<el-button  @click="addTemplate()" size="small" type="primary">增加模板</el-button>
    		<el-card style="margin-bottom: 10px; padding: 10px 0">
    					<el-row>
    						<el-table :data="mesList" style="width: 100%">
    							<el-table-column align="center" label="模板ID" prop="index" width="70"></el-table-column>
								<el-table-column align="center" label="是否生效" width="100" prop="ff"></el-table-column>
    							<el-table-column align="center" label="内容"  width="280">
									<template slot-scope="scope">
									          <div v-html="scope.row.content"></div>
									        </template>
								</el-table-column>
								<el-table-column align="center" label="生成时间" prop="tm" width="280"></el-table-column>
    							<el-table-column align="center" label="操作" prop="degree_image_url" width="170px">
    								<template slot-scope="scope">
    									<el-button @click="addTemplate(scope.row.id,scope.row.content)" size="mini">编辑</el-button>
    								</template>
    							</el-table-column>
    						</el-table>
    						
    					</el-row>
						<el-row :lg="6" :sm="20" style="padding:20px 0;">
							<el-pagination
								:current-page="pageData.page"
								:page-count="pageData.pages"
								:size="pageData.per_page"
								@current-change="getData"
								background
								layout="prev, pager, next"
								small
							></el-pagination>
						</el-row>
    		</el-card>
    	</div>
    </el-main>
	<el-dialog :visible.sync="showTemplate" size="mini" title="模板" width="600px">
		<el-radio-group v-model="isuse" style="color: #8c939d;">
		    <el-radio class="radio-option" label="生效"></el-radio>
		    <el-radio class="radio-option" label="不生效"></el-radio>
		</el-radio-group>
		<el-form>
			
			<el-form-item label="">
				<wangEditor
				  v-model.trim="editTemplate"
				  :isClear="isClear"
				></wangEditor>
				<!--<el-input autocomplete="off" placeholder="最多50个字符" v-model="editTemplate"></el-input>-->
				</el-form-item>
		</el-form>
		<div class="dialog-footer" slot="footer">
			<el-button @click="submitTemplate(-1)" v-if="template_id != 0" style="float: left;">删 除</el-button>
			<el-button @click="submitTemplate(0)">取 消</el-button>
			<el-button @click="submitTemplate(1)" type="primary">保 存</el-button>
		</div>
	</el-dialog>
  </el-container>
</template>

<script>
// import postscribe from 'postscribe'
import store from "../store.js";
import wangEditor from "../components/wangEditor";
export default {
  name: "Settemplate", // this is the name of the component
  components: {
    wangEditor, //富文本框编辑器
  },
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
	  templateData:[],
	  tid:0,
	  pageData: {},
	  mesList: [],
	  showTemplate: false,
	  editTemplate: '',
	  template_id:0,
	  isuse:'不生效',
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
	  
		getData(page = null) {
			let page_str = '';
			if (page) {
				page_str = '?page=' + page;
			} else if (this.pageData.page) {
				page_str = '?page=' + this.pageData.page;
			}
		  const path = '/admin/info/template';
		  this.$axios
		  	.get(path)
		  	.then(response => {
				this.pageData = response.data.pagination;
				this.mesList = response.data.items;
				for(var i=0;i<this.mesList.length;i++){
					this.mesList[i].des = this.mesList[i].content.substring(0,20);
					this.mesList[i].index = i+1;
					if(this.mesList[i].flag == 1){
						this.mesList[i].ff = '生效';
					}else{
						this.mesList[i].ff = '不生效';
					}
					this.mesList[i].tm = this.GMTToStr(this.mesList[i].create_time);
				}
		  	})
		  	.catch(error => {
		  	});
		},  
		addTemplate(tem_id = 0,content=''){
			this.showTemplate = true;
			this.template_id = tem_id;
			this.editTemplate = content;
			
		},
		GMTToStr(time){
		    let date = new Date(time)
		    let tm = date.getTime();
		    date = new Date(tm-8*60*60*1000);
		    let Str=date.getFullYear() + '-' +
		    (date.getMonth() + 1) + '-' +
		    date.getDate() + ' ' +
		    date.getHours() + ':' +
		    date.getMinutes() + ':' +
		    date.getSeconds()
		    return Str
		},
		submitTemplate(val){
			if(this.editTemplate == ''){
						  alert('模板不能为空');
						  return;
			}
			let flag = 1;
			if(this.isuse == '不生效'){
				flag = 0;
			}
			if(val == 1){
				if(this.template_id == 0){
					const path = '/admin/info/template';
					let params = {
						content: this.editTemplate,
						flag:flag,
					};
					this.$axios
						.post(path,params)
						.then(response => {
									if(response.data.error_code == 0){
										this.$message.success('操作成功！')
										this.editTemplate = ''
										this.showTemplate = false;
										this.getData();
									}
						})
						.catch(error => {
						});
				}else{
					const path = '/admin/info/template';
					let params = {
						content: this.editTemplate,
						t_id:this.template_id,
						flag:flag,
					};
					this.$axios
						.put(path,params)
						.then(response => {
									if(response.data.error_code == 0){
										this.$message.success('操作成功！')
										this.editTemplate = ''
										this.showTemplate = false;
										this.getData();
									}
						})
						.catch(error => {
						});
				}
			}
			if(val == -1){
				if(this.template_id != 0){
					//删除模板
					const path = '/admin/info/template?t_id='+this.template_id;
					let params = {
						t_id:this.template_id
					};
					this.$axios
						.delete(path)
						.then(response => {
									if(response.data.error_code == 0){
										this.$message.success('操作成功！')
										this.editTemplate = ''
										this.showTemplate = false;
										this.getData();
									}
						})
						.catch(error => {
						});
				}
				
			}
			this.editTemplate = '';
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
	this.getData()
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

