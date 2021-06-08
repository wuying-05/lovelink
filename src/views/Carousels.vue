<template>
    <el-container class="carousels_page">
        <el-main class="container" v-loading="loading" element-loading-text="加载中">
        <el-row>
        <el-upload
            class="upload-demo"
            drag
            :headers="uploadHeaders"
            :action="imgUploadUrl"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
        </el-row>
        <el-row>
            <el-col :xs="23" :sm="7" :md="7" :lg="5" :xl="5" v-for="(item) in resdata.data" :key="item.id" style="margin-bottom: 15px;margin-left: 2.08%;margin-right: 2.08%;">
                <el-card :body-style="{ padding: '0px' }">
                <div style="background: #ccc;height:200px;display:flex;align-items: center;justify-content: center;cursor: pointer;" @click="handlePictureCardPreview(item)">
                    <img :src="ossUrl+'/carousels/'+item.photo_url" class="image" style="max-height:200px;max-width:100%;">
                </div>
                <div style="padding: 14px;">
                    <div>
                        <!-- <el-select v-model="item.province_display" filterable placeholder="请选择区域" size="small" style="width:200px;" @change="editprovincebanaer(item)">
                            <el-option
                            v-for="item in areaoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> -->
                        <el-cascader
                            :options="cityOptions"
                            size="small"
                            v-model="item.regionData"
                            placeholder="请选择区域"
                            style="width: 200px;"
                            @change="editprovincebanaer(item)"></el-cascader>
                    </div>
                    <div>
                        <span style="font-size:12px;">是否生效：</span>
                        <el-switch  @change="editactivebanaer(item)"
                            v-model="item.is_active"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </div>
                    <div class="bottom clearfix">
                    <time class="time">{{ item.create_time }}</time>
                    <el-button type="text" class="button" @click="removebanner(item)">删除</el-button>
                    </div>
                </div>
                </el-card>
            </el-col>
        </el-row>
            <el-row :lg="6" :sm="20" style="padding:20px 0;">
                <el-pagination
                        :current-page="resdata.page"
                        :hide-on-single-page=true
                        :page-count="resdata.pages"
                        :size="resdata.per_page"
                        @current-change="get_resdata"
                        background
                        layout="prev, pager, next"
                        small>
                </el-pagination>
            </el-row>
            <el-button type="primary" @click="$router.push('/admin/AddGroupChat')">客户群二维码管理</el-button>
            <el-button type="primary" @click="$router.push('/admin/AddCsRQ')">客服二维码管理</el-button>
        </el-main>
        <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </el-container>
</template>

<style>
.carousels_page .upload-demo{
    width: 100%;
    margin-bottom: 15px;
}
.carousels_page .el-upload{
    width:100%;
}
.carousels_page .el-upload-dragger{
    width:100% !important;
}
 .carousels_page  .time {
    font-size: 13px;
    color: #999;
  }
  
 .carousels_page  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .carousels_page  .button {
    float: right;
    margin: 0 !important;
    padding: 0 !important;
  }

 .carousels_page  .clearfix:before,
   .carousels_page .clearfix:after {
      display: table;
      content: "";
  }
  
 .carousels_page  .clearfix:after {
      clear: both
  }
</style>

<script>
import store from '../store'
import { provinceAndCityDataPlus } from 'element-china-area-data';

// const token = localStorage.getItem('admin-token')//在QQ浏览器里面这句话不执行

export default {
    name: 'Carousels', // this is the name of the component
    components: {  },
    data () {
        return {
            loading: false,
            sharedState: store.state,
            ossUrl: store.ossUrl,
			cityOptions: provinceAndCityDataPlus,
            resdata: {},
            uploadHeaders: { Authorization: `Bearer ${localStorage.getItem('admin-token')}` },
            imgUploadUrl: this.$axios.defaults.baseURL + `/admin/carousels/upload`,
            areaoptions: [],
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    methods: {
        get_resdata(page=null){
            const thisform = this;
            thisform.loading = true
            let page_str='';
            if(page){
                page_str = '?page='+page;
            }else if(thisform.resdata.page){
                page_str = '?page='+thisform.resdata.page;
            }
            thisform.$axios.get("/admin/carousels/page"+ page_str).then((res)=>{
                res.data.data.forEach(element => {
                    element.province_display = element.province_name;
                    element.regionData = element.province ? element.province.split(',') : [];
                });
                thisform.resdata = res.data;
                thisform.loading = false;
            })
        },
        removebanner(item){
            this.$confirm("删除后无法恢复").then(()=>{
                this.$axios.delete("/admin/carousels/delete/"+item.id).then(()=>{
                    this.$message.success("删除成功");
                    this.get_resdata();
                })
            })
        },
        editprovincebanaer(item){
            // item.province = item.province_display;
            item.province = item.regionData.join(',');
            this.$axios.post("/admin/carousels/update", item).then(()=>{
            })
        },
        editactivebanaer(item){
            this.$axios.post("/admin/carousels/update", item).then(()=>{
            })
        },
        handlePictureCardPreview(item) {
            this.dialogImageUrl = this.ossUrl+'/carousels/'+item.photo_url;
            this.dialogVisible = true;
        }
    },
    created () {
        this.$axios.get("/admin/areas/list").then((res)=>{
            this.areaoptions = res.data;
        })
        this.get_resdata(); 
    }
}
</script>
