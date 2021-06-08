/* eslint-disable no-unused-vars */
<template>
    <el-container>
        <el-main class="editMain" v-loading="loading">
            <el-row style="margin-top: 38px;">
                <el-tabs :tab-position="tabPosition" v-model="activeTab">
                    <!-- <el-tab-pane label="会员套餐" name="member">
                        <Member/>
                    </el-tab-pane> -->
                    <el-tab-pane label="设置推荐条件" name="recommend">
                        <RecommendOption :changeActiveTab="changeActiveTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="设置可见条件">
                        <WxPrivicy/>
                    </el-tab-pane>
                    <el-tab-pane label="修改密码">
                        <ChangePassword/>
                    </el-tab-pane>
                    <el-tab-pane label="修改手机号">
                        <ChangePhone/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import Member from '../components/Member'
import ChangePassword from '../components/ChangePassword'
import ChangePhone from '../components/ChangePhone'
import WxPrivicy from '../components/WxPrivicy'
import RecommendOption from '../components/RecommendOption'
import store from '../store'
import {checkStatus} from '../data'
// var token = localStorage.getItem('dating-token')//在QQ浏览器里面这句话不执行
export default {
    name: 'Setting',
    components: { Member, ChangePassword, ChangePhone, RecommendOption,WxPrivicy },
    data () {
        return {
            checkStatus:checkStatus,
            loading: false,
            qrDialogVisible: false,
            householdDialogVisible: false,
            degreeDialogVisible: false,
            activeTab: 'recommend',
            qrImage: '',
            tabPosition: 'left',
            sharedState: store.state,
            userData: {
                id: '',
                householdImageUploaded: '',
                degreeImageUploaded: '',
                id_confirmed: '',
                household_confirmed: '',
                degree_confirmed: ''
            },
            // fileList: [],
            householdUploadUrl: this.$axios.defaults.baseURL + `/users/${store.state.user_id}/uploads/household`,
            degreeUploadUrl: this.$axios.defaults.baseURL + `/users/${store.state.user_id}/uploads/degree`,
            uploadHeaders: { Authorization: `Bearer ${localStorage.getItem('dating-token')}` }
        }
    },
    methods: {
        getUser (id) {
            const path = `/users/${id}`
            this.$axios
                .get(path)
                .then(response => {
                    this.userData.id_confirmed = response.data.id_confirmed
                    this.userData.household_confirmed = response.data.household_confirmed
                    this.userData.degree_confirmed = response.data.degree_confirmed
                    this.userData.householdImageUploaded = response.data.household_image_uploaded
                    this.userData.degreeImageUploaded = response.data.degree_image_uploaded
                    this.userData.id = response.data.id
                })
                .catch(error => {
                    console.error(error)
                })
        },uploadDegree(){
            if(this.userData.degree_confirmed==2)
                this.$message.success('已认证通过')
            else if(this.userData.degree_confirmed==1)
                this.$message.success('已上传，请等待管理员审核')
            else
                this.degreeDialogVisible = true;
        },uploadHousehold(){
            if(this.userData.household_confirmed==2)
                this.$message.success('已认证通过')
            else if(this.userData.household_confirmed==1)
                this.$message.success('已上传，请等待管理员审核')
            else this.householdDialogVisible = true;
        },startVerify () {
            this.loading = true
            const id = this.sharedState.user_id
            const path = `/users/${id}/setting/verify/start`
            this.$axios
                .get(path)
                .then(response => {
                    this.loading = false
                    if(response.data.code==0){
                        this.qrImage = response.data.data.qrcode_url
                        this.qrDialogVisible = true
                    }                    
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
                })
        },
        uploadImage (type) { // 暂未使用
            const id = this.sharedState.user_id
            var path = ''
            if (type === 'household') {
                path = `/users/${id}/uploads/household`
            } else {
                path = `/users/${id}/uploads/degree`
            }
            const formData = new FormData()
            formData.append('file', this.fileList[0].raw)
            this.$axios
                .post(path,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: function (progressEvent) {
                            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                        }.bind(this)
                    })
                .then(response => {
                })
                .catch(error => {
                    console.error(error)
                })
        },
        handleUploadSuccess (res, file,type) {
            this.$message.success('上传成功！请等待管理员审核。')
            this.householdDialogVisible = false
            this.degreeDialogVisible = false
            if(type=='household'){
                this.userData.household_confirmed = 1
            }else if(type=='degree'){
                this.userData.degree_confirmed = 1
                console.log(this.userData.degree_confirmed)
            }
        },
        handleUploadError (err, file) {
            this.$message.error('上传失败，请稍后重试。')
            console.log(err)
            this.householdDialogVisible = false
            this.degreeDialogVisible = false
        },beforeHouseholdUpload (file) {
            const isLt2M = file.size / 1024 / 1024 < 2
            
            if(this.userData.household_confirmed==1){
                this.$message.error('您已上传过图片，请等待管理员审核!')
                return false
            }else if(this.userData.household_confirmed==2){
                this.$message.error('您已审核通过，无需上传')
                return false
            }
            
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
            }
            return isLt2M
        },beforeDegreeUpload (file) {
            const isLt2M = file.size / 1024 / 1024 < 2
            if(this.userData.degree_confirmed==1){
                this.$message.error('您已上传过图片，请等待管理员审核!')
                return false
            }else if(this.userData.degree_confirmed==2){
                this.$message.error('您已审核通过，无需上传')
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
            }
            return isLt2M
        },isMobile () {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true
            } else {
                return false
            }
        },
        changeActiveTab (name) {
            this.activeTab = name
        }
    },
    created () {
        // eslint-disable-next-line camelcase
        const user_id = this.sharedState.user_id
        this.getUser(user_id)
        const hash = this.$route.hash.substr(1)

        if (this.isMobile()) {
            this.tabPosition = 'top'
        }
    }
}
</script>

<style scoped>
.editMain {
    max-width: 1160px;
    margin: 0 auto;
}

.dialog {
    max-width: 400px
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 20px;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
