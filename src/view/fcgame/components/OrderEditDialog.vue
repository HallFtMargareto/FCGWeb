<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible" width="60%" @close="handleDialogClose" class="order-dialog"
    top="5">
    <el-form ref="editForm" :model="formData" label-position="top" label-width="100px" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="原内容">
            <el-input type="textarea" :rows="5" v-model="formData.source_content" readonly disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="修改内容">
            <el-input type="textarea" :rows="5" v-model="formData.bet_content" style="margin-left: 5px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right">
          <span style="margin-right: 39%">
            <el-button @click="clearOrderDetails" size="mini">清空订单</el-button>
            <el-button @click="openManualSplitDialog" size="mini">前台拆分</el-button>
          </span>

          <el-button @click="reidentify(true)" size="mini">后台识别</el-button>
          <el-button type="success" @click="reidentify(false)" size="mini">重新识别</el-button>
        </el-col>
      </el-row>

      <div class="dialog-table-container">
        <el-table :data="formData.order_details" border style="width: 100%" size="mini" max-height="400"
          highlight-current-row>
          <el-table-column label="游戏类型">
            <template slot-scope="scope">
              <el-select v-model="scope.row.game_type" placeholder="请选择游戏类型">
                <el-option v-for="item in gameTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="玩法">
            <template slot-scope="scope">
              <el-select v-model="scope.row.game_category" placeholder="请选择玩法">
                <el-option label="福彩" :value="1"></el-option>
                <el-option label="体彩" :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="投注号码">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bet_number" placeholder="投注号码"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="注数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.bet_count" placeholder="注数"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="投注金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bet_amount" placeholder="投注金额"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="倍数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.multiple" placeholder="倍数"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" @click="removeOrderDetail(scope.$index)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row>
        <el-col :span="12">
          <div style="padding: 8px 0">
            <span>总数量: {{ totalCount }}</span>
            <span style="margin-left: 20px">金额合计: {{ totalBetAmount }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-button style="float: right" type="primary" @click="addOrderDetail" size="mini">添加子订单</el-button>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="saveOrderEdit" size="small">确 定</el-button>
    </span>

    <!-- 前台拆分弹窗 -->
    <el-dialog title="前台拆分" :visible.sync="manualSplitDialogVisible" width="500px" append-to-body>
      <el-form ref="manualSplitForm" :model="manualSplitForm" label-width="100px" size="small">
        <el-form-item label="游戏类型" required>
          <el-select v-model="manualSplitForm.game_type" placeholder="请选择游戏类型" style="width: 100%">
            <el-option v-for="item in gameTypes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="玩法" required>
          <el-select v-model="manualSplitForm.game_category" placeholder="请选择玩法" style="width: 100%">
            <el-option label="福彩" :value="1"></el-option>
            <el-option label="体彩" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="每注金额" required>
          <el-input v-model.number="manualSplitForm.bet_amount" type="number" placeholder="请输入每注金额"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="manualSplitDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="executeManualSplit" size="small"
          :loading="manualSplitLoading">立即拆分</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { updateFcgOrder, findFcgOrder } from "@/api/fcgame/fcg_order";

export default {
  name: "OrderEditDialog",
  props: {
    // 控制弹窗显示/隐藏
    value: {
      type: Boolean,
      default: false,
    },
    // 弹窗标题
    title: {
      type: String,
      default: "编辑订单",
    },
    // 游戏类型选项
    gameTypes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        source_content: "",
        bet_content: "",
        order_details: [],
      },
      backend: false,
      // 手动拆分弹窗状态
      manualSplitDialogVisible: false,
      // 手动拆分表单数据
      manualSplitForm: {
        game_type: "",
        game_category: 1,
        bet_amount: 2,
      },
      // 手动拆分loading状态
      manualSplitLoading: false,
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    dialogTitle() {
      return this.title;
    },
    // 计算总数量
    totalCount() {
      if (!this.formData.order_details) {
        return 0;
      }
      return this.formData.order_details.length;
    },
    // 计算投注金额总合计
    totalBetAmount() {
      if (
        !this.formData.order_details ||
        this.formData.order_details.length === 0
      ) {
        return 0;
      }
      return this.formData.order_details.reduce((sum, item) => {
        return sum + (Number(item.bet_amount) || 0);
      }, 0);
    },
  },
  methods: {
    // 打开弹窗并加载数据
    async open(orderId) {
      try {
        const res = await findFcgOrder({ ID: orderId });
        if (res.code == 0) {
          // 构造编辑表单数据
          const order = res.data.refcg_order;
          this.formData = {
            ID: order.ID,
            order_no: order.order_no,
            bet_amount: order.bet_amount,
            source_content: order.bet_content,
            bet_content:
              order.is_ai_analysis == 1
                ? order.analysis_content
                : order.bet_content,
            order_details: order.order_details
              ? order.order_details.map((detail) => {
                return {
                  ID: detail.ID,
                  game_category: detail.game_category,
                  game_type: detail.game_type,
                  bet_number: detail.bet_number || "",
                  bet_count: Number(detail.bet_count) || 0,
                  bet_amount: detail.bet_amount || 0,
                  multiple: detail.multiple || 1,
                  order_amount: detail.bet_amount * detail.multiple || 0, // 计算订单金额
                };
              })
              : [],
          };
          this.visible = true;
        }
      } catch (error) {
        console.error("获取订单数据异常:", error);
        this.$message.error("获取订单数据异常");
      }
    },

    // 重新识别
    async reidentify(backend) {
      if (
        this.formData.bet_content &&
        this.formData.bet_content.length > 1000
      ) {
        try {
          await this.$confirm(
            "当前投注内容长度过多，建议使用前台拆分功能。",
            "提示",
            {
              confirmButtonText: "前台拆分",
              cancelButtonText: "继续识别",
              type: "warning",
              distinguishCancelAndClose: true,
            }
          );
          // 确认(立即拆分)
          this.openManualSplitDialog();
          return;
        } catch (action) {
          // 取消(继续识别) 或 关闭
          if (action === "cancel") {
            // 继续执行下面的代码
          } else {
            return;
          }
        }
      }

      this.backend = backend;
      if (backend) {
        const res = await findFcgOrder({
          ID: this.formData.ID,
          bet_content: this.formData.bet_content,
          action: "reidentify",
          backend: backend,
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
        }
        this.visible = false;
        return;
      }

      try {
        // 保存原始内容，防止被覆盖
        const originalSourceContent = this.formData.source_content;

        const res = await findFcgOrder({
          ID: this.formData.ID,
          bet_content: this.formData.bet_content,
          action: "reidentify",
          backend: backend,
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "识别成功",
          });
          // 保存订单详情数据，但保留原始内容
          this.formData = res.data.refcg_order;
          this.formData.source_content = originalSourceContent;
          // 确保 order_details 是一个数组
          if (!this.formData.order_details) {
            this.formData.order_details = [];
          }
        } else {
          this.$message.error("识别失败");
        }
      } catch (error) {
        console.error("重新识别异常:", error);
        this.$message.error("重新识别异常");
      }
    },

    // 添加子订单
    addOrderDetail() {
      if (!this.formData.order_details) {
        this.formData.order_details = [];
      }
      this.formData.order_details.push({
        game_category_name: "",
        game_type_name: "",
        bet_number: "",
        bet_count: Number(0),
        bet_amount: 0,
        multiple: 1,
        order_amount: 0,
      });
    },

    // 删除子订单
    removeOrderDetail(index) {
      if (
        !this.formData.order_details ||
        this.formData.order_details.length === 0
      ) {
        return;
      }
      this.formData.order_details.splice(index, 1);
    },

    // 保存订单编辑
    async saveOrderEdit() {
      try {
        const res = await updateFcgOrder(this.formData);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "订单编辑成功",
          });
          this.visible = false;
          this.$emit("success");
        } else {
          this.$message({
            type: "error",
            message: res.msg || "订单编辑失败",
          });
        }
      } catch (error) {
        console.error("保存订单编辑异常:", error);
        this.$message.error("保存订单编辑异常");
      }
    },

    // 关闭弹窗时的处理
    async handleDialogClose() {
      //如果是后台识别,不要释放锁
      if (this.backend) {
        return;
      }
      await findFcgOrder(
        {
          ID: this.formData.ID,
          action: "cancel_edit",
        },
        { donNotShowLoading: true }
      );

      this.backend = false;
      this.formData = {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        source_content: "",
        bet_content: "",
        order_details: [],
      };
    },

    // 打开手动拆分弹窗
    openManualSplitDialog() {
      this.manualSplitForm = {
        game_type: "",
        game_category: 1,
        bet_amount: 2,
      };
      this.manualSplitDialogVisible = true;
    },

    // 执行手动拆分
    executeManualSplit() {
      // 表单验证
      if (!this.manualSplitForm.game_type) {
        this.$message.warning("请选择游戏类型");
        return;
      }
      if (!this.manualSplitForm.game_category) {
        this.$message.warning("请选择玩法");
        return;
      }
      if (
        !this.manualSplitForm.bet_amount ||
        this.manualSplitForm.bet_amount <= 0
      ) {
        this.$message.warning("请输入有效的投注金额");
        return;
      }

      // 显示loading
      this.manualSplitLoading = true;

      // 使用 setTimeout 让 UI 有机会更新 loading 状态
      setTimeout(() => {
        try {
          // 从 bet_content 中提取所有3位数值
          const betContent = this.formData.bet_content || "";
          const threeDigitNumbers = betContent.match(/\b\d{3}\b/g);

          if (!threeDigitNumbers || threeDigitNumbers.length === 0) {
            this.$message.warning("未在投注内容中找到3位数值");
            this.manualSplitLoading = false;
            return;
          }

          // 去重处理
          const uniqueNumbers = [...new Set(threeDigitNumbers)];

          // 为每个号码创建订单详情并添加到 order_details
          uniqueNumbers.forEach((number) => {
            this.formData.order_details.push({
              game_category: this.manualSplitForm.game_category,
              game_type: this.manualSplitForm.game_type,
              bet_number: number,
              bet_count: 1,
              bet_amount: this.manualSplitForm.bet_amount,
              multiple: 1,
              order_amount: this.manualSplitForm.bet_amount,
            });
          });

          this.$message.success(`成功拆分 ${uniqueNumbers.length} 个号码`);
          this.manualSplitDialogVisible = false;
        } catch (error) {
          console.error("手动拆分异常:", error);
          this.$message.error("手动拆分失败");
        } finally {
          // 关闭loading
          this.manualSplitLoading = false;
        }
      }, 100);
    },

    // 清空订单详情
    clearOrderDetails() {
      this.$confirm("确认清空订单列表吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formData.order_details = [];
          this.$message({
            type: "success",
            message: "已清空订单列表",
          });
        })
        .catch(() => {
          // 用户取消操作
        });
    },
  },
};
</script>

<style scoped>
/* 订单编辑弹窗样式 */
.order-dialog {
  display: flex;
  flex-direction: column;
  margin-top: 2% !important;
}

.order-dialog ::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 auto !important;
  max-height: calc(100vh - 30px);
}

.order-dialog ::v-deep .el-dialog__body {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.dialog-table-container {
  max-width: 100%;
  overflow-x: auto;
}

.dialog-table-container ::v-deep .el-table {
  width: 100%;
  min-width: 800px;
}

@media screen and (max-width: 768px) {
  .order-dialog ::v-deep .el-dialog {
    width: 95% !important;
    max-height: calc(100vh - 20px);
  }

  .order-dialog ::v-deep .el-dialog__body {
    max-height: calc(100vh - 150px);
  }
}
</style>