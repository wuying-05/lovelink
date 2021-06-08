<template>
	<el-container>
		<el-main class="container" element-loading-text="加载中" v-loading="loading">
			<div class="">
				<el-card style="margin-bottom: 10px; padding: 10px 0">
					<div class="clearfix" slot="header"><span>输入用户ID搜索（手动开通会员套餐）(发送站内信)</span></div>
					<el-form :inline="true">
						<el-form-item>
							<el-input class="search-input" placeholder="输入用户ID搜索" v-model="searchId">
								<el-button @click="searchUserWithId" icon="el-icon-search" slot="append">搜索</el-button>
							</el-input>
						</el-form-item>
						<el-form-item><el-button @click="resetIdSearch" plain type="info">清除搜索</el-button></el-form-item>
					</el-form>
					<el-row v-if="idSearchResult">
						<el-table :data="tableData" style="width: 100%;font-size: 12px;">
							<el-table-column label="ID" prop="id" width="60"></el-table-column>
							<el-table-column label="姓名" prop="name" width="60"></el-table-column>
							<el-table-column label="性别" prop="gender" width="60">
								<template slot-scope="scope">
									{{ scope.row.gender == '1' ? '男士' : '女士' }}
								</template>
							</el-table-column>
							<el-table-column label="年龄" prop="age" width="60"></el-table-column>
							<el-table-column label="学历" prop="degree" width="80">
								<template slot-scope="scope">
									{{ scope.row.degree == '1' ? '大专' : scope.row.degree == '2' ? '本科' : '研究生' }}
								</template>
							</el-table-column>
							<el-table-column label="家乡" prop="residence" width="110">
								<template slot-scope="scope">
									{{ getCity(scope.row.residence) }}
								</template>
							</el-table-column>
							<el-table-column label="工作地" prop="location" width="110">
								<template slot-scope="scope">
									{{ getCity(scope.row.location) }}
								</template>
							</el-table-column>
							<el-table-column label="开通套餐" prop="product_name" width="100"></el-table-column>
							<el-table-column label="开通套餐" prop="package_name_cn">
								<template slot-scope="scope">
									<el-select @change="productChange($event, scope.row, scope.column)" placeholder="状态" v-model="scope.row.product_id" :disabled="scope.row.productNameDisabled">
										<el-option :key="0" :value="0" label="无">无</el-option>
										<el-option
											:key="item.id"
											:label="item.name"
											:value="item.id"
											v-for="item in products.filter(product_filter(scope.row['id_confirmed']))"
										></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label="开通时间" prop="open_time" width="90"></el-table-column>
							<el-table-column label="结束时间" prop="end_time" width="90"></el-table-column>
							<el-table-column label="操作" width="160">
								<template slot-scope="scope">
									<!-- <div style="text-align:right;"> -->
									<div>
										<!-- <el-button v-if="homePage === 0" @click="handleToggleHomePage()" key="1" size="mini" >上首页</el-button>
										<el-button v-else @click="handleToggleHomePage()" key="2" size="mini" type="danger">下首页</el-button> -->
										<el-button @click="showuserdetails(scope.row.id)" size="mini" type="success">详情</el-button>

										<el-button @click="showmessage(scope.row.id)" size="mini" type="success">发送站内信</el-button>

										<el-button @click="showscore(scope.row.id)" size="mini" type="success">修改积分</el-button>
										<el-button @click="removeUserwechat(scope.row.id)" size="mini" v-if="scope.row.wechat">清除微信绑定</el-button>
										<el-button @click="removeuser(scope.row.id)" size="mini" type="danger" v-if="sharedState.is_super_admin">删除</el-button>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</el-row>
				</el-card>
				<el-card>
					<div class="clearfix" slot="header"><span>通过筛选条件进行精准搜索</span></div>
					<el-form :inline="true" :model="searchForm" label-width="50px" ref="searchForm">
						<el-form-item prop="gender">
							<el-select placeholder="性别" size="small" v-model="searchForm.gender">
								<el-option label="男" value="1"></el-option>
								<el-option label="女" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="startAge" style="width: 100px">
							<el-input size="small" v-model.number="searchForm.startAge"><i slot="suffix">岁</i></el-input>
						</el-form-item>
						_
						<el-form-item prop="endAge" style="width: 100px">
							<el-input size="small" v-model.number="searchForm.endAge"><i slot="suffix">岁</i></el-input>
						</el-form-item>
						<el-form-item prop="startHeight" style="width: 100px">
							<el-input size="small" v-model.number="searchForm.startHeight"><i slot="suffix">厘米</i></el-input>
						</el-form-item>
						_
						<el-form-item prop="endHeight" style="width: 100px">
							<el-input size="small" v-model.number="searchForm.endHeight"><i slot="suffix">厘米</i></el-input>
						</el-form-item>
						<!-- <el-form-item prop="weight">
                            <el-select v-model="searchForm.weight" size="small" placeholder="体型">
                                <el-option label="瘦长型" value="0"></el-option>
                                <el-option label="匀称型" value="1"></el-option>
                                <el-option label="矮胖型" value="2"></el-option>
                            </el-select>
                        </el-form-item> -->
						<el-form-item prop="degree">
							<el-select placeholder="学历" size="small" v-model="searchForm.degree">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in degreeOptions"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="marriage">
							<el-select placeholder="婚姻状况" size="small" v-model="searchForm.marriage">
								<el-option label="未婚" value="1"></el-option>
								<el-option label="离异" value="2"></el-option>
								<el-option label="丧偶" value="3"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item prop="homeCity">
							<el-cascader :options="cityOptions" placeholder="家乡" size="small" v-model="searchForm.residence"></el-cascader>
						</el-form-item>
						<el-form-item prop="workCity">
							<el-cascader :options="cityOptions" placeholder="工作地" size="small" v-model="searchForm.location"></el-cascader>
						</el-form-item>
						<el-form-item>
							<el-button :plain="false" @click="submitSearchForm()" icon="el-icon-search" type="primary">搜索</el-button>
							<el-button :plain="false" @click="resetSearchForm()">重置</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</div>
			<UserCardAdmin :usersData="resultData" v-if="showResult" :from="1"></UserCardAdmin>
			<el-row :lg="6" :sm="20" style="padding:20px 0;">
				<el-pagination
					:current-page="pageData.page"
					:hide-on-single-page="true"
					:page-count="pageData.pages"
					:size="pageData.per_page"
					@current-change="submitSearchForm"
					background
					layout="prev, pager, next"
					small
				></el-pagination>
			</el-row>
		</el-main>
		<el-dialog title="会员详情" :visible.sync="dialog_userdetails" width="90%"><user :user_id="userdetails_id" :showguide="false" v-if="dialog_userdetails"></user></el-dialog>
		<el-dialog title="删除会员操作" :custom-class="dialog_userdelete"  :visible.sync="dialog_userdelete" width="300px" ><DeleteUser :user_id="dialog_userdelete_id"  v-if="dialog_userdelete"></DeleteUser></el-dialog>

		<el-dialog :visible.sync="showMessage" size="mini" title="发送站内信" width="300px">

			<el-form>

				<el-form-item label="内容"><el-input autocomplete="off" placeholder="最多50个字符" v-model="editMessage"></el-input></el-form-item>

			</el-form>

			<div class="dialog-footer" slot="footer">

				<el-button @click="submitMessage(0)">取 消</el-button>

				<el-button @click="submitMessage(1)" type="primary">发 送</el-button>

			</div>

		</el-dialog>

		<el-dialog :visible.sync="showScore" size="mini" title="修改积分" width="300px">

			<el-form>

				<el-form-item label="修改积分"><el-input autocomplete="off" placeholder="写入修改的积分" v-model="editScore"></el-input></el-form-item>

			</el-form>

			<div class="dialog-footer" slot="footer">

				<el-button @click="submitScore(0)">取 消</el-button>

				<el-button @click="submitScore(1)" type="primary">确 定</el-button>

			</div>

		</el-dialog>
	</el-container>
