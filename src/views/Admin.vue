<template>
	<el-container class="container">
		<el-main class="container" v-loading="loading" element-loading-text="加载中">
			<el-row>
				<div>
					<span>开通人数:</span>
					<span>{{ open_count }}</span>
				</div>
			</el-row>
			<el-row>
				<el-table :data="tableData" style="width: 100%;font-size:12px;">
					<el-table-column prop="id" label="ID" width="70"></el-table-column>
					<el-table-column prop="name" label="姓名" width="80"></el-table-column>
					<el-table-column prop="gender" label="性别" width="60">
						<template slot-scope="scope">
							{{ scope.row.gender == '1' ? '男士' : '女士' }}
						</template>
					</el-table-column>
					<el-table-column prop="age" label="年龄" width="60"></el-table-column>
					<el-table-column prop="degree" label="学历" width="60">
						<template slot-scope="scope">
							{{ scope.row.degree == '1' ? '大专' : scope.row.degree == '2' ? '本科' : '研究生' }}
						</template>
					</el-table-column>
					<el-table-column prop="residence" label="家乡" width="190">
						<template slot-scope="scope">
							{{ getCity(scope.row.residence) }}
						</template>
					</el-table-column>
					<el-table-column prop="location" label="工作地" width="190">
						<template slot-scope="scope">
							{{ getCity(scope.row.location) }}
						</template>
					</el-table-column>
					<!-- <el-table-column
                        prop="phone"
                        label="手机号">
                    </el-table-column> -->
                    <el-table-column
                        prop="wechat"
                        label="微信号">
                    </el-table-column>
					<el-table-column prop="wechatwork_group" width="100" label="企业微信群">
						<template slot-scope="scope">
							<!-- <div @click="clickshowwechatimg(scope.row.wechatwork_group)" style="color: #ff6767;cursor: pointer;">查看</div> -->
							<img
								style="width: 72px; height: 72px;"
								:src="ossUrl + '/wechatworkgroup/' + scope.row.wechatwork_group" v-if="scope.row.wechatwork_group">
						</template>
					</el-table-column>
					<!-- <el-table-column
                        prop="phone"
                        label="手机号">
                    </el-table-column> -->
					<el-table-column prop="product_name" label="已开套餐名称"  width="220"></el-table-column>
					<el-table-column prop="open_time" label="开通时间"></el-table-column>
					<el-table-column prop="end_time" label="结束时间"></el-table-column>
				</el-table>
				<el-row style="padding:20px 0;" :lg="6" :sm="20" v-if="showPagination">
					<el-pagination
						:hide-on-single-page="true"
						background
						small
						@current-change="getUsers"
						layout="prev, pager, next"
						:page-size="pageData.per_page"
						:page-count="pageData.pages"
					></el-pagination>
				</el-row>
			</el-row>
<!--			<el-card style="margin: 20px 0; padding: 80px 0"></el-card>-->
		</el-main>
		<el-dialog title="企业微信群二维码" :visible.sync="dialog_wechatworkgroup" width="600px" style="text-align:center;">
			<img
				:src="wechatworkgroup_img"
				alt=""
				v-if="dialog_wechatworkgroup"
				style="max-width:300px;max-height:300px"
				v-bind:onerror="'this.src=\'' + ossUrl + '/default-avatar.png\''"
			/>
		</el-dialog>
	</el-container>
</template>

<script>
import store from '../store.js';
import { CodeToText } from 'element-china-area-data';
export default {
	name: 'Admin',
	data() {
		return {
			store: store,
			ossUrl: store.ossUrl,
			sharedState: store.state,
			activeIndex: '2',
			loading: false,
			showPagination: true,
			currentPage: '',
			currentUser: '',
			pageData: {},
			tableData: [],
			open_count: 0,
			wechatworkgroup_img: '',
			dialog_wechatworkgroup: false
		};
	},
	methods: {
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
		getUsers(page = null, showmessage = true) {
			// eslint-disable-next-line no-template-curly-in-string
			this.loading = true;
			let page_str = '';
			if (page) {
				page_str = '?page=' + page;
			} else if (this.pageData.page) {
				page_str = '?page=' + this.pageData.page;
			}
			const path = '/admin/users/vip' + page_str;
			this.$axios
				.get(path)
				.then(response => {
					this.tableData = response.data.users;
					this.pageData = response.data.pagination;
					this.tableData.forEach(element => {
						element.wechatwork_group = element.wechatwork_group;
						element.residence = element.residence.split(',');
						element.location = element.location.split(',');
					});
					if (showmessage) {
						if (response.data.users.length === 0) {
							this.$message.info('暂无相关结果。');
						} else {
							// this.$message.success('列表已更新！');
						}
					}
					this.loading = false;
					this.showPagination = true;
					this.currentPage = 1;
				})
				.catch(error => {
					console.error(error);
					this.loading = false;
					this.showPagination = true;
				});
		},
		get_user_info(id) {
			console.log('拉取用户信息');
			return this.$axios.get('admin/info');
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
		},
		clickshowwechatimg(imgurl) {
			this.dialog_wechatworkgroup = true;
			this.wechatworkgroup_img = imgurl ? imgurl : this.ossUrl + '/default-avatar.png';
		}
	},
	created() {
		if (this.sharedState.is_super_admin) {
			this.$router.push('/admin/super/admin');
		}
		this.getUsers();
		const adminId = this.sharedState.admin_id;
		this.checkAdminActive(adminId);
		this.get_user_info().then(Response => {
			this.open_count = Response.data.open_count;
		});
	}
};
</script>
