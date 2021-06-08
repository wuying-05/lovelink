<template>
<!-- 认证管理 -->
	<el-container>
		<el-main class="container" element-loading-text="加载中" v-loading="loading">
			<div class="">
				<el-card style="margin-bottom: 10px; padding: 10px 0">
					<el-tabs :before-leave="changeBefore" @tab-click="handleClick" stretch v-model="activeTabName">
						<el-tab-pane label="身份认证" name="first">
							<el-form :inline="true" :model="searchForm" label-width="50px" ref="searchForm">
								<el-form-item>
									<el-input placeholder="用户ID" size="small" style="width: 100px" v-model="searchForm.user_min"></el-input>
									<span style="padding:0 5px;">至</span>
									<el-input placeholder="用户ID" size="small" style="width: 100px" v-model="searchForm.user_max"></el-input>
								</el-form-item>
								<el-form-item prop="weight">
									<el-select clearable placeholder="实名认证" size="small" v-model="searchForm.id_confirmed">
										<el-option label="未认证" value="0"></el-option>
										<el-option label="已认证" value="1"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item prop="marriage">
									<el-select clearable placeholder="学历认证" size="small" style="width: 150px" v-model="searchForm.degree_confirmed">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in checkStatusOptions"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item prop="marriage">
									<el-select clearable placeholder="婚姻状况认证" size="small" v-model="searchForm.household_confirmed">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in checkStatusOptions"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button :plain="false" @click="submitSearchForm()" icon="el-icon-search" size="small" type="primary">搜索</el-button>
									<el-button :plain="false" @click="resetSearchForm()" size="small">重置</el-button>
								</el-form-item>
							</el-form>
							<el-row v-if="idSearchResult">
								<el-table :data="resultData" style="width: 100%">
									<el-table-column align="center" label="用户ID" prop="id" width="70"></el-table-column>
									<el-table-column align="center" label="姓名" prop="name" width="80"></el-table-column>
									<el-table-column align="center" label="婚姻状况" prop="marriage_label" width="80"></el-table-column>
									<el-table-column :formatter="degreeFormat" align="center" label="学历" prop="degree" width="80"></el-table-column>
									<el-table-column :formatter="stateFormat" align="center" label="实名认证" prop="id_confirmed" width="80"></el-table-column>

									<el-table-column align="center" label="学历认证" prop="degree_confirmed" width="130">
										<template slot-scope="scope">
											<el-select
												@change="authenticationStatus('degree_confirmed', scope.$index, scope.row)"
												placeholder="状态"
												style="width: 100px;"
												v-model="scope.row.degree_confirmed"
											>
												<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in checkStatusOptions"></el-option>
											</el-select>
										</template>
									</el-table-column>
									<el-table-column label="学历图片" width="80">
										<template slot-scope="scope">
											<el-link style="margin-left: 10px;" target="_blank" v-bind:href="scope.row.degree_image_url.replace('120.53.117.29/','120.53.117.29:8989/')" v-if="scope.row.household_image_uploaded">
												查看
											</el-link>
										</template>
									</el-table-column>

									<el-table-column align="center" label="婚姻状况认证" prop="household_confirmed" width="130">
										<template slot-scope="scope">
											<el-select
												@change="authenticationStatus('household_confirmed', scope.$index, scope.row)"
												placeholder="状态"
												v-model="scope.row.household_confirmed"
											>
												<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in checkStatusOptions"></el-option>
											</el-select>
										</template>
									</el-table-column>

									<el-table-column align="center" label="户口图片" prop="household_image_url" width="80">
										<template slot-scope="scope">
											<el-link target="_blank" v-bind:href="scope.row.household_image_url.replace('120.53.117.29/','120.53.117.29:8989/')" v-if="scope.row.household_image_uploaded">查看</el-link>
										</template>
									</el-table-column>

									<el-table-column align="center" label="备注" prop="remark"></el-table-column>
									<el-table-column align="center" label="操作" prop="degree_image_url" width="170px">
										<template slot-scope="scope">
											<el-button @click="editRemarkHandle(scope.$index)" size="mini">编辑备注</el-button>
										</template>
									</el-table-column>
								</el-table>
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
							</el-row>
						</el-tab-pane>
						<el-tab-pane label="认证详情" name="second">
							<el-row>
								<el-table :data="authStateList" style="width: 100%">
									<el-table-column align="center" label="管理员ID" prop="id" width="80"></el-table-column>
									<el-table-column align="center" label="姓名" prop="name" width="200"></el-table-column>
									<el-table-column align="center" label="手机号" prop="phone" width="200"></el-table-column>
									<el-table-column align="center" label="认证总人数" prop="user_cnt"></el-table-column>
									<el-table-column align="center" label="认证总条数" prop="cnt"></el-table-column>
									<el-table-column align="center" label="操作">
										<template slot-scope="scope">
											<el-button @click="detailHandle(scope.$index)" size="small" type="primary">查看详情</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-row>
						</el-tab-pane>
						<el-tab-pane href="https://www.chsi.com.cn/xlcx/lscx/query.do" label="学信网学历认证" name="third">
							<el-link href="https://www.chsi.com.cn/xlcx/lscx/query.do" target="_blank" type="success">学信网学历认证</el-link>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</div>
		</el-main>

		<el-dialog :visible.sync="showDetail" title="认证详情" width="700px" @closed="handleAuthRecordClosed">
			<el-table :data="authRecordList" width="100%">
				<el-table-column align="center" label="用户ID" prop="id" width="80"></el-table-column>
				<el-table-column align="center" label="名称" prop="name" width="80"></el-table-column>
				<el-table-column align="center" label="手机号" prop="phone" width="200"></el-table-column>
				<el-table-column align="center" label="认证项目" prop="auth_type_labal"></el-table-column>
				<el-table-column align="center" label="认证时间" prop="create_time" width="180"></el-table-column>
			</el-table>
			<!-- :total="authRecordPagination.total" -->
			<el-pagination
				background
				small
				style="margin: 12px 0 0 0;"
				@current-change="handleAuthRecordChange"
				layout="prev, pager, next"
				:page-count="authRecordPagination.pages"
				:page-size="authRecordPagination.pageSize"
				:current-page="authRecordPagination.page">
			</el-pagination>
		</el-dialog>
		<el-dialog :visible.sync="showEditRemark" size="mini" title="编辑备注" width="300px">
			<el-form>
				<el-form-item label="备注"><el-input autocomplete="off" placeholder="最多50个字符" v-model="editRemark"></el-input></el-form-item>
			</el-form>
			<div class="dialog-footer" slot="footer">
				<el-button @click="submitRemark(0)">取 消</el-button>
				<el-button @click="submitRemark(1)" type="primary">确 定</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import store from '../store';
