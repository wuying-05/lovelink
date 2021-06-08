<template>
<div style="position: relative;" v-loading="loading">
  <el-form ref="from" :model="dataForm" :rules="rules">
    <el-form-item label="二维码地址" label-width="120px">
      <el-input v-model="dataForm.rq_code_wx_image_url" placeholder="请输入二维码URL地址"></el-input>
    </el-form-item>
    <el-form-item label="二维码上传" label-width="120px">
      <el-upload
        class="upload-demo"
        :action="upURL"
        :before-remove="beforeRemove"
        :on-success='uploadSuccess'
        :on-error="uploadError"
        :limit="1"
        :headers='headers'
        :on-exceed='handleExceed'
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-checkbox-group v-model="checkList" :max='1' @change="levelChange">
        <el-checkbox label="区级"></el-checkbox>
        <el-checkbox label="市级"></el-checkbox>
        <el-checkbox label="省级默认"></el-checkbox>
        <el-checkbox label="国家默认"></el-checkbox>
        <el-checkbox label="最高默认"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="选择国家" label-width="120px">
        <el-select v-model="dataForm.country" @change="selectChange" placeholder="请选择">
          <el-option label="中国" value="CN"></el-option>
          <el-option label="海外" value="海外"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="设置地址" label-width="120px" style="position: relative;">
       <el-cascader
        @visible-change="open"
       :class=" flag ? 'cascader opacity-0' : 'cascader'"
        v-model="areaValue"
        ref='areaBar'
        :options="areaList"
        @change="areaChange"
        :disabled='cascaderDisabled'
        />
        <el-input v-if="flag" :suffix-icon="cascaderOpen?'el-icon-arrow-down':'el-icon-arrow-up'" class="area-default" v-model="areaDefault" placeholder=""></el-input>
    </el-form-item>
    <el-form-item style="text-align:right; margin-top:240px;">
      <el-button type="primary" @click="verification">确认</el-button>
    </el-form-item>
  </el-form>
    <div class="preview">
      <el-image style="width: 240px; height: 240px;line-height: 240px;background:#f5f7fa;" :src="dataForm.rq_code_wx_image_url?dataForm.rq_code_wx_image_url:dataForm.rq_code_oos_image_url">
        <div slot="error" class="image-slot">
          图片未上传
        </div>
      </el-image>
      <p>二维码预览</p>
    </div>
  </div>
</template>

<script>
import location from '../location'

let token = window.localStorage.getItem('admin-token')

