<template>
  <div>
    <div class="search-term">
      <el-form
        :inline="true"
        class="demo-form-inline"
        size="mini"
        label-width="120px"
        label-position="right"
        :model="searchInfo"
      >
        <el-row :gutter="24">
          <el-col :span="20">
            <div>
              <el-form-item label="城市ID">
                <el-input
                  v-model.number="formData.city_id"
                  clearable
                  placeholder="请输入"
                ></el-input>
              </el-form-item>

              <el-form-item label="城市名称">
                <el-input
                  placeholder="城市名称"
                  v-model="searchInfo.name"
                ></el-input>
              </el-form-item>

              <el-form-item label="城市简称">
                <el-input
                  placeholder="城市简称"
                  v-model="searchInfo.short_name"
                ></el-input>
              </el-form-item>

              <el-form-item label="省份ID">
                <el-input
                  v-model.number="formData.province_id"
                  clearable
                  placeholder="请输入"
                ></el-input>
              </el-form-item>

              <el-form-item label="天气代码">
                <el-input
                  v-model.number="formData.weather_id"
                  clearable
                  placeholder="请输入"
                ></el-input>
              </el-form-item>

              <el-form-item label="拼音">
                <el-input
                  placeholder="拼音"
                  v-model="searchInfo.pinyin"
                ></el-input>
              </el-form-item>

              <el-form-item label="拼音断码">
                <el-input
                  placeholder="拼音断码"
                  v-model="searchInfo.py"
                ></el-input>
              </el-form-item>

              <el-form-item label="城市群组">
                <el-input
                  placeholder="城市群组"
                  v-model="searchInfo.city_group"
                ></el-input>
              </el-form-item>

              <el-form-item label="坐标">
                <el-input
                  placeholder="坐标"
                  v-model="searchInfo.location"
                ></el-input>
              </el-form-item>

              <el-form-item label="nmcCode">
                <el-input
                  v-model.number="formData.nmc_code"
                  clearable
                  placeholder="请输入"
                ></el-input>
              </el-form-item>

              <el-form-item label="tqwCode">
                <el-input
                  v-model.number="formData.tqw_code"
                  clearable
                  placeholder="请输入"
                ></el-input>
              </el-form-item>

              <el-form-item label="开始时间">
                <datepicker v-model="searchInfo.startTime" type="datetime" />
              </el-form-item>
              <el-form-item label="结束时间">
                <datepicker v-model="searchInfo.endTime" type="datetime" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="form-search-btn">
              <el-button @click="onQuery" type="primary">查询</el-button>
              <el-button @click="$bus.$emit('reload')">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button
          v-if="userInfo.perm['system.create']"
          @click="createRow"
          class="btn-info"
          >新增</el-button
        >
        <el-button
          v-if="userInfo.perm['system.batch_delete']"
          @click="handleCommand('remove')"
          class="btn-info"
          >批量删除</el-button
        >
        <el-button
          v-if="userInfo.perm['system.summary']"
          @click="getSummaryList"
          class="btn-info"
          >合计</el-button
        >
        <el-button
          v-if="userInfo.perm['system.import']"
          @click="importExcel"
          icon="el-icon-upload2"
          class="btn-info"
          >导入</el-button
        >
        <el-button
          v-if="userInfo.perm['system.export']"
          @click="exportExcel"
          icon="el-icon-download"
          class="btn-info"
          >导出</el-button
        >
      </el-form>
    </div>

    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      ref="multipleTable"
      style="width: 100%"
      tooltip-effect="dark"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      border
      stripe
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="ID" prop="ID" sortable></el-table-column>
      <el-table-column
        label="日期"
        width="160"
        prop="created_at"
        sortable="custom"
      >
        <template slot-scope="scope">{{
          scope.row.created_at | formatDate
        }}</template>
      </el-table-column>

      <el-table-column label="城市ID" prop="city_id"> </el-table-column>

      <el-table-column label="城市名称" prop="name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="城市简称" prop="short_name" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="省份ID" prop="province_id"> </el-table-column>

      <el-table-column label="天气代码" prop="weather_id"> </el-table-column>

      <el-table-column label="拼音" prop="pinyin" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="拼音断码" prop="py" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="城市群组" prop="city_group" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="坐标" prop="location" show-overflow-tooltip>
      </el-table-column>

      <el-table-column label="nmcCode" prop="nmc_code"> </el-table-column>

      <el-table-column label="tqwCode" prop="tqw_code"> </el-table-column>

      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="userInfo.perm['system.update']"
            @click="editRow(scope.row)"
            type="text"
            size="small"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            v-if="userInfo.perm['system.delete']"
            @click="deleteRow(scope.row)"
            type="text"
            size="small"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :style="{ float: 'right', padding: '20px' }"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      background
    ></el-pagination>

    <el-dialog
      @close="closeDialog"
      :visible.sync="dialogFormVisible"
      :title="dialogTitle"
      width="25%"
    >
      <el-form
        :model="formData"
        :rules="formDataRules"
        ref="ruleForm"
        size="mini"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="城市ID" prop="city_id">
          <el-input
            v-model.number="formData.city_id"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="城市名称" prop="name">
          <el-input
            v-model="formData.name"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="城市简称" prop="short_name">
          <el-input
            v-model="formData.short_name"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="省份ID" prop="province_id">
          <el-input
            v-model.number="formData.province_id"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="天气代码" prop="weather_id">
          <el-input
            v-model.number="formData.weather_id"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input
            v-model="formData.pinyin"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="拼音断码" prop="py">
          <el-input
            v-model="formData.py"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="城市群组" prop="city_group">
          <el-input
            v-model="formData.city_group"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="坐标" prop="location">
          <el-input
            v-model="formData.location"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="nmcCode" prop="nmc_code">
          <el-input
            v-model.number="formData.nmc_code"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="tqwCode" prop="tqw_code">
          <el-input
            v-model.number="formData.tqw_code"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = !dialogFormVisible"
          >取 消</el-button
        >
        <el-button @click="enterDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <uploadexcel ref="uploadexcel" action="SysCommonCityInfo"></uploadexcel>
  </div>
