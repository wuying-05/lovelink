<template>
  <el-container>
    <el-main
      class="container"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <div class="">
        <el-card style="margin-bottom: 10px; padding: 10px 0">
          <el-tabs stretch v-model="activeTabName" @tab-click="handleClick">
            <el-tab-pane label="自动开通" name="zd">
              <div slot="label"> <div v-if="is_super" style="line-height: 16px; font-size: 14px">
                  开通总人数：{{ autoData.total }}
                </div>
                <div style="line-height: 14px; margin-top: 5px">自动开通</div>
              </div>
              <el-row>
                <el-table
                  :data="autoData.list"
                  style="width: 100%; font-size: 12px"
                >
                  <el-table-column prop="id" label="用户ID" width="80">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="100">
                  </el-table-column>
                  <el-table-column prop="phone" label="手机号">
                  </el-table-column>
                  <el-table-column prop="wechat" label="微信号">
                  </el-table-column>
                  <el-table-column
                    prop="wechatwork_group"
                    width="220"
                    label="企业微信群二维码"
                  >
                    <template slot-scope="scope">
                      <img
                        style="width: 72px; height: 72px"
                        :src="
                          ossUrl +
                          '/wechatworkgroup/' +
                          scope.row.wechatwork_group
                        "
                        v-if="scope.row.wechatwork_group"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_name" label="已开套餐名称">
                  </el-table-column>
                  <el-table-column prop="create_time" label="开通时间">
                  </el-table-column>
                  <el-table-column prop="end_time" label="结束时间">
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20">
                <el-pagination
                  background
                  small
                  :hide-on-single-page="true"
                  @current-change="fetchAutoData"
                  layout="prev, pager, next"
                  :size="autoData.total"
                  :page-count="autoData.pages"
                  :current-page="autoData.page"
                >
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="手动开通" name="sd">
              <div slot="label">
                <div style="line-height: 16px; font-size: 14px">
                  开通总人数：{{ manualData.total }}
                </div>
                <div style="line-height: 14px; margin-top: 5px">手动开通</div>
              </div>
              <el-row>
                <el-table
                  :data="manualData.list"
                  style="width: 100%; font-size: 12px"
                >
                  <el-table-column prop="id" label="用户ID" width="80">
                  </el-table-column>
                  <el-table-column prop="name" label="姓名" width="100">
                  </el-table-column>
                  <el-table-column prop="phone" label="手机号">
                  </el-table-column>
                  <el-table-column prop="wechat" label="微信号">
                  </el-table-column>
                  <el-table-column
                    prop="wechatwork_group"
                    width="220"
                    label="企业微信群二维码"
                  >
                    <template slot-scope="scope">
                      <img
                        style="width: 72px; height: 72px"
                        :src="
                          ossUrl +
                          '/wechatworkgroup/' +
                          scope.row.wechatwork_group
                        "
                        v-if="scope.row.wechatwork_group"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="product_name" label="已开套餐名称">
                  </el-table-column>
                  <el-table-column prop="create_time" label="开通时间">
                  </el-table-column>
                  <el-table-column prop="end_time" label="结束时间">
                  </el-table-column>
                  <el-table-column prop="pay_admin_name" label="开通人">
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20">
                <el-pagination
                  background
                  small
                  :hide-on-single-page="true"
                  @current-change="fetchManualData"
                  layout="prev, pager, next"
                  :size="manualData.total"
                  :page-count="manualData.pages"
                  :current-page="manualData.page"
                >
                </el-pagination>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="套餐积分与定价" name="dj">
              <div slot="header" class="clearfix">
                <el-row type="flex" class="row-bg" justify="end">
                  <el-col :span="6"
                    ><div class="grid-content bg-purple">
                      <span>套餐定价</span>
                    </div></el-col
                  >
                  <el-col :span="6"
                    ><div class="grid-content bg-purple-light"></div
                  ></el-col>
                  <el-col :span="6">
                    <div class="grid-content bg-purple"></div>
                  </el-col>
                </el-row>
              </div>
              <el-row>
                <!-- 按次数搜索 -->
                <el-col :span="12" style="text-align: left">
                  <el-form :model="timesSearchForm" label-width="50px" ref="timesSearchForm" :inline="true">
                    <el-form-item prop="startAge" style="width: 100px">
                      <el-input size="small" v-model.number="timesSearchForm.start_refer_score">
                        <i slot="suffix">周增积分</i>
                      </el-input>
                    </el-form-item>
                    _
                    <el-form-item prop="endAge" style="width: 100px">
                      <el-input size="small" v-model.number="timesSearchForm.end_refer_score">
                        <i slot="suffix">周增积分</i>
					  </el-input>
                    </el-form-item>
                    <el-form-item prop="weight">
                      <el-input placeholder="查询次数" size="small" v-model="timesSearchForm.search_num" style="width: 120px"/>
                    </el-form-item>
                    <el-form-item>
                      <el-button :plain="false" type="primary" icon="el-icon-search" size="small" @click="searchByNewWeek()" >搜索</el-button>
                    </el-form-item>
					<el-form-item>
					  <el-button :plain="false" @click="newRule('1')" type="primary" size="small" >新增</el-button>
					</el-form-item>
                  </el-form>
                </el-col>
				<!-- 套餐搜索 -->
                <el-col :span="12" style="text-align: right">
                  <el-form
                    :model="searchForm"
                    label-width="50px"
                    ref="searchForm"
                    :inline="true"
                  >
                    <el-form-item>
                      <el-input
                        placeholder="套餐ID"
                        size="small"
                        v-model="searchForm.id"
                        style="width: 120px"
                      >
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="weight">
                      <el-input
                        placeholder="套餐名"
                        size="small"
                        v-model="searchForm.name"
                        style="width: 120px"
                      >
                      </el-input>
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        :plain="false"
                        @click="submitSearchForm('searchForm')"
                        type="primary"
                        icon="el-icon-search"
                        size="small"
                        >搜索</el-button
                      >
                    </el-form-item>
                  </el-form>
                </el-col>
				<!-- 按人搜索 -->
                <el-col :span="12" style="text-align: left">
                  <el-form :model="peopleSearchForm" ref="peopleSearchForm" :inline="true">
                    <el-form-item prop="startAge" style="width: 100px">
                      <el-input size="small" v-model.number="peopleSearchForm.start_refer_score">
                        <i slot="suffix">积分</i>
                      </el-input>
                    </el-form-item>
                    _
                    <el-form-item prop="endAge" style="width: 100px">
                      <el-input size="small" v-model.number="peopleSearchForm.end_refer_score">
                        <i slot="suffix">积分</i>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="weight">
                      <el-input placeholder="除数" size="small" v-model="peopleSearchForm.search_peo_rate" style="width: 120px"/>
                    </el-form-item>

                    <el-form-item>
                      <el-button :plain="false" @click="searchByPerson()" type="primary" icon="el-icon-search" size="small" >搜索</el-button>
                    </el-form-item>
					
					<el-form-item>
					  <el-button :plain="false" @click="newRule('2')" type="primary" size="small" >新增</el-button>
					</el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row v-if="idSearchResult">
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="id" label="套餐ID" width="80">
                  </el-table-column>
                  <el-table-column prop="name" label="套餐名称">
                  </el-table-column>
                  <el-table-column prop="price" label="价格"> </el-table-column>
                  <el-table-column prop="pronum" label="最大推荐人数">
                  </el-table-column>
                  <el-table-column prop="daynum" label="每日推荐人数">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button
                        @click="handleEdit(scope.row)"
                        type="text"
                        size="small"
                        >编辑</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20" v-if="idSearchResult">
                <el-pagination
                  background
                  small
                  :hide-on-single-page="true"
                  @current-change="submitSearchForm"
                  layout="prev, pager, next"
                  :size="pageData.per_page"
                  :page-count="pageData.pages"
                  :current-page="pageData.page"
                >
                </el-pagination>
              </el-row>
				<!-- 按次数搜索 -->
			  <el-row v-if="numSearchResult">
                <el-table :data="numData.list" style="width: 100%">
                  <el-table-column type="index" label="规则ID" width="80">
                  </el-table-column>
                  <el-table-column prop="isvalid" label="是否生效">
					  <template slot-scope="scope">
                      <span>{{scope.row.isvalid == 0 ? '无效' : '生效'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="本周新增积分">
					<template slot-scope="scope">
                      <span>{{scope.row.start_refer_score}} - {{scope.row.end_refer_score}}</span>
                    </template>
				  </el-table-column>
                  <el-table-column prop="search_num" label="可搜索次数">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="100px">
                    <template slot-scope="scope">
                      <el-button @click="handleNumEdit(scope.row)" type="text" size="small" >编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20" v-if="numSearchResult">
                <el-pagination
                  background
                  small
                  :hide-on-single-page="true"
                  @current-change="searchByNewWeek"
                  layout="prev, pager, next"
                  :size="numData.per_page"
                  :page-count="numData.pages"
                  :current-page="numData.page"
                >
                </el-pagination>
              </el-row>

			  	<!-- 按人数搜索 -->
			  <el-row v-if="personSearchResult">
                <el-table :data="personData.list" style="width: 100%">
                  <el-table-column type="index" label="规则ID" width="80">
                  </el-table-column>
                  <el-table-column prop="isvalid" label="是否生效">
					  <template slot-scope="scope">
                      <span>{{scope.row.isvalid == 0 ? '无效' : '生效'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="积分">
					<template slot-scope="scope">
                      <span>{{scope.row.start_refer_score}} - {{scope.row.end_refer_score}}</span>
                    </template>
				  </el-table-column>
                  <el-table-column prop="search_peo_rate" label="除数">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="100px">
                    <template slot-scope="scope">
                      <el-button @click="handlePersonEdit(scope.row)" type="text" size="small" >编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row style="padding: 20px 0" :lg="6" :sm="20" v-if="personSearchResult">
                <el-pagination
                  background
                  small
                  :hide-on-single-page="true"
                  @current-change="searchByPerson"
                  layout="prev, pager, next"
                  :size="personData.per_page"
                  :page-count="personData.pages"
                  :current-page="personData.page"
                >
                </el-pagination>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <el-dialog :visible.sync="showDialog" title="编辑" width="20%">
          <el-form :model="editForm" ref="form">
            <el-form-item label="名称" prop="name">
              <el-input
                placeholder="请输入群名称"
                v-model="editForm.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input
                type="number"
                placeholder="请输入价格"
                v-model="editForm.price"
              ></el-input>
            </el-form-item>
            <el-form-item label="最大推荐人数" prop="pronum">
              <el-input
                type="number"
                placeholder="请输入推荐人数"
                v-model="editForm.pronum"
              ></el-input>
            </el-form-item>
            <el-form-item label="每日推荐人数" prop="daynum">
              <el-input
                type="number"
                placeholder="请输入每日推荐人数"
                v-model="editForm.daynum"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              @click="handleDiagSubmit"
              type="primary"
              class="btn-custom"
            >
              <span>确 定</span>
            </el-button>
          </div>
        </el-dialog>

		<el-dialog :visible.sync="showNumDialog" :title="areNewRule ? '新增' : '编辑'" width="490px">
          <el-form :model="editNumForm" ref="editNumForm" label-width="100px">
            <el-form-item label="是否生效">
              <el-radio-group v-model="editNumForm.isvalid">
				<el-radio label="1">是</el-radio>
				<el-radio label="0">否</el-radio>
				</el-radio-group>
            </el-form-item>
            <el-form-item label="本周新增积分范围">
              <el-input type="number" placeholder="积分" v-model="editNumForm.start_refer_score" style="width: 46%"></el-input>
			  -
			  <el-input type="number" placeholder="积分" v-model="editNumForm.end_refer_score" style="width: 47%"></el-input>
            </el-form-item>
            <el-form-item label="可搜索次数">
              <el-input placeholder="请输入可搜索次数" v-model="editNumForm.search_num"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer delete">
			  <el-button @click="deleteOnclick('/delete/search_num_rule', editNumForm, 'peo_rule_id')" type="primary" class="btn-custom">
			    <span>删 除</span>
			  </el-button>
            <el-button @click="handleNumDiagSubmit" type="primary" class="btn-custom">
              <span>确 定</span>
            </el-button>
          </div>
        </el-dialog>

		<el-dialog :visible.sync="showPersonDialog" :title="areNewRule ? '新增': '编辑'" width="490px">
          <el-form :model="editPersonForm" ref="editPersonForm" label-width="100px">
            <el-form-item label="是否生效">
              <el-radio-group v-model="editPersonForm.isvalid">
				<el-radio label="1">是</el-radio>
				<el-radio label="0">否</el-radio>
				</el-radio-group>
            </el-form-item>
            <el-form-item label="本周新增积分范围">
              <el-input type="number" placeholder="积分" v-model="editPersonForm.start_refer_score" style="width: 46%"></el-input>
			  -
			  <el-input type="number" placeholder="积分" v-model="editPersonForm.end_refer_score" style="width: 47%"></el-input>
            </el-form-item>
            <el-form-item label="除数">
              <el-input placeholder="请输入除数" v-model="editPersonForm.search_peo_rate"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer delete">
			<el-button @click="deleteOnclick('/delete/search_peo_rule', editPersonForm, 'num_rule_id')" type="primary" class="btn-custom">
			  <span>删 除</span>
			</el-button>
            <el-button @click="handlePersonDiagSubmit" type="primary" class="btn-custom">
              <span>确 定</span>
            </el-button>
          </div>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import store from "../store";
import { CodeToText } from "element-china-area-data"; // CodeToText
import { degreeData, checkStatusOptions } from "../data";
export default {
  name: "Product", // this is the name of the component
  components: {},
  data() {
    return {
      ossUrl: store.ossUrl,
      is_super: false,
      activeTabName: "zd",
      checkStatusOptions: checkStatusOptions,
      idSearchResult: false,
      loading: false,
      store: store,
      sharedState: store.state,
      showResult: false,
	  showDialog: false,
	  showNumDialog: false,
	  showPersonDialog: false,
      searchForm: {
        id: "",
        name: "",
      },
      timesSearchForm: {
        start_refer_score: "",
        end_refer_score: "",
        search_num: "",
      },
      peopleSearchForm: {
        start_refer_score: "",
		end_refer_score: "",
		search_peo_rate: ''
      },
      editForm: { id: 0, name: "", price: 0, pronum: 0, daynum: 0 },
      resultData: {},
      pageData: {},
      tableData: {},
      autoData: {
        list: null,
        page: null,
        pages: null,
        total: null,
      },
      validWxGroup: false,
      manualData: {
        list: null,
        page: null,
        pages: null,
        total: null,
	  },
	  numSearchResult: false,
	  personSearchResult: false,
	  numTableData: [],
	  numPageData: {},
	  editNumForm: {},
	  editPersonForm: {},
	  personTableData: [],
	  numData: {
        list: null,
        page: null,
        pages: null,
        total: null,
	  },
	  personData: {
        list: null,
        page: null,
        pages: null,
        total: null,
	  },
	  areNewRule: false  // 判断是否为新增
    };
  },
  methods: {
	  // 删除规则
	  deleteOnclick(path, data, val) {
		  console.log(data, 'data')
		  console.log(val, 'val')
		  // const path = "/delete/search_peo_rule";
		  let obj = {
			  peo_rule_id: data.peo_rule_id
		  }
		  let enj = {
			  num_rule_id: data.num_rule_id
		  }
		  let en = val == 'peo_rule_id' ? enj: obj
		  console.log(en, 'en')
		  this.$axios
		  	.post(path, en)
		  	.then((response) => {
		  	if (response.data.code == 0) {
		  		this.$message.success("操作成功！")
				val == 'peo_rule_id' ? this.searchByNewWeek() : this.searchByPerson()
		  		this.showNumDialog = false
		  		this.showPersonDialog = false
				this.sexRemove()
		  	} else {
		  		this.$message.info(response.data.msg);
		  	}
		  	})
		  	.catch((error) => {
				console.log("error!", error.response);
				this.$message.info("操作失败！");
		  	});
	  },
	  // 新增规则
	  newRule(val) {
		  this.editPersonForm = {}
		  this.editNumForm = {}
		  this.personTableData = []
		  this.areNewRule = true
		  val == 1 ? this.showNumDialog = true : this.showPersonDialog = true
	  },
    fetchAutoData(page = null, showmessage = true) {
      // 自动开通
      let page_str = "";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      let path = "/admin/users" + page_str;
      let params = {
        pay_type: 0,
      };
      this.$axios
        .get(path, { params })
        .then((response) => {
          this.autoData.list = response.data.data;
          this.autoData.pages = response.data.pages;
          this.autoData.total = response.data.total;
        })
        .catch((error) => {});
    },
    fetchManualData(page = null, showmessage = true) {
      // 手动开通
      let page_str = "";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      let path = "/admin/users" + page_str;
      let params = {
        pay_type: 1,
      };
      this.$axios
        .get(path, { params })
        .then((response) => {
          this.manualData.list = response.data.data;
          this.manualData.pages = response.data.pages;
          this.manualData.total = response.data.total;
        })
        .catch((error) => {});
    },
    handleClick(tab) {
      if (tab.name === "dj") {
      } else if (tab.name === "sd") {
        this.fetchAutoData();
      } else {
        this.fetchManualData();
      }
    },
    handleDiagSubmit() {
      console.log(this.editForm);
      const path = "/product/edit";
      const payload = {
        id: this.editForm.id,
        name: this.editForm.name,
        price: this.editForm.price,
        pronum: this.editForm.pronum,
        daynum: this.editForm.daynum,
      };
      this.$axios
        .post(path, payload)
        .then((response) => {
          if (response.data.code == 0) {
            this.$message.success("操作成功！");
            this.submitSearchForm("searchForm");
            this.showDialog = false;
          } else {
            this.$message.info(response.data.msg);
          }
        })
        .catch((error) => {
          console.log("error!", error.response);
          this.$message.info("操作失败！");
        });
    },
    handleEdit(row) {
      this.showDialog = true;
      this.editForm = row;
    },
    residenceFormat(row, column) {
      var codes = row.residence.split(",");
      for (var i = 0; i < codes.length; i++) codes[i] = CodeToText[codes[i]];
      return codes.join();
    },
    stateFormat(row, column) {
      if (row[column.property] === true) {
        return "通过";
      } else {
        return "未通过";
      }
    },
    degreeFormat(row, column) {
      return degreeData[row.degree];
    },
    checkAdminActive(id) {
      // eslint-disable-next-line no-template-curly-in-string
      const path = `/admin/admins/${id}/active`;
      this.$axios
        .get(path)
        .then((response) => {
          this.is_super = response.data.is_super;
          if (!response.data.active) {
            this.store.adminLogoutAction();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    limitAdminPages() {
      // 如果当前用户是普通管理员，而且 pageData.pages 的值大于 10，重置为 10
      if (!this.sharedState.is_super_admin && this.pageData.pages > 10) {
        this.pageData.pages = 10;
      }
    },
    submitSearchForm(page = null, showmessage = true) {
	 console.log('ceshi')
	 this.sexRemove()
      this.loading = true;
      let page_str = "";
      if (page) {
        page_str = "?page=" + page;
      } else if (this.pageData.page) {
        page_str = "?page=" + this.pageData.page;
      }
      const path = "/product/getProducts" + page_str;
      const payload = {
        id: this.searchForm.id,
        name: this.searchForm.name,
      };
      this.$axios
        .post(path, payload)
        .then((response) => {
          if (response.data.code === 0) {
            this.idSearchResult = true;
            this.tableData = response.data.data.res;
            //this.pageData = response.data.pagination
            //this.limitAdminPages()
            this.loading = false;
            if (showmessage) {
              // this.$message.success('搜索结果已更新！')
            }
          }
          // 把返回的搜索结果数据渲染到页面
        })
        .catch((error) => {
          // handle error, 400 and 500
          console.log("error!", error.response);
          this.loading = false;
        });
    },
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
	},
	searchByNewWeek(page = 1, showmessage = true){
		this.sexRemove()
		let path = "/search/search_num_rule";
		this.$axios
			.post(path, { ...this.timesSearchForm, page: page , per_page: 12 })
			.then((response) => {
			this.numSearchResult = true
			if(!response.data) return this.numData.list = {
				num_rule_id: '',
				isvalid: '',
				search_num: ''
			}
			this.numData.list = response.data.data;
			this.numData.pages = response.data.pages;
			this.numData.total = response.data.total;
			})
			.catch((error) => {});
	},
	searchByPerson(page = 1, showmessage = true){
		this.sexRemove()
		let path = "/search/search_peo_rule";
		this.$axios
			.post(path, {...this.peopleSearchForm, page: page, per_page: 12 })
			.then((response) => {
				this.personSearchResult = true
				if(!response.data) return this.personData.list = {
					peo_rule_id: '',
					isvalid: '',
					search_peo_rate: '',
				}
			this.personData.list = response.data.data;
			this.personData.pages = response.data.pages;
			this.personData.total = response.data.total;
			})
			.catch((error) => {});
	},
	sexRemove() {
		this.personSearchResult = false
		this.numSearchResult = false
		this.idSearchResult = false
	},
	handleNumEdit(row){
		this.showNumDialog = true
		this.editNumForm = row
		this.areNewRule = false
	},
	handlePersonEdit(row){
		this.showPersonDialog = true
		this.editPersonForm = row
		this.areNewRule = false
	},
	handleNumDiagSubmit(){
		const path = "/option/search_num_rule";
		// console.log(this.editNumForm, 'asd')
		if(!this.editNumForm.end_refer_score) return this.$message.info("请输入积分范围的最大值");
		this.$axios
			.post(path, this.editNumForm)
			.then((response) => {
			if (response.data.code == 0) {
				this.$message.success("操作成功！");
				this.searchByNewWeek();
				this.showNumDialog = false;
			} else {
				this.$message.info(response.data.msg);
			}
			})
			.catch((error) => {
			console.log("error!", error.response);
			this.$message.info("操作失败！");
			});
	},
	handlePersonDiagSubmit(){
		const path = "/option/search_peo_rule";
		if (!this.editPersonForm.end_refer_score) return this.$message.info("请输入积分范围的最大值");
		this.$axios
			.post(path, this.editPersonForm)
			.then((response) => {
			if (response.data.code == 0) {
				this.$message.success("操作成功！");
				this.searchByPerson();
				this.showNumDialog = false;
				this.showPersonDialog = false
			} else {
				this.$message.info(response.data.msg);
			}
			})
			.catch((error) => {
			console.log("error!", error.response);
			this.$message.info("操作失败！");
			});
	}
  },
  created() {
    const adminId = this.sharedState.admin_id;
    this.checkAdminActive(adminId);
    this.fetchAutoData();
    this.fetchManualData();
  },
};
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
.delete {
	display: flex;
	justify-content: space-around;
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
  clear: both;
}
.el-tabs__item {
  height: 50px;
}
</style>