export default {
  data() {
    return {
      dataForm: {
        type: 'location',
        status: 'add',
        level: 1,
        cityid: '',
        adcode: '',
        country: '',
        province: '',
        city: '',
        ad: '',
        rq_code_oos_image_url: '',
        rq_code_wx_image_url: '',
      },
      loading: false,
      areaValue: [],
      fileList: [],
      rules: {
      },
      checkList: ['市级'],
      areaList: [],
      upURL: 'https://lovelink.net.cn/v1/admin/wxgroup_rqcode_manager/upload',
      modifyCity: '',
      areaDefault: '',
      flag: true,
      cascaderOpen: true,
      modifyFlag: false,
      cascaderDisabled: false,
      token: token
    };
  },
  computed: {
    headers() { 
      return { Authorization: `Bearer ${this.token}` }
    }
  },
  methods: {
    verification(){
      if(this.dataForm.ad !== ''){
        this.dataForm.level = 0
        this.checkList.splice(0,1,'区级')
        if(this.dataForm.city === '' || this.dataForm.province === '' || this.dataForm.country === ''){
          return this.$message.error('请选择国家并设置地址')
        }
      }else if(this.dataForm.city !== '' && this.dataForm.city.indexOf(this.dataForm.province) === -1){
        this.dataForm.level = 1
        this.checkList.splice(0,1,'市级')
        if(this.dataForm.province === '' || this.dataForm.country === ''){
          return this.$message.error('请选择国家并设置地址')
        }
      }else if(this.dataForm.city !== '' && this.dataForm.city.indexOf(this.dataForm.province) !== -1){
        this.dataForm.level = 2
        this.checkList.splice(0,1,'省级默认')
        if(this.dataForm.country === ''){
          return this.$message.error('请选择国家并设置地址')
        }
      }else if(this.dataForm.city === '' && this.dataForm.province !== ''){
        this.dataForm.level = 2
        this.checkList.splice(0,1,'省级默认')
        if(this.dataForm.country === ''){
          return this.$message.error('请选择国家并设置地址')
        }
      }else if(this.dataForm.country !== '' && this.dataForm.province === ''){
        this.dataForm.level = 3
        this.checkList.splice(0,1,'国家默认')
        if(this.dataForm.country === ''){
          return this.$message.error('请选择国家')
        }
      }else if(this.dataForm.country === ''){
        this.dataForm.level = 4
        this.checkList.splice(0,1,'最高默认')
      }
      if(this.dataForm.rq_code_oos_image_url === '' && this.dataForm.rq_code_wx_image_url === ''){
        return this.$message.error('请填写二维码地址')
      }
      this.$emit('loadingFlag',true)
      this.$refs.from.validate(valid =>{
          if(!valid) return
          this.loading = true
          this.$request.post('v1/admin/wxgroup_rqcode_manager/add',this.dataForm)
          .then(res=>{
            this.loading = false
            if(res.data.status){
              this.modifyFlag? this.$message({type: 'success',message:'修改成功'}) : this.$message({type: 'success',message: '添加成功'})
              this.$emit('loadingFlag',false)
              this.$emit('close')
              this.$emit('getList')
            }else {
              this.$emit('loadingFlag',false)
              if(res.data.msg.indexOf('url')) return this.$message.error(res.data.msg)
              this.$message.error('添加失败')
            }
          })
          .catch(()=>{
            this.$emit('loadingFlag',false)
            this.loading = false
            this.$message.error('连接错误，请重试')
          })
      })
    },
    open(){
      this.cascaderOpen = false
    },
    modify(e){
      this.getSelect()
      this.dataForm = e
      this.dataForm.type = 'location'
      this.dataForm.status = 'edit'
      switch(this.dataForm.level){
        case 0:
          this.checkList.splice(0,1,'区级')
          break;
        case 1:
          this.checkList.splice(0,1,'市级')
          break;
        case 2:
          this.checkList.splice(0,1,'省级默认')
          break;
        case 3:
          this.checkList.splice(0,1,'国家默认')
          break;
        case 4:
          this.checkList.splice(0,1,'最高默认')
          break;
      }
      this.flag = true
      if(this.dataForm.province && this.dataForm.city && this.dataForm.ad) {
        this.areaDefault = this.dataForm.province + '/' + this.dataForm.city + '/' + this.dataForm.ad
      }else if(this.dataForm.province && this.dataForm.city) {
        this.areaDefault = this.dataForm.province + '/' + this.dataForm.city
      }else if(this.dataForm.province) {
        this.areaDefault = this.dataForm.province
      }else {
        this.flag = false
      }
      if(this.dataForm.country === '海外'){
        this.cascaderDisabled = true
        this.areaDefault = ''
        this.areaValue = []
      }else{
        this.cascaderDisabled = false
      }
      this.modifyFlag = true
    },
    areaChange(e){
      let eList = [...e]
      let element = e[e.length - 1]
      let len = eList.length - 1
      if(eList[len].ad === '' && eList[len].city.indexOf(eList[len].province) !== -1){
        eList.length = 1
      }else if(eList[len].ad !== ''){
        eList.length = 3
      }else if(eList[len].city === '' && eList[len].city.indexOf(eList[len].province) === -1){
        eList.length = 1
      }else if(eList[len].city !== ''){
        eList.length = 2
      }
      switch(eList.length){
        case 1:
          this.checkList.splice(0,1,'省级默认')
          this.dataForm.level = 2
          break;
        case 2:
          this.checkList.splice(0,1,'市级')
          this.dataForm.level = 1
          break;
        case 3:
          this.checkList.splice(0,1,'区级')
          this.dataForm.level = 0
          break;
      }
      this.dataForm.adcode = element.adcode
      this.dataForm.province = element.province
      this.dataForm.city = element.city
      this.dataForm.cityid = element.citycode
      this.dataForm.ad = element.ad
      this.flag = false
    },
    selectChange(e){
      if(e === '海外'){
        this.cascaderDisabled = true
        this.areaValue = []
        let key = ['city','cityid','adcode','province','ad']
        for(let item of key){
          this.dataForm[item] = ''
        }
      } else {
        this.cascaderDisabled = false
      }
      this.dataForm.country = e
    },
    levelChange(value) {
      switch(value[0]){
        case '区级':
          this.dataForm.level = 0
          break;
        case '省级默认': 
          this.dataForm.level = 2
          break;
        case '国家默认':
          this.dataForm.level = 3
          break;
        case '最高默认': 
          this.dataForm.level = 4
          break;
        default :
          this.dataForm.level = 1
          break;
      }
    },
    getSelect(){
      this.areaList = location
      this.flag = false
      this.modifyFlag = false
    },
    uploadSuccess(response) {
      this.dataForm.rq_code_oos_image_url = 'https://ailianwang.oss-cn-beijing.aliyuncs.com/' + response.url
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    uploadError(){
       this.$message.warning('上传失败');
    }
  }
}
</script>
<style scoped>
  .preview{
    position: absolute;
    right: 5%;
    top: 45%;
    height: 100px;
    text-align: center;
  }
  .area-default{
    position: absolute;
    left: 0;
    top: 0;
    width: 218px;
  }
  .cascader{
    position: relative;
    width: 218px;
    z-index: 9;
  }
  .opacity-0 {
    opacity: 0;
  }
</style>