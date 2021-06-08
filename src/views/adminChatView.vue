<template>
  <!-- 企业微信数据 -->
  <el-container class="container">
    <el-main
      class="container"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <div class="tabs">
        <div class="tab" :class="{ active: stab == 1 }" @click="selectTab(1)">
          客户列表
        </div>
        <div class="tab" :class="{ active: stab == 2 }" @click="selectTab(2)">
          客户群
        </div>
        <!-- <div class="tab" :class="{ active: stab == 3 }" @click="selectTab(3)"> 客户分配 </div> -->
      </div>
      <h3 v-show="stab == 1">客户列表</h3>
      <el-table :data="tableData" style="width: 100%" v-show="stab == 1">
        <el-table-column prop="external_contact.name" label="姓名">
        </el-table-column>
        <el-table-column prop="external_contact.position" label="职位">
        </el-table-column>
        <el-table-column prop="external_contact.corp_full_name" label="公司">
        </el-table-column>
        <el-table-column prop="follow_info.remark" label="关注人">
        </el-table-column>
        <el-table-column prop="follow_info.description" label="描述">
        </el-table-column>
        <el-table-column
          prop="follow_info.remark_corp_name"
          label="公司备注信息"
        >
        </el-table-column>
      </el-table>
      <div class="sg-page" v-show="stab == 1">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page.sync="currentPage1"
          :page-size.sync="pageSize1"
          :page-sizes="pageSizes"
          layout=" sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>

      <h3 v-show="stab == 2">客户群</h3>
      <el-table :data="tableData2" style="width: 100%" v-show="stab == 2">
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="create_time" label="日期"> </el-table-column>
        <el-table-column prop="owner" label="所属者"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column label="客户分配" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click.stop="btnCustomAssign(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="sg-page" v-show="stab == 2">
        <el-pagination
          @size-change="handleCurrentChange2(0)"
          @current-change="handleCurrentChange2"
          :current-page.sync="currentPage2"
          :page-size.sync="pageSize2"
          :page-sizes="pageSizes"
          layout=" sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>

      <h3 v-show="stab == 3">客户分配</h3>
      <el-table :data="tableData3" style="width: 100%" v-show="stab == 3">
        <el-table-column prop="handover_userid" label="移交用户ID">
        </el-table-column>
        <el-table-column prop="external_userid" label="外部用户ID">
        </el-table-column>
        <el-table-column prop="dimission_time" label="日期"> </el-table-column>
      </el-table>
      <div class="sg-page" v-show="stab == 3">
        <el-pagination
          @size-change="handleCurrentChange3(0)"
          @current-change="handleCurrentChange3"
          :current-page.sync="currentPage3"
          :page-size.sync="pageSize3"
          :page-sizes="pageSizes"
          layout=" sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </el-main>
    <el-dialog
      title="客户分配"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <el-table :data="tableData_custom_assign" style="width: 100%">
        <el-table-column prop="userid" label="用户ID" width="220">
        </el-table-column>
        <el-table-column prop="type" label="类型"  width="120">
          <template slot-scope="scope">
            {{ ["未知类型", "企业成员", "外部联系人", "其他类型"][scope.row.type || 0] }}
          </template>
        </el-table-column>
        <el-table-column prop="join_time" label="入群时间" width="220">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            {{
              new Date(scope.row.join_time*1000).toLocaleString("zh-Hans-CN", {year: "numeric", month: "short", day: "numeric", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit"}).replace(/\//g, "-")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="join_scene" label="入群方式" width="200">
          <template slot-scope="scope">
            <el-tag size="medium">{{
              ["未知方式", "直接邀请", "通过邀请链接", "扫描二维码入群"][
                scope.row.join_scene || 0
              ]
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="dialogVisible = false">我知道了</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      tableData_custom_assign: [],
      dialogVisible: false,
      userid: "lovelink",
      // ----------------------------------------
      // pageSizes: [20, 50, 100],
      pageSizes: [100],
      //客户列表
      currentPage1: 1,
      pageSize1: 20,
      cursor1: null,
      //客户群
      currentPage2: 1,
      pageSize2: 20,
      cursor2: null,
      //客户分配
      currentPage3: 1,
      pageSize3: 20,
      cursor3: null,
      // ----------------------------------------

      stab: 1,
      loading: false,
      userList: [],
      tableData: [
        {
          external_userid: "00000",
        },
      ],
      tableData2: [
        {
          name: "",
        },
      ],
      tableData3: [
        {
          id: "",
        },
      ],
    };
  },
  methods: {
    btnCustomAssign(d) {
      this.tableData_custom_assign = d.member_list;
      this.dialogVisible = true;
      // console.log(d);
    },
    selectTab(tab) {
      this.stab = tab;
    },
    // 获取userid列表
    getUserIds() {
      this.loading = true;
      const path =
        this.$axios.defaults.baseURL + "/externalcontact/follow_list";
      this.$axios.get(path, {}).then((res) => {
        this.__getAllUserList(
          res.data.follow_user,
          (data) => ((this.userList = data), this.handleCurrentChange1())
        );
      });
    },
    //递归获取所有客户列表
    __getAllUserList(arr, callback) {
      var re = [];
      var __r = (index = 0) => {
        const path =
          this.$axios.defaults.baseURL + "/externalcontact/batch/get_by_user";
        this.$axios
          .post(path, {
            userid: arr[index],
            offset: 0,
            limit: 999999,
            cursor: null,
          })
          .then((res) => {
            re = re.concat(res.data.external_contact_list);
            index++;
            index < arr.length ? __r(index) : callback && callback(re);
          });
      };
      __r();
    },
    //客户列表(选项卡1)----------------------------------------
    // handleCurrentChange1(cursor) {
    handleCurrentChange1() {
      // cursor === 0 && ((this.currentPage1 = 1), (this.cursor1 = null));
      // const path = "https://www.easy-mock.com/mock/5f8b75cfb260f247acdf2bb3/v1/externalcontact/batch/get_by_user"
      /* const path =
        this.$axios.defaults.baseURL + "/externalcontact/batch/get_by_user";
      this.$axios
        .post(path, {
          userid: this.userid,
          offset: this.currentPage1 - 1,
          limit: this.pageSize1,
          cursor: this.cursor1 || null,
        })
        .then((res) => {
          this.tableData = res.data.external_contact_list;
          this.cursor1 = res.data.next_cursor;
          this.cursor1 ||
            ((this.currentPage1 = 1),
            cursor !== 0 && this.$message("没有下一页了"));
        }); */

      this.loading = false;
      var maxPageNum = Math.ceil(this.userList.length / this.pageSize1);
      if (this.currentPage1 > maxPageNum) {
        this.$message("没有下一页了");
        this.currentPage1 = maxPageNum;
      }
      var start = (this.currentPage1 - 1) * this.pageSize1;
      var end = this.currentPage1 * this.pageSize1;
      this.tableData = this.userList.slice(start, end);
    },
    handleSizeChange1() {
      this.currentPage1 = 1;
      var start = (this.currentPage1 - 1) * this.pageSize1;
      var end = this.currentPage1 * this.pageSize1;
      this.tableData = this.userList.slice(start, end);
    },
    //客户群（选项卡2）----------------------------------------
    handleCurrentChange2(cursor) {
      cursor === 0 && ((this.currentPage2 = 1), (this.cursor2 = null));
      // const path2 = "https://www.easy-mock.com/mock/5f8b75cfb260f247acdf2bb3/v1/externalcontact/groupchat/list"
      const path2 =
        this.$axios.defaults.baseURL + "/externalcontact/groupchat/list";
      this.$axios
        .post(path2, {
          userid: this.userid,
          offset: this.currentPage2 - 1,
          limit: this.pageSize2,
          cursor: this.cursor2 || null,
        })
        .then((res) => {
          res.data.group_chat_list.forEach((item) => {
            let date = new Date(item.create_time * 1000);
            item.create_time = date.toLocaleDateString();
            item.status = ["所有列表", "离职待继承", "离职继承中", "离职继承完成"][parseInt(item.status || 0)];
            item.join_scene = [
              "未知方式",
              "直接邀请",
              "通过邀请链接",
              "二维码入群",
            ][parseInt(item.join_scene || 0)];
            console.log(item);
          });
          this.tableData2 = res.data.group_chat_list;
          this.cursor2 = res.data.next_cursor;
          this.cursor2 ||
            ((this.currentPage2 = 1),
            cursor !== 0 && this.$message("没有下一页了"));
        });
    },
    //客户分配（选项卡3）----------------------------------------
    handleCurrentChange3(cursor) {
      cursor === 0 && ((this.currentPage3 = 1), (this.cursor3 = null));
      // const path3 = "https://www.easy-mock.com/mock/5f8b75cfb260f247acdf2bb3/v1/externalcontact/get_unassigned_list"
      const path3 =
        this.$axios.defaults.baseURL + "/externalcontact/get_unassigned_list";
      this.$axios
        .post(path3, {
          // userid: this.userid,//不需要传userid
          offset: this.currentPage3 - 1,
          limit: this.pageSize3,
        })
        .then((res) => {
          res.data.info.forEach((item) => {
            let date = new Date(item.dimission_time * 1000);
            item.dimission_time = date.toLocaleDateString();
          });
          this.tableData3 = res.data.info;
          this.cursor3 = res.data.next_cursor;
          this.cursor3 ||
            ((this.currentPage3 = 1),
            cursor !== 0 && this.$message("没有下一页了"));
        });
    },
  },
  created() {
    this.getUserIds(); //获取用户id列表
    // this.handleCurrentChange1(0);
    this.handleCurrentChange2(0);
    this.handleCurrentChange3(0);
  },
};
</script>
<style scoped>
.tabs {
  display: flex;
  align-items: center;
  width: 100%;
  height: 35px;
  color: #333;
  font-size: 14px;
  border-bottom: 2px solid #e8e8e8;
}
.tabs .tab {
  margin-right: 45px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
}
.tabs .tab.active {
  color: rgb(64, 158, 255);
  border-bottom: 2px solid rgb(64, 158, 255);
  font-size: 14px;
}

.sg-page {
  text-align: center;
}
</style>
