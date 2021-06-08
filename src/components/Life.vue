<template>
	<section>
		<el-row>
			<el-col :offset="1" :span="22">
				<el-card>
					<div slot="header" style="text-align:center;"><span>生活资料</span></div>
					<el-form :inline="true" :model="lifeForm" label-width="100px" ref="lifeForm" style="margin-top:20px;">
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="体重">
									<el-select v-model="lifeForm.weight" class="form-item-input">
										<el-option label="40公斤以下" value="40公斤以下"></el-option>
										<el-option :key="item" :label="item == 0 ? item + '40公斤以下' : item + 39 + '公斤'" :value="item + 39 + '公斤'" v-for="item in 111"></el-option>
										<el-option label="150公斤以上" value="150公斤以上"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="健康状况">
									<el-select v-model="lifeForm.health" class="form-item-input">
										<el-option label="无疾病" value="1"></el-option>
										<el-option label="有遗传疾病" value="2"></el-option>
										<el-option label="有其他疾病" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="是否饮酒">
									<el-select v-model="lifeForm.drink" class="form-item-input">
										<el-option label="不喝酒" value="1"></el-option>
										<el-option label="只有应酬才喝酒" value="2"></el-option>
										<el-option label="偶尔会喝酒" value="3"></el-option>
										<el-option label="经常喝酒" value="4"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="是否吸烟">
									<el-select v-model="lifeForm.smoke" class="form-item-input">
										<el-option label="不吸烟" value="1"></el-option>
										<el-option label="只有应酬才吸烟" value="2"></el-option>
										<el-option label="偶尔吸烟" value="3"></el-option>
										<el-option label="经常吸烟" value="4"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="购车情况">
									<el-select v-model="lifeForm.car" class="form-item-input">
										<el-option label="公司配车" value="1"></el-option>
										<el-option label="未买车" value="2"></el-option>
										<el-option label="已买私人车" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="购房情况">
									<el-select v-model="lifeForm.house" class="form-item-input">
										<el-option label="租房" value="1"></el-option>
										<el-option label="住公司" value="2"></el-option>
										<el-option label="和家人同住" value="3"></el-option>
										<el-option label="已经购房" value="4"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>		
						<el-row>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="有无子女">
									<el-select v-model="lifeForm.children" class="form-item-input">
										<el-option label="没有小孩" value="1"></el-option>
										<el-option label="小孩不住一起" value="2"></el-option>
										<el-option label="小孩住一起" value="3"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :lg="12" :md="12" :sm="24">
								<el-form-item label="宗教信仰">
									<el-select v-model="lifeForm.religion" class="form-item-input">
										<el-option label="无宗教信仰" value="1"></el-option>
										<el-option label="伊斯兰教" value="2"></el-option>
										<el-option label="基督教" value="3"></el-option>
										<el-option label="佛教" value="4"></el-option>
										<el-option label="其他宗教" value="5"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>				
						<div style="text-align: center;">
							<el-button :plain="false" @click="savelifeForm('lifeForm')" type="primary">保存修改</el-button>
							<el-button :plain="false" @click="resetlifeForm()" type="primary">重置</el-button>
						</div>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import store from '../store';
export default {
	name: 'Life',
	data() {
		return {
			sharedState: store.state,
			lifeForm: {
				weight: '',
				children: '',
				religion: '',
				health: '',
				house: '',
				car: '',
				smoke: '',
				drink: ''
			}
		};
	},
	methods: {
		getUser(id) {
			const path = `/users/${id}/profile/life`;
			this.$axios
				.get(path)
				.then(response => {
					this.lifeForm.weight = response.data.shape;
					this.lifeForm.children = response.data.children;
					this.lifeForm.religion = response.data.religion;
					this.lifeForm.health = response.data.health;
					this.lifeForm.house = response.data.house;
					this.lifeForm.car = response.data.car;
					this.lifeForm.smoke = response.data.smoke;
					this.lifeForm.drink = response.data.drink;
					this.copy_lifeForm = JSON.parse(JSON.stringify(this.lifeForm));
				})
				.catch(error => {
					console.error(error);
				});
		},
		savelifeForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					// eslint-disable-next-line camelcase
					const user_id = this.sharedState.user_id;
					// eslint-disable-next-line camelcase
					const path = `/users/${user_id}/profile/life`;
					const payload = {
						shape: this.lifeForm.weight,
						children: this.lifeForm.children,
						house: this.lifeForm.house,
						car: this.lifeForm.car,
						smoke: this.lifeForm.smoke,
						drink: this.lifeForm.drink,
						health: this.lifeForm.health,
						religion: this.lifeForm.religion
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
		resetlifeForm() {
			// 重置表单
			this.lifeForm = JSON.parse(JSON.stringify(this.copy_lifeForm));
		}
	},
	created() {
		// eslint-disable-next-line camelcase
		const user_id = this.sharedState.user_id;
		this.getUser(user_id);
	}
};
</script>

<style scoped>
.form-item-input {
	width: 240px;
}
</style>
