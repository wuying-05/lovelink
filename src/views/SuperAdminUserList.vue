<template>
	<el-container class="container">
		<el-main class="container" v-loading="loading" element-loading-text="加载中">
			<el-row>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="id" label="用户ID" width="80"></el-table-column>
					<el-table-column prop="name" label="姓名" width="100"></el-table-column>
					<el-table-column prop="phone" label="手机号"></el-table-column>
					<el-table-column prop="wechat" label="微信号"></el-table-column>
					<el-table-column prop="wechatwork_group" width="220" label="企业微信群">
						<template slot-scope="scope">
							<img style="max-width: 200px" :src="ossUrl + '/wechatworkgroup/' + scope.row.wechatwork_group" v-if="scope.row.wechatwork_group" />
						</template>
					</el-table-column>
					<el-table-column prop="pay_admin_name" label=""></el-table-column>
					<el-table-column prop="create_time" label="开通时间"></el-table-column>
					<el-table-column prop="end_time" label="结束时间"></el-table-column>
					<el-table-column prop="product_name" label="已开套餐名称" width="220"></el-table-column>
				</el-table>
				<el-row style="padding:20px 0;" :lg="6" :sm="20" v-if="showPagination">
					<el-pagination
						:hide-on-single-page="true"
						background
						small
						@current-change="handlePageChange"
						layout="prev, pager, next"
						:page-size="pageData.per_page"
						:page-count="pageData.pages"
					></el-pagination>
				</el-row>
			</el-row>
<!--			<el-card style="margin: 20px 0; padding: 80px 0">套餐简介和其他文字信息</el-card>-->
		</el-main>
	</el-container>
</template>

<script>
import store from '../store.js';
export default {
	name: 'Admin',
	data() {
		return {
			sharedState: store.state,
			activeIndex: '2',
			loading: false,
			showPagination: true,
			currentPage: '',
			currentUser: '',
			pageData: {},
			tableData: [],
			ossUrl: store.ossUrl
		};
	},
	methods: {
		getUsers() {
			// eslint-disable-next-line no-template-curly-in-string
			this.loading = true;
			const path = '/admin/users';
			this.$axios
				.get(path)
				.then(response => {
					this.tableData = response.data.users;
					console.log(response.data);
					this.pageData = response.data.pagination;
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
		handlePageChange(page) {
			this.loading = true;
			this.currentPage = page;
			this.$axios
				.get(this.pageData.base_url + '?page=' + page)
				// eslint-disable-next-line no-unused-vars
				.then(response => {
					// 把返回的结果数据渲染到页面
					this.tableData = response.data.users;
					this.pageData = response.data.pagination;
					if (response.data.users.length === 0) {
						// this.$message.info('暂无相关结果。');
					}
					window.scrollTo(0, 0);
					this.loading = false;
					this.showPagination = true;
				})
				.catch(error => {
					// handle error, 400 and 500
					console.log('error!', error.response);
					this.loading = false;
					this.showPagination = true;
				});
		}
	},
	created() {
		if (!this.sharedState.is_super_admin) {
			this.$router.push('/admin/vip');
		}
		this.getUsers();
	}
};
</script>
