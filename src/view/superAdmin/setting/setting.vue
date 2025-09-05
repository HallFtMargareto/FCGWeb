<template>
  <div>
    <div class="search-term">
      <el-form
        :inline="true"
        :model="searchInfo"
        class="demo-form-inline"
        size="mini"
      >
        <el-form-item label="配置项">
          <el-input
            placeholder="清输入配置项"
            v-model="searchInfo.keys"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit" type="primary">查询</el-button>
          <el-button @click="$bus.$emit('reload')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="openDialog"
            type="primary"
            style="margin-left: 100px"
            >新增参数</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-popover placement="top" v-model="deleteVisible" width="160">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button @click="deleteVisible = false" size="mini" type="text"
                >取消</el-button
              >
              <el-button @click="onDelete" size="mini" type="primary"
                >确定</el-button
              >
            </div>
            <el-button
              icon="el-icon-delete"
              size="mini"
              slot="reference"
              type="danger"
              >批量删除</el-button
            >
          </el-popover>
        </el-form-item> -->
      </el-form>
    </div>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
      ref="multipleTable"
      stripe
      style="width: 100%"
      tooltip-effect="dark"
    >
      <el-table-column type="selection" width="40"></el-table-column>

      <!-- <el-table-column label="ID" prop="ID" width="50"></el-table-column> -->

      <el-table-column label="KEY" prop="keys"></el-table-column>

      <!-- <el-table-column label="日期" width="153">
        <template slot-scope="scope">{{
          scope.row.CreatedAt | formatDate
        }}</template>
      </el-table-column> -->
      <el-table-column label="描述" prop="remark"></el-table-column>

      <!-- <el-table-column
        label="param字段"
        prop="param"
        width="120"
      ></el-table-column> -->

      <el-table-column label="状态" prop="state"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            class="table-button"
            @click="updateSysSettings(scope.row)"
            size="mini"
            type="text"
            icon="el-icon-edit"
            >变更</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="deleteRow(scope.row)"
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
      :before-close="closeDialog"
      :visible.sync="dialogFormVisible"
      title="弹窗操作"
    >
      <el-form
        :model="formData"
        label-position="right"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="keys:">
          <el-input
            v-model="formData.keys"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="参数列表:">
          <el-row
            v-for="(item, index) in formData.param"
            :key="index"
            style="border-bottom: 1px solid #f0f0f0; padding: 10px"
          >
            <el-form-item
              label="KEY"
              :prop="'param.' + index + '.key'"
              :rules="[
                {
                  required: true,
                  message: '参数名不能为空',
                  trigger: 'change',
                },
                { max: 100, message: '不超过100个字符', trigger: 'change' },
              ]"
            >
              <el-input v-model="item.key" placeholder="请输入参数名" />
            </el-form-item>

            <el-form-item label="VALUE" :prop="'param.' + index + '.val'">
              <el-input
                type="textarea"
                :rows="2"
                v-model="item.val"
                placeholder="请输入参数默认值"
              />
            </el-form-item>

            <el-form-item label="描述" :prop="'param.' + index + '.desc'">
              <el-input
                v-model.trim="item.desc"
                clearable
                placeholder="请输入描述"
              ></el-input>
            </el-form-item>

            <el-button
              type="danger"
              size="medium"
              @click="removeRow(index)"
              style="float: right"
              >删除</el-button
            >
          </el-row>

          <el-row>
            <el-button type="primary" size="medium" @click="addRow"
              >新增参数</el-button
            >
          </el-row>

          <el-row></el-row>
        </el-form-item>

        <el-form-item label="备注描述:">
          <el-input
            type="textarea"
            :rows="2"
            v-model.trim="formData.remark"
            clearable
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态:">
          <el-switch
            v-model.number="formData.state"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="关闭"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="enterDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createSysSettings,
  deleteSysSettings,
  deleteSysSettingsByIds,
  updateSysSettings,
  findSysSettings,
  getSysSettingsList,
} from "@/api/sysSettings";
import infoList from "@/mixins/infoList";
export default {
  name: "SysSettings",
  mixins: [infoList],
  data() {
    return {
      listApi: getSysSettingsList,
      dialogFormVisible: false,
      type: "",
      deleteVisible: false,
      multipleSelection: [],
      formData: {
        keys: "",
        remark: "",
        state: 1,
        param: [
          {
            key: "",
            val: "",
            desc: "",
          },
        ],
      },
    };
  },
  filters: {
    formatDate: function (time) {
      if (time != null && time != "") {
        var date = new Date(time);
        return this.$utils.formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
      } else {
        return "";
      }
    },
    formatBoolean: function (bool) {
      if (bool != null) {
        return bool ? "是" : "否";
      } else {
        return "";
      }
    },
  },
  methods: {
    //条件搜索前端看此方法
    onSubmit() {
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteRow(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteSysSettings(row);
      });
    },
    async onDelete() {
      const ids = [];
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的数据",
        });
        return;
      }
      this.multipleSelection &&
        this.multipleSelection.map((item) => {
          ids.push(item.ID);
        });
      const res = await deleteSysSettingsByIds({ ids });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.tableData.length == ids.length) {
          this.page--;
        }
        this.deleteVisible = false;
        this.getTableData();
      }
    },
    async updateSysSettings(row) {
      const res = await findSysSettings({ ID: row.ID });
      this.type = "update";
      if (res.code == 0) {
        if (res.data.resysSettings.param == null) {
          res.data.resysSettings.param = [];
        }
        this.formData = res.data.resysSettings;
        this.dialogFormVisible = true;
      }
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.formData = {
        keys: "",
        param: "",
        remark: "",
        state: 0,
      };
    },
    async deleteSysSettings(row) {
      const res = await deleteSysSettings({ ID: row.ID });
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
    async enterDialog() {
      let res;
      switch (this.type) {
        case "create":
          res = await createSysSettings(this.formData);
          break;
        case "update":
          res = await updateSysSettings(this.formData);
          break;
        default:
          res = await createSysSettings(this.formData);
          break;
      }
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "创建/更改成功",
        });
        this.closeDialog();
        this.getTableData();
      }
    },
    openDialog() {
      this.type = "create";
      this.dialogFormVisible = true;
    },

    //动态表单
    // 添加
    addRow() {
      this.formData.param.push({
        key: "",
        val: "",
        desc: "",
      });
    },
    // 删除属性列
    removeRow(index) {
      this.formData.param.splice(index, 1);
    },
  },
  async created() {
    await this.getTableData();
  },
};
</script>

<style>
</style>
