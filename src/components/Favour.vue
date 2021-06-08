<template>
	<section>
		<el-row>
			<el-col :offset="1" :span="22">
				<el-card>
					<div slot="header" style="text-align:center"><span>择偶意向</span></div>
					<el-form :model="favourForm" label-width="100px" ref="favourForm" style="margin-top:16px">
						<el-row>
							<el-col :span="24" :lg="12" :md="12" :sm="24">
								<el-form-item label="年龄">
									<el-col :span="11">
										<el-select v-model="favourForm.startAge">
											<el-option label="不限" value=""></el-option>
											<el-option :key="item" :label="item + 21 + '岁'" :value="item + 21" v-for="item in 48"></el-option>
										</el-select>
									</el-col>
									<el-col class="line" :span="2" style="text-align:center;">到</el-col>
									<el-col :span="11">
										<el-select v-model="favourForm.endAge">
											<el-option label="不限" value=""></el-option>
											<el-option :key="item" :label="item + 22 + '岁'" :value="item + 22" v-for="item in 48"></el-option>
										</el-select>
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :span="24" :lg="12" :md="12" :sm="24">
								<el-form-item label="身高">
									<el-col :span="11">
										<el-select v-model="favourForm.startHeight">
											<el-option label="不限" value=""></el-option>
											<el-option :key="item" :label="item + 129 + '厘米'" :value="item + 129" v-for="item in 98"></el-option>
										</el-select>
									</el-col>
									<el-col class="line" :span="2" style="text-align:center">到</el-col>
									<el-col :span="11">
										<el-select v-model="favourForm.endHeight">
											<el-option label="不限" value=""></el-option>
											<el-option :key="item" :label="item + 129 + ' 厘米'" :value="item + 129" v-for="item in 98"></el-option>
										</el-select>
									</el-col>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="婚姻状况">
									<el-select v-model="favourForm.marriage">
										<el-option label="不限" value=""></el-option>
										<el-option label="未婚" value="1"></el-option>
										<!-- <el-option label="丧偶" value="2"></el-option> -->
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="最低学历">
									<el-select v-model="favourForm.degree">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in degreeOptions"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="何时结婚">
									<el-select v-model="favourForm.whenMarry">
										<el-option label="一年内结婚" value="1"></el-option>
										<el-option label="1-3年结婚" value="2"></el-option>
										<el-option label="3-5年结婚" value="3"></el-option>
										<el-option label="5年以后结婚" value="4"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="月薪">
									<el-select v-model="favourForm.salary">
										<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in salaryOptions"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="购车情况">
									<el-select v-model="favourForm.car">
										<el-option label="不限" value=""></el-option>
										<el-option label="已购车" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="购房情况">
									<el-select v-model="favourForm.house">
										<el-option label="不限" value=""></el-option>
										<el-option label="已购房" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="是否带小孩">
									<el-select v-model="favourForm.children">
										<el-option label="没有小孩" value="1"></el-option>
										<el-option label="小孩不住一起" value="2"></el-option>
										<el-option label="小孩住一起" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row style="text-align: center">
							<el-button :plain="false" @click="saveFavourForm('favourForm')" type="primary">保存修改</el-button>
							<el-button :plain="false" @click="resetFavourForm('favourForm')" type="primary">重置</el-button>
						</el-row>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import { regionData } from 'element-china-area-data';
import { salaryOptions, degreeOptions } from '../data';
import store from '../store';	
export default {
	name: 'Favour',
	data() {
		return {
			sharedState: store.state,
			cityOptions: regionData,
			salaryOptions: salaryOptions,
			degreeOptions: degreeOptions,
			favourForm: {
				startAge: '',
				endAge: '',
				startHeight: '',
				endHeight: '',
				salary: '',
				degree: '',
				location: [],
				residence: [],
				house: '',
				car: '',
				marriage: '',
				children: '',
				drink: '',
				smoke: '',
				picture: '',
				whenMarry: ''
			}
		};
	},
	methods: {
		getUser(id) {
			const path = `/users/${id}/profile/favour`;
			this.$axios
				.get(path)
				.then(response => {
					this.favourForm.startAge =  parseInt(response.data.startAge) || '';
					this.favourForm.endAge = parseInt(response.data.endAge) || '';
					this.favourForm.startHeight = parseInt(response.data.startHeight) || '';
					this.favourForm.endHeight = parseInt(response.data.endHeight) || '';
					this.favourForm.salary = response.data.salary || '';
					this.favourForm.degree = response.data.degree || '';
					this.favourForm.house = response.data.house || '';
					this.favourForm.car = response.data.car || '';
					this.favourForm.marriage = response.data.marriage || '';
					if (response.data.residence !== null) {
						this.favourForm.residence = response.data.residence.split(',');
					}
					if (response.data.location !== null) {
						this.favourForm.location = response.data.location.split(',');
					}
					this.favourForm.children = response.data.children || '';
					this.favourForm.drink = response.data.drink || '';
					this.favourForm.smoke = response.data.smoke || '';
					this.favourForm.picture = response.data.picture || '';
					this.favourForm.whenMarry = response.data.whenMarry || '';
					this.copy_FavourForm = JSON.parse(JSON.stringify(this.favourForm));
				})
				.catch(error => {
					console.error(error);
				});
		},
		saveFavourForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// eslint-disable-next-line camelcase
					const user_id = this.sharedState.user_id;
					// eslint-disable-next-line camelcase
					const path = `/users/${user_id}/profile/favour`;
					const payload = {
						startAge: this.favourForm.startAge,
						endAge: this.favourForm.endAge,
						startHeight: this.favourForm.startHeight,
						endHeight: this.favourForm.endHeight,
						salary: this.favourForm.salary,
						degree: this.favourForm.degree,
						house: this.favourForm.house,
						car: this.favourForm.car,
						marriage: this.favourForm.marriage,
						residence: this.favourForm.residence.toString(),
						location: this.favourForm.location.toString(),
						children: this.favourForm.children,
						drink: this.favourForm.drink,
						smoke: this.favourForm.smoke,
						picture: this.favourForm.picture,
						whenMarry: this.favourForm.whenMarry
					};
					this.$axios
						.put(path, payload)
						// eslint-disable-next-line no-unused-vars
						.then(response => {
							// handle success
							this.$message({
								message: '资料已更新！',
								type: 'success'
							});
							this.$router.push({
								name: 'Profile',
								params: { id: user_id }
							});
						})
						.catch(error => {
							// handle error, 400 and 500
							console.log('error!', error.response);
						});
				}
			});
		},
		resetFavourForm() {
			// 重置表单
			this.favourForm = JSON.parse(JSON.stringify(this.copy_FavourForm));
		}
	},
	created() {
		// eslint-disable-next-line camelcase
		const user_id = this.sharedState.user_id;
		this.getUser(user_id);
	}
};
</script>
<style>
	.el-card__body{
		padding: 10px !important;
	}
	.el-main{
		padding: 0!important;
	}
	.el-input__inner{
		padding: 0 5px !important;
	}
</style>
