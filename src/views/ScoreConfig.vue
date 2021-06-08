<template>
	<el-container>
		<el-main class="container" v-loading="loading" element-loading-text="加载中">
			<el-tabs type="card" v-model="active">
				<el-tab-pane label="扣分规则" name="record">
					<el-card style="margin-bottom: 10px; padding: 10px 0">
								<el-row>
									<el-table :data="mesList" style="width: 100%">
										<el-table-column align="center" label="规则ID" prop="index"  width="70"></el-table-column>
										<el-table-column align="center" label="是否生效" width="120" prop="flag"></el-table-column>
										<el-table-column align="center" label="名称" prop="name" width="150"></el-table-column>
										<el-table-column align="center" label="扣积分数" prop="score" width="120"></el-table-column>
										<el-table-column align="center" label="操作"  width="170px">
											<template slot-scope="scope">
												<el-button @click="addTemplate(scope.row.id,scope.row.type)" size="mini">编辑</el-button>
											</template>
										</el-table-column>
									</el-table>
									
								</el-row>
					</el-card>
					<!--<el-row :gutter="5">
							<el-col :span="4" style="color: #9B9B9B;font-size: 15px;">
						    实名制会员扣分
							</el-col>
							<el-col :span="4" style="color: #9B9B9B;font-size: 15px;">
							    未实名制会员扣分
							</el-col>
						
					</el-row>
					<div style="width: 100%;background-color: #cccccc;margin-top: 3px;margin-bottom: 3px;"></div>
					<el-row :gutter="5">
					  <el-col :span="4">
					      <el-input
					          clearable
					          placeholder="实名制会员扣分"
					          size="small"
					          v-model="member_user_score"
					      >
					      </el-input>
					  </el-col>
					  <el-col :span="4">
					      <el-input
					          clearable
					          placeholder="未实名制会员扣分"
					          size="small"
					          v-model="user_score"
					      >
					      </el-input>
					  </el-col>
					  <el-col :span="4">
						  <el-button :plain="false" @click="changeScore()" type="success"
						  >提交
					      </el-button>
					  </el-col>
					
					   </el-row>-->
					   <el-dialog :visible.sync="showTemplate" size="mini" title="扣分规则" width="300px">
						   <el-radio-group v-model="isuse" style="color: #8c939d;">
						       <el-radio class="radio-option" label="生效"></el-radio>
						       <!--<el-radio class="radio-option" label="不生效"></el-radio>-->
						   </el-radio-group>
					   	<el-form>
							
					   		<el-form-item label="扣积分数"><el-input autocomplete="off" placeholder="" v-model="editTemplate"></el-input></el-form-item>
					   	</el-form>
					   	<div class="dialog-footer" slot="footer">
					   		<el-button @click="submitTemplate(0)">取 消</el-button>
					   		<el-button @click="submitTemplate(1)" type="primary">确 定</el-button>
					   	</div>
					   </el-dialog>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script>
	import store from '../store'
	export default {
		name: 'ScoreConfig', // this is the name of the component
		components: {
		},
		data() {
			return {
				loading: false,
				sharedState: store.state,
				active: "record",
				member_user_score:'',
				user_score:'',
				mesList: [
					{id:0,name:'实名认证会员发信',score:0,index:1,type:'',flag:'',},
					{id:1,name:'非实名认证会员发信',score:0,index:2,type:'',flag:'',},
					{id:2,name:'实名认证会员读信',score:0,index:3,type:'',flag:'',},
					{id:3,name:'非实名认证会员读信',score:0,index:4,type:'',flag:'',}
				],
				showTemplate: false,
				m_id:0,
				editTemplate:'',
				isuse:'生效',
				type:'',
			}
		},
		methods: {
			changeScore(){
				if(parseInt(this.member_user_score)<0||parseInt(this.user_score)<0){
					alert('请填写正确的积分规则');
					return;
				}
				let path = "/admin/rule" ;
				let params = {
					member_user: parseInt(this.member_user_score),
					user:parseInt(this.user_score),
				};
				this.$axios
				  .post(path, params)
				  .then((response) => {
						if(response.data.code == 0){
							this.$message.success('操作成功！')
						}
				  })
				  .catch((error) => {
					});
			},
			lookConfig(){
				let path = "/admin/rule" ;
				let params = {
				};
				this.$axios
				  .get(path)
				  .then((response) => {
					  this.mesList[0].score = response.data[1].score;
					  this.mesList[0].type = response.data[1].type;
					  this.mesList[0].flag = response.data[1].flag == '1'?'生效':'不生效';
					  this.mesList[2].score = response.data[0].score;
					  this.mesList[2].type = response.data[0].type;
					  this.mesList[2].flag = response.data[1].flag == '1'?'生效':'不生效';
					  this.mesList[1].score = response.data[3].score;
					  this.mesList[1].type = response.data[3].type;
					  this.mesList[1].flag = response.data[1].flag == '1'?'生效':'不生效';
					  this.mesList[3].score = response.data[2].score;
					  this.mesList[3].type = response.data[2].type;
					  this.mesList[3].flag = response.data[1].flag == '1'?'生效':'不生效';
					  console.log(this.mesList);
						this.member_user_score = response.data.member_user_num;
						this.user_score = response.data.user_num;
				  })
				  .catch((error) => {
					});
			},
			addTemplate(id,type){
				this.showTemplate = true;
				this.m_id = id;
				this.type = type;
				console.log(type);
			},
			submitTemplate(val){
				
				if(val == 1){
					if(this.editTemplate == ''){
								  alert('规则不能为空');
								  return;
					}
					/*console.log(this.m_id);
					if(this.m_id == 0 || this.m_id == 2){
						let params = {
							member_user: parseInt(this.editTemplate),
							user:parseInt(this.user_score),
						};
						let path = "/admin/rule" ;
						this.$axios
						  .post(path, params)
						  .then((response) => {
								if(response.data.code == 0){
									this.$message.success('操作成功！')
									this.showTemplate = false;
									this.lookConfig()
								}
						  })
						  .catch((error) => {
							});
					}
					if(this.m_id == 1 || this.m_id == 3){
						let params = {
							member_user: parseInt(this.member_user_score),
							user:parseInt(this.editTemplate),
						};
						let path = "/admin/rule" ;
						this.$axios
						  .post(path, params)
						  .then((response) => {
								if(response.data.code == 0){
									this.$message.success('操作成功！')
									this.showTemplate = false;
									this.lookConfig()
								}
						  })
						  .catch((error) => {
							});
					}*/
					console.log(this.type);
					let flag = 1;
					if(this.isuse == '不生效'){
						flag = 0;
					}
					let params = {
						type: this.type,
						score:parseInt(this.editTemplate),
						flag:flag,
					};
					let path = "/admin/rule" ;
					this.$axios
					  .post(path, params)
					  .then((response) => {
							if(response.data.code == 0){
								this.$message.success('操作成功！')
								this.showTemplate = false;
								this.lookConfig()
							}
					  })
					  .catch((error) => {
						});
					
				}
				this.editTemplate = '';
				this.showTemplate = false;
			}
		},
		created() {
			this.lookConfig()
		}
	}
</script>

<style scoped>
	.tag {
		margin: 2px;
	}

	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	/* .image {
    width: 100%;
    display: block;
  } */

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}
</style>