</template>

<script>
import store from '../store';
import { regionDataPlus } from 'element-china-area-data'; // CodeToText
import { CodeToText } from 'element-china-area-data';
import { jobData, jobOptions,degreeData, marriageData, marriageOptions, degreeOptions } from '../data';
import UserCardAdmin from '../components/UserCardAdmin';
import User from '@/views/User';
import DeleteUser from '@/views/DeleteUser';

export default {
	name: 'Search', // this is the name of the component
	components: { UserCardAdmin, User ,DeleteUser},
	data() {
		return {
			check:false,
			ossUrl: store.ossUrl,
			loading: false,
			homePage: 0,
			store: store,
			sharedState: store.state,
			cityOptions: regionDataPlus,
			jobData: jobData,
			degreeData: degreeData,
			degreeOptions: degreeOptions,
			marriageOptions: marriageOptions,
			marriageData: marriageData,
			validWxGroup: false,
			dialog_userdetails: false,
			dialog_userdelete: false,
			dialog_userdelete_id:'',
			userdetails_id: null,
			jobOptions:jobOptions,
			searchForm: {
				gender: '',
				startHeight: '',
				endHeight: '',
				startAge: '',
				endAge: '',
				location: [],
				residence: [],
				marriage: '',
				// salary: '',
				degree: ''
				// weight: ''
			},
			showResult: false,
			userData: {
				name: '',
				id_confirmed: '',
				household_confirmed: '',
				degree_confirmed: ''
			},
			resultData: {},
			pageData: {},
			tableData: {},
			searchId: '',
			currentUser: '',
			products: [],
			quickens: ['慢速包', '中速包', '快速包'],
			idSearchResult: false,

			editMessage:'',

			showMessage:false,

			message_userid:'',

			editScore:'',

			showScore:false,

			score_userid:'',
		};
	},
	methods: {
		product_filter: confirmed => {
			if (confirmed) {
				return item => !(item.name.indexOf('非认证') === 0);
			} else {
				return item => !(item.name.indexOf('认证') === 0);
			}
		},
		checkAdminActive(id) {
			// eslint-disable-next-line no-template-curly-in-string
			const thisform = this;
			const path = `/admin/admins/${id}/active`;
			this.$axios
				.get(path)
				.then(response => {
					if (!response.data.active) {
						thisform.store.adminLogoutAction();
					}
				})
				.catch(error => {
					console.error(error);
				});
		},
		getProducts() {
			// eslint-disable-next-line no-template-curly-in-string
			const path = '/product/getProducts';
			this.$axios
				.post(path, {})
				.then(response => {
					if (response.data.code == 0) {
						this.products = response.data.data.res;
					}
				})
				.catch(error => {
					console.error(error);
				});
		},
		searchUserWithId() {
			this.loading = true;
			const thisform = this;
			var id = Number(this.searchId);
			this.currentUser = id;
			this.currentPage = 0;
			if (id === 0 || !Number.isInteger(id)) {
				this.$message.warning('请输入正确的用户ID');
				this.loading = false;
				return false;
			}
			const path = `/admin/users/${id}`;
			this.$axios
				.get(path)
				.then(response => {
					if (response.data.code == 0) {
						var dt = response.data.data.res;
						if ((dt.length != 0) & (dt[0] != null)) {
							thisform.tableData = dt;
							thisform.validWxGroup = !!thisform.tableData[0].wechatwork_group ? true : false;
							thisform.tableData[0].wechatwork_group = thisform.ossUrl + '/wechatworkgroup/' + thisform.tableData[0].wechatwork_group;
							thisform.loading = false;
							thisform.homePage = thisform.tableData[0].homepage;
							thisform.tableData[0].quickenbox = thisform.tableData[0].quickenbox ? thisform.tableData[0].quickenbox : '无';
							thisform.tableData[0].pay_name = dt[0].paytype == 0 ? dt[0].name : dt[0].pay_admin_name;
							dt[0].residence = dt[0].residence.split(',');
							dt[0].location = dt[0].location.split(',');
							// this.showPagination = false
							thisform.idSearchResult = true;

							// 判断开通套餐是否禁用选择
							const nowTime = new Date().getTime()
							thisform.tableData.forEach(item => {
								const endTime = new Date(item.end_time || '').getTime()

								item.productNameDisabled = endTime > nowTime ? true : false
							})
						} else {
							thisform.idSearchResult = false;
							thisform.$message.info('搜索结果为空');
							thisform.loading = false;
						}
					}

					// this.$message.success('搜索结果已更新！')
				})
				.catch(error => {
					console.error(error);
					thisform.loading = false;
					// this.showPagination = false
				});
		},
		resetIdSearch() {
			this.idSearchResult = false;
			this.searchId = '';
		},
		productChange(val, row, column) {
			//const path = '/admin/users/${id}/package/${name}'
			const path = '/admin/users/' + row.id + '/package/' + row.product_id;
			this.$axios
				.put(path)
				.then(response => {
					// this.$message.success('用户套餐状态已更新！');
					this.searchId = this.currentUser;
					this.searchUserWithId();
				})
				.catch(error => {
					console.error(error);
				});
		},
		quickenboxChange(val, row, column) {
			const path = '/admin/users/' + row.id + '/quickenbox';
			this.$axios
				.post(path, {
					quickenbox: row.quickenbox
				})
				.then(response => {
					// this.$message.success('加速包状态已更新！');
					this.searchId = this.currentUser;
					this.searchUserWithId();
				})
				.catch(error => {
					console.error(error);
				});
		},
		handleToggleHomePage() {
			const path = '/admin/users/' + this.currentUser + '/toggleHomepage';
			var _this = this;
			this.$axios
				.put(path)
				.then(response => {
					if (response.data.code == 0) {
						// this.$message.success('用户首页状态已更新！');
						this.homePage = response.data.data.res;
					}
				})
				.catch(error => {
					console.error(error);
				});
		},
		limitAdminPages() {
			// 如果当前用户是普通管理员，而且 pageData.pages 的值大于 10，重置为 10
			if (!this.sharedState.is_super_admin && this.pageData.pages > 10) {
				this.pageData.pages = 10;
			}
		},
		submitSearchForm(page = null, showmessage = true) {
			this.showResult=false;
			const startAge = this.searchForm.startAge;
			const endAge = this.searchForm.endAge;
			const startHeight = this.searchForm.startHeight;
			const endHeight = this.searchForm.endHeight;
			if (this.searchForm.gender === '') {
				this.$message.error('请选择搜索的性别');
				return false;
			}
			if (startAge !== '') {
				if (!Number.isInteger(startAge)) {
					this.$message.error('请输入正确的年龄范围开始值');
					return false;
				}
				if (endAge === '' || !Number.isInteger(endAge)) {
					this.$message.error('请输入正确的的年龄范围结束值');
					return false;
				}
				// if (startAge < 22 || startAge > 60 || endAge < 22 || endAge > 60) {
				//     this.$message.error('年龄范围需要在22~60之间')
				//     return false
				// }
				if (startAge > endAge) {
					this.$message.error('年龄范围开始值应该大于结束值');
					return false;
				}
			}
			if (startHeight !== '') {
				if (!Number.isInteger(startHeight)) {
					this.$message.error('请输入正确的身高范围开始值');
					return false;
				}
				if (endHeight === '' || !Number.isInteger(endHeight)) {
					this.$message.error('请输入正确的的身高范围结束值');
					return false;
				}
				// if (startHeight < 130 || startHeight > 228 || endHeight < 130 || endHeight > 228) {
				//     this.$message.error('身高范围需要在130~228之间')
				//     return false
				// }
				if (startHeight > endHeight) {
					this.$message.error('身高范围开始值应该大于结束值');
					return false;
				}
			}
			this.loading = true;
			let page_str = '';
			if (page) {
				page_str = '?page=' + page;
			} else if (this.pageData.page) {
				page_str = '?page=' + this.pageData.page;
			}
			const path = '/admin/users/search' + page_str;
			const payload = {
				gender: this.searchForm.gender,
				start_age: this.searchForm.startAge,
				end_age: this.searchForm.endAge,
				start_height: this.searchForm.startHeight,
				end_height: this.searchForm.endHeight,
				residence: this.searchForm.residence.toString(),
				location: this.searchForm.location.toString(),
				marriage: this.searchForm.marriage,
				degree: this.searchForm.degree
				// salary: this.searchForm.salary,
				// weight: this.searchForm.weight
			};
			this.$axios
				.post(path, payload)
				// eslint-disable-next-line no-unused-vars
				.then(response => {
					// 把返回的搜索结果数据渲染到页面
					this.resultData = response.data.users;
					this.resultData.forEach(element => {
						if (element.avatar) {
							element.avatarFile = this.ossUrl + `/avatars/${element.avatar}`;
						} else {
							element.avatarFile = this.ossUrl + '/default-avatar.png';
						}

						let data = element.job.split(',');
						let self = this;
						var a = data[0];
						var b = data[1];
						this.jobOptions.forEach(item => {
							if (item.value == a) {
								element.job = item.label

								if (item.children && item.children.length) {
									item.children.forEach(child => {
										if (child.value == b) {
											// element.job += `/${child.label}`
											element.job=child.label;//显示为第二级目录
										}
									})
								}
							}
						})
					});
					
					this.pageData = response.data.pagination;
					this.limitAdminPages();
					if (response.data.users.length === 0) {
						this.$message.info('暂无相关结果。');
					} else {
						// this.$message.success('搜索结果已更新！');
					}
					this.showResult = true;
					this.loading = false;
				})
				.catch(error => {
					// handle error, 400 and 500
					console.log('error!', error);
					this.loading = false;
				});
		},
		removeUserwechat(user_id) {
			this.$confirm('是否确认清除？')
				.then(_ => {
					this.loading = true;
					const path = '/admin/users/delete/wechat';
					const payload = {
						id: user_id
					};
					this.$axios
						.post(path, payload)
						.then(response => {
							this.$message.success('清除成功!');
							this.searchUserWithId();
						})
						.catch(error => {
							// handle error, 400 and 500
							console.log('error!', error.response);
							this.loading = false;
						});
				})
				.catch(_ => {});
		},
		resetSearchForm() {
			this.$refs['searchForm'].resetFields();
			this.searchForm.location = [];
			this.searchForm.residence = [];
			// this.getFirstSearch()
		},
		handlePageChange(page) {
			this.loading = true;
			const path = '/admin/users/search';
			this.$axios
				.post(path + '?page=' + page)
				// eslint-disable-next-line no-unused-vars
				.then(response => {
					// 把返回的搜索结果数据渲染到页面
					this.showResult = true;
					this.resultData = response.data.users;
					this.pageData = response.data.pagination;
					this.limitAdminPages();
					if (response.data.users.length === 0) {
						this.$message.info('暂无相关结果。');
					} else {
						// this.$message.success('搜索结果已更新！');
					}
					window.scrollTo(0, 0);
					this.loading = false;
				})
				.catch(error => {
					// handle error, 400 and 500
					console.log('error!', error.response);
					this.loading = false;
				});
		},
		removeuser(user_id) {
			this.dialog_userdelete = true;
			this.dialog_userdelete_id = user_id;
		},
		showuserdetails(user_id) {
			this.dialog_userdetails = true;
			this.userdetails_id = user_id;
		},

		showmessage(user_id){

			this.showMessage = true;

			this.message_userid = user_id;

		},

		submitMessage(state){

			if(state == 0){

				this.editMessage = '';

				this.showMessage = false;

			}

			if(state == 1){

				const path = '/admin/send/info';

				const params = {

					receive_id: this.message_userid,

					content: this.editMessage

				};

				this.$axios

					.post(path, params)

					.then(response => {

						this.$message.success('发送成功!');

						this.showMessage = false;

					})

					.catch(error => {

						this.showMessage = false;

					});

			}

			

		},

		showscore(user_id){

			this.showScore = true;

			this.score_userid = user_id;

		},

		submitScore(state){

			if(state == 0){

				this.editScore = '';

				this.showScore = false;

			}

			if(state == 1){

				const path = '/admin/users/'+this.score_userid+'/sroce';

				const params = {

					score: parseInt(this.editScore)

				};

				this.$axios

					.post(path, params)

					.then(response => {

						if(response.data.code == 0){

							this.$message.success('操作成功！')

						}else{

							this.$message.info(response.data.msg)

						}

						this.showScore = false;

					})

					.catch(error => {

						this.showScore = false;

					});

			}

			

		},
		getCity(location) {
			// eslint-disable-next-line no-unused-vars
			var province = CodeToText[location[0]];
			var city = CodeToText[location[1]];
			var district = CodeToText[location[2]];
			if (province === '全部') {
				return '中国';
			} else if (city === 'undefined') {
				return province;
			} else if (district === 'undefined') {
				return province + '/' + city;
			} else {
				return province + '/' + city + '/' + district;
			}
		}
	},
	created() {
		const adminId = this.sharedState.admin_id;
		this.checkAdminActive(adminId);
		this.getProducts();
	}
};
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
	content: '';
}

.clearfix:after {
	clear: both;
}

.dialog_userdelete{
	border-radius: 20px;
}
</style>