</template>

<script>
import {
  createSysCommonCityInfo,
  deleteSysCommonCityInfo,
  updateSysCommonCityInfo,
  findSysCommonCityInfo,
  getSysCommonCityInfoList,
  batchSysCommonCityInfoOperation,
  getSysCommonCityInfoSummary,
} from "@/api/common/common_city_info";
import { getExcel } from "@/api/common";
import infoList from "@/mixins/infoList";
import datepicker from "@/components/datepicker";
import uploadexcel from "@/components/uploadexcel";
import { mapGetters } from "vuex";
export default {
  name: "common_city_info",
  mixins: [infoList],
  components: {
    datepicker,
    uploadexcel,
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getSysCommonCityInfoList,
      dialogFormVisible: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        city_id: undefined,
        name: "",
        short_name: "",
        province_id: undefined,
        weather_id: undefined,
        pinyin: "",
        py: "",
        city_group: "",
        location: "",
        nmc_code: undefined,
        tqw_code: undefined,
      },
      formDataRules: {
        city_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        name: [{ required: true, message: "请填写数据", trigger: "blur" }],
        short_name: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        province_id: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        weather_id: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        pinyin: [{ required: true, message: "请填写数据", trigger: "blur" }],
        py: [{ required: true, message: "请填写数据", trigger: "blur" }],
        city_group: [
          { required: true, message: "请填写数据", trigger: "blur" },
        ],
        location: [{ required: true, message: "请填写数据", trigger: "blur" }],
        nmc_code: [{ required: true, message: "请填写数据", trigger: "blur" }],
        tqw_code: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
      miniDataList: [],
    };
  },
  methods: {
    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    createRow() {
      this.type = "create";
      this.dialogTitle = "创建";
      this.dialogFormVisible = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await findSysCommonCityInfo({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.recommon_city_info;
        this.dialogFormVisible = true;
      }
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysCommonCityInfo(row);
      });
    },
    async deleteSysCommonCityInfo(row) {
      const res = await deleteSysCommonCityInfo({ ID: row.ID });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.tableData.length == 1) {
          this.page--;
        }
        this.getTableData();
      }
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
      this.formData = {
        city_id: undefined,
        name: "",
        short_name: "",
        province_id: undefined,
        weather_id: undefined,
        pinyin: "",
        py: "",
        city_group: "",
        location: "",
        nmc_code: undefined,
        tqw_code: undefined,
      };
      this.dialogFormVisible = false;
    },
    async enterDialog() {
      //数据校验
      const valid = await new Promise((resolve) => {
        this.$refs["ruleForm"].validate((valid) => {
          resolve(valid);
        });
      });
      if (!valid) {
        this.$message({
          type: "error",
          message: "请填写正确数据",
        });
        return false;
      }

      let res;
      switch (this.type) {
        case "create":
          res = await createSysCommonCityInfo(this.formData);
          break;
        case "update":
          res = await updateSysCommonCityInfo(this.formData);
          break;
        default:
          this.$message({
            type: "error",
            message: "操作类型错误",
          });
          return false;
      }
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.closeDialog();
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCommand(command) {
      this.$confirm("是否要执行批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const ids = [];
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "warning",
            message: "请选择需要操作的数据",
          });
          return;
        }
        this.multipleSelection &&
          this.multipleSelection.map((item) => {
            ids.push(item.ID);
          });

        const res = await batchSysCommonCityInfoOperation({
          ids,
          command: command,
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.getTableData();
        }
      });
    },
    sortChange(row) {
      //自定义排序要设置两个属性prop="field-name" sortable="custom"
      this.orderField = row.prop;
      this.orderType = this.directionMap[row.order] || "";
      this.getTableData();
    },
    async getSummaryList() {
      const res = await getSysCommonCityInfoSummary(this.searchInfo);
      let keys = Object.keys(res.data.summary);
      for (let key of keys) {
        this.summary[key] = res.data.summary[key];
      }
      this.showSummary = true;
    },
    getSummaries(param) {
      const sums = [];
      const { columns } = param;
      let that = this;
      columns.forEach((column, index) => {
        sums[index] =
          that.summary[column.property] != null
            ? that.summary[column.property]
            : null;
      });
      // sums[0] = "合计";
      return sums;
    },
    importExcel() {
      //触发upLoad组件内部点击事件，弹出文件选择框
      this.$refs.uploadexcel.chooseFile();
    },
    async exportExcel() {
      this.searchInfo.action = "common_city_info";
      await getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style>
</style>