<template>
	<el-container>
		<el-main class="container" v-loading="loading" element-loading-text="加载中">
			<el-tabs type="card" v-model="active">
				<el-tab-pane label="推广记录" name="record">
					<QQWXGroupSearch />
				</el-tab-pane>
				<el-tab-pane v-if="sharedState.is_super_admin" label="数据汇总" name="statistics"><QQWXGroupStatistics/></el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script>
	import store from '../store'
	import QQWXGroupSearch from '../components/QQWXGroupSearch'
	import QQWXGroupStatistics from '../components/QQWXGroupStatistics'
	export default {
		name: 'QQWXGroup', // this is the name of the component
		components: {
			QQWXGroupSearch,
			QQWXGroupStatistics
		},
		data() {
			return {
				loading: false,
				sharedState: store.state,
				active: "record"
			}
		},
		methods: {

		},
		created() {

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