import { CodeToText } from 'element-china-area-data'; // CodeToText
import { degreeData, checkStatusOptions } from '../data';

export default {
	name: 'Search', // this is the name of the component
	components: {},
	data() {
		return {
			activeTabName: 'first',
			checkStatusOptions: checkStatusOptions,
			idSearchResult: false,
			loading: false,
			store: store,
			sharedState: store.state,
			showResult: false,
			userData: {
				name: '',
				id_confirmed: '',
				household_confirmed: '',
				degree_confirmed: ''
			},
			searchForm: {
				user_min: null,
				user_max: null,
				id_confirmed: '',
				household_confirmed: '',
				degree_confirmed: ''
			},
			resultData: {},
			pageData: {},
			tableData: {},
			// 认证统计列表
			authStateList: [],
			authRecordList: [],
			showDetail: false,
			showEditRemark: false,
			editRemark: null,
			authRecordPagination: {
				total: 0,
				pageSize: 10,
				page: 1,
				pages: 0,
				state: null
			}
		};
	},
	methods: {
		authenticationStatus(key, index, row) {
			// 弹出确认框框
			const thisform = this;
			this.$confirm('是否提交？', '确认信息', {
				distinguishCancelAndClose: true,
				confirmButtonText: '提交',
				cancelButtonText: '取消'
			})
				.then(() => {
					const path = '/admin/users/authenticationState';
					const payload = {
						id: row.id,
						key: key,
						val: row[key]
					};
					console.log(payload);
					thisform.$axios
						.post(path, payload)
						.then(response => {
							thisform.$message.success('操作成功！');
						})
						.catch(error => {
							console.log('error!', error.response);
							thisform.$message.info('操作失败！');
							row[column.property] = !row[column.property];
						});
				})
				.catch
				// action => {
				// this.$message({
				//     type: 'info',
				//     message: action === 'cancel'
				//         ? ''
				//         : '停留在当前页面'
				// })
				// }
				();
		},
		residenceFormat(row, column) {
			var codes = row.residence.split(',');
			for (var i = 0; i < codes.length; i++) {
				codes[i] = CodeToText[codes[i]];
			}
			return codes.join();
		},
		stateFormat(row, column) {
			if (row[column.property] === true) {
				return '通过';
			} else {
				return '未通过';
			}
		},
		degreeFormat(row, column) {
			return degreeData[row.degree];
		},
		checkAdminActive(id) {
			// eslint-disable-next-line no-template-curly-in-string
			const path = `/admin/admins/${id}/active`;
			this.$axios
				.get(path)
				.then(response => {
					if (!response.data.active) {
						this.store.adminLogoutAction();
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
			this.loading = true;
			let page_str = '';
			if (page) {
				page_str = '?page=' + page;
			} else if (this.pageData.page) {
				page_str = '?page=' + this.pageData.page;
			}
			const path = '/admin/users/authenticationSearch' + page_str;
			const payload = {
				user_min: this.searchForm.user_min-1,//用户ID的搜索，现在是从ID号的下一位数字开始搜索，改成从ID号本身开始搜索
				user_max: this.searchForm.user_max,
				id_confirmed: this.searchForm.id_confirmed,
				household_confirmed: this.searchForm.household_confirmed,
				degree_confirmed: this.searchForm.degree_confirmed
			};
			this.$axios
				.post(path, payload)
				.then(response => {
					if (showmessage) {
						if (response.data.users.length === 0) {
							this.$message({
								type: 'info',
								message: '暂无相关结果',
								duration: 1000
							});
						} else {
							/* this.$message({
								type: 'success',
								message: '搜索结果已更新',
								duration: 1000
							}); */
						}
					}
					// 把返回的搜索结果数据渲染到页面
					this.idSearchResult = true;
					this.resultData = response.data.users;
					this.pageData = response.data.pagination;
					this.limitAdminPages();
					this.loading = false;
				})
				.catch(error => {
					// handle error, 400 and 500
					console.log('error!', error.response);
					this.loading = false;
				});
		},
		resetSearchForm() {
			this.$refs['searchForm'].resetFields();
		},
		changeBefore(activeName, oldActiveName) {
			if (activeName === 'third') {
				window.open('https://www.chsi.com.cn/xlcx/lscx/query.do', '_blank');
				return false;
			}
			return true;
		},
		fetchStateList() {
			//    加载认证统计
			let url = '/admin/authenticationStateList';
			let params = {};
			this.$axios.get(url, { params }).then(res => {
				this.authStateList = res.data.data;
			});
		},
		fetchAuthRecordList() {
			let url = '/admin/authenticationDetailList';
			let params = {
				admin: this.authRecordPagination.state.id,
				page: this.authRecordPagination.page
			};
			this.$axios.get(url, { params }).then(res => {
				this.authRecordList = res.data.data;
				this.authRecordPagination.pages = res.data.pages
			});
		},
		handleClick(tab) {
			console.log(tab.name);
			if (tab.name === 'first') {
			} else if (tab.name === 'second') {
				this.fetchStateList();
			} else {
			}
		},
		handlePageChange(page) {
			this.loading = true;
			const path = '/admin/users/authenticationSearch';
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
		detailHandle(index) {
			//    查看详情事件
			this.showDetail = true;
			this.authRecordPagination.state = this.authStateList[index];
			this.fetchAuthRecordList();
		},
		editRemarkHandle(index) {
			this.showEditRemark = true;
			this.editId = this.resultData[index].id;
			this.editRemark = this.resultData[index].remark;
		},
		submitRemark(flag) {
			if (flag) {
				if (this.editRemark && this.editRemark.length > 25) {
					this.$message.error('备注最多50个字符');
					return;
				}

				let data = {
					id: this.editId,
					remark: this.editRemark
				};

				this.$axios.post('/admin/user_set_remark', data).then(res => {
					this.showEditRemark = false;
					this.submitSearchForm();
				});
			} else {
				this.showEditRemark = false;
				this.editRemark = null;
			}
		},
		/**
		 * 认证详情表格分页改变时
		 */
		handleAuthRecordChange (page) {
			this.authRecordPagination.page = page
			this.fetchAuthRecordList()
		},
		/**
		 * 认证详情 dialog 关闭时
		 */
		handleAuthRecordClosed () {
			this.authRecordPagination.page = 1
			this.authRecordPagination.state = null
			this.authRecordPagination.pages = 0
		}
	},
	created() {
		const adminId = this.sharedState.admin_id;
		this.checkAdminActive(adminId);
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
</style>
