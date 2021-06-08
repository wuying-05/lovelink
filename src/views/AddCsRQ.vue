<template>
  <div class="blind" v-loading="loading">
    <div class="content">
      <div class="label"></div>
      <div class="tabs-item1">
        <el-input
          clearable
          v-model="searchText"
          prefix-icon="el-icon-search"
          class="tabs-item1-search"
          placeholder="搜索"
        ></el-input>
        <el-cascader
          class="tabs-item1-cascade"
          v-model="areaValue"
          :options="areaList"
          @change="areaChange"
          clearable
        />
        <el-button @click="searchList" type="primary" style="margin-left: 10px"
          >查询</el-button
        >
        <el-button
          style="margin-left: 30px; margin-right: 30px"
          type="primary"
          @click="newList"
          >新建客服二维码</el-button
        >
        <el-button
          style="margin-left: 0"
          @click="back"
          plain
          icon="el-icon-d-arrow-left"
          >返回</el-button
        >
      </div>
      <div style="max-height: 1300px; overflow: auto; margin-bottom: 30px">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column label="二维码" width="150">
            <template slot-scope="scope">
              <div class="demo-image__lazy">
                <el-image
                  style="
                    width: 100px;
                    height: 100px;
                    text-align: center;
                    line-height: 100px;
                    background: #f5f7fa;
                  "
                  :preview-src-list="qrcodeList"
                  :src="
                    scope.row.rq_code_wx_image_url
                      ? scope.row.rq_code_wx_image_url
                      : scope.row.rq_code_oos_image_url
                  "
                  lazy
                >
                  <div slot="error" class="image-slot">图片未上传</div>
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="级别">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.level === 0
                    ? "区级"
                    : scope.row.level === 1
                    ? "市级"
                    : scope.row.level === 2
                    ? "省级"
                    : scope.row.level === 3
                    ? "国家"
                    : scope.row.level === 4
                    ? "全局"
                    : ""
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="country" label="国家"></el-table-column>
          <el-table-column prop="province" label="省级"></el-table-column>
          <el-table-column prop="city" label="市级/辖区"></el-table-column>
          <el-table-column prop="ad" label="区级"></el-table-column>
          <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.last_time.split(" ")[0] }}</span
              ><br />
              <span>{{ scope.row.last_time.split(" ")[1] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                class="scope-text"
                type="text"
                size="small"
                @click="saveData(scope)"
                >编辑</el-button
              >
              <el-button
                class="scope-text"
                type="text"
                size="small"
                @click="deletData(scope)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :current-page="pageInfo.page"
        :page-sizes="[20, 50, 100]"
        :page-size="pageInfo.per_page"
        :total="pageInfo.count"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="listLimitChange"
        @current-change="listPageChange"
        style="text-align: right"
      ></el-pagination>
    </div>
    <el-dialog
      :visible="add"
      :title="type === 0 ? '新建' : '编辑'"
      :destroy-on-close="true"
      :before-close="addClose"
    >
      <AddCsAreaList
        ref="AddCsAreaList"
        @loadingFlag="loadingFlag"
        @close="addClose"
        @getList="getList"
        :v-if="add"
      />
    </el-dialog>

    <el-dialog
      title="删除客服二维码操作"
      :custom-class="dialog_rqdelete"
      :visible.sync="dialog_rqdelete"
      width="300px"
    >
      <DeleteCsRQ
        :rqid="dialog_rqdelete_id"
        v-if="dialog_rqdelete"
      ></DeleteCsRQ>
    </el-dialog>
  </div>
</template>

<script>
import AddCsAreaList from "./AddCsAreaList";
import location from "../location";
import DeleteCsRQ from "@/views/DeleteCsRQ";

export default {
  name: "AddCsRQ",
  props: {},
  components: {
    AddCsAreaList,
    DeleteCsRQ,
  },
  data() {
    return {
      dialog_rqdelete: false,
      dialog_rqdelete_id: "",
      activeName: "first",
      introduction: "客户通过扫描公众号菜单的客服二维码，即可匹配对应位置客服",
      searchText: "",
      tabsLabel: ["客服二维码"],
      areaValue: [],
      areaList: [],
      tableData: [],
      qrcodeList: [],
      pageInfo: {
        page: 1,
        per_page: 10,
        count: 0,
      },
      area: "",
      add: false,
      type: 0,
      loading: false,
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    listLimitChange(e) {
      this.pageInfo.per_page = e;
      this.getList();
    },
    listPageChange(e) {
      this.pageInfo.page = e;
      this.getList();
    },
    newList() {
      this.type = 0;
      this.add = true;
      this.$nextTick(() => {
        this.$refs.AddCsAreaList.getSelect();
      });
    },
    searchList() {
      if (this.searchText) {
        this.getList(this.searchText);
      } else {
        this.getList(this.area);
      }
    },
    areaChange(value) {
      if (value.length && value[value.length - 1].ad !== "")
        this.area = value[value.length - 1].ad;
      else if (value.length && value[value.length - 1].city !== "")
        this.area = value[value.length - 1].city;
      else if (value.length) this.area = value[value.length - 1].province;
      else this.area = "";
    },
    saveData(e) {
      this.add = true;
      this.$nextTick(() => {
        this.type = 1;
        this.$refs.AddCsAreaList.modify(e.row);
      });
    },
    loadingFlag(flag) {
      this.loading = flag;
    },
    addClose() {
      if (!this.loading) {
        this.add = false;
      }
    },
    deletData(e) {
      this.dialog_rqdelete = true;
      this.dialog_rqdelete_id = e.row.id;

      // this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      // .then(()=>{
      //   this.loading = true
      //   this.$request.post('v1/admin/wxcustomerservice_rqcode_manager/delete',{
      //     type: 'location',
      //     id: e.row.id
      //   })
      //   .then(res=>{
      //     this.loading = false
      //     if(res.data.status){
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功'
      //       })
      //       this.getList()
      //     }else{
      //       this.$message.error('删除失败')
      //     }
      //   })
      //   .catch(()=>{
      //     this.loading = false
      //     this.$message.error('连接错误，请重试')

      //     console.log('error:')
      //   console.log(error)

      //   })
      // })
      // .catch(() => {
      //   this.loading = false
      //   this.$message({ message: "已取消", type: "info" });
      // });
    },
    getList(key) {
      let data = {
        page: this.pageInfo.page,
        per_page: this.pageInfo.per_page,
      };
      this.areaList = location;
      if (key) data.key = key;
      this.loading = true;
      this.$request
        .post("v1/admin/wxcustomerservice_rqcode_manager/page", data)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data;
          this.pageInfo.count = res.data.count;
          for (let item of res.data.data) {
            this.qrcodeList.push(
              item.rq_code_wx_image_url
                ? item.rq_code_wx_image_url
                : item.rq_code_oos_image_url
            );
          }
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error("连接错误，请重试");
        });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style>
.blind .header {
  width: 1160px;
  background: #f5f5f5;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e9eaeb;
  position: relative;
  margin: 0 auto;
}
.blind .header .title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.blind .content {
  width: 1160px;
  margin: 0 auto;
}
.blind .content .label {
  border-bottom: 1px solid #e9eaeb;
}
.blind .content .label .f-title {
  margin-top: 50px;
  margin-bottom: 5px;
}
.blind .content .label .introduction {
  font-size: 14px;
  color: #9facb7;
}
.el-tabs__item.is-active {
  color: #252525 !important;
}
.blind .content .tabs-item1 {
  position: relative;
  margin: 20px 0;
}
.blind .content .tabs-item1 .tabs-item1-search {
  width: 300px;
  margin-right: 30px;
}
.tabs-item1-search .el-input__inner {
  padding-left: 30px !important;
}
.blind .content .tabs-item1 .tabs-item1-cascade {
  width: 300px;
  margin-right: 20px;
}
.blind .content .scope-text {
  display: inline-block;
  margin-right: 15px;
  font-size: 14px;
}

.dialog_rqdelete {
  border-radius: 20px;
}
</style>
