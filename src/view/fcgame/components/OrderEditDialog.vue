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
          <el-form-item>
            <span slot="label">
              修改内容
              <el-button style="margin-left: 10px" type="text" size="mini"
                @click="openGenerateNumberDialog">生成号码</el-button>
            </span>
            <el-input type="textarea" :rows="5" v-model="formData.bet_content" style="margin-left: 5px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <div style="padding: 8px 0">
            <span>总数量: {{ totalCount }}</span>
            <span style="margin-left: 20px">金额合计: {{ totalBetAmount }}</span>
          </div>
        </el-col>
        <el-col :span="17" style="text-align: right">
          <span style="margin-right: 2%">
            <el-button size="mini" @click="openDantuoSplitDialog">胆拖拆分</el-button>
          </span>
          <span style="margin-right: 2%">
            <el-button @click="mergePositionNumber" size="mini">定位组合</el-button>
          </span>
          <span style="margin-right: 30%">
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

          <el-table-column label="数量">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.bet_count" placeholder="数量"
                @input="handleBetCountChange(scope.row)"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="投注金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bet_amount" placeholder="投注金额"
                @input="handleBetAmountChange(scope.row)"></el-input>
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
          <!-- <div style="padding: 8px 0">
            <span>总数量: {{ totalCount }}</span>
            <span style="margin-left: 20px">金额合计: {{ totalBetAmount }}</span>
          </div> -->
        </el-col>
        <el-col :span="24">
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

        <el-form-item label="单量" required>
          <el-input v-model.number="manualSplitForm.bet_count" type="number" placeholder="请输入单量"
            @input="handleManualSplitCountChange"></el-input>
        </el-form-item>

        <el-form-item label="金额" required>
          <el-input v-model.number="manualSplitForm.bet_amount" type="number" placeholder="请输入金额"
            @input="handleManualSplitAmountChange"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="manualSplitDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="executeManualSplit" size="small"
          :loading="manualSplitLoading">立即拆分</el-button>
      </span>
    </el-dialog>

    <!-- 定位组合弹窗 -->
    <el-dialog title="定位组合" :visible.sync="positionMergeDialogVisible" width="500px" append-to-body>
      <el-form ref="positionMergeForm" :model="positionMergeForm" label-width="100px" size="small">
        <el-form-item label="玩法" required>
          <el-select v-model="positionMergeForm.game_category" placeholder="请选择玩法" style="width: 100%">
            <el-option label="福彩" :value="1"></el-option>
            <el-option label="体彩" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单量" required>
          <el-input v-model.number="positionMergeForm.bet_count" type="number" placeholder="请输入单量"
            @input="handlePositionMergeCountChange"></el-input>
        </el-form-item>
        <el-form-item label="金额" required>
          <el-input v-model.number="positionMergeForm.bet_amount" type="number" placeholder="请输入每注金额"
            @input="handlePositionMergeAmountChange"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="positionMergeDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="executePositionMerge" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 胆拖拆分弹窗 -->
    <el-dialog title="胆拖拆分" :visible.sync="dantuoSplitDialogVisible" width="500px" append-to-body>
      <el-form ref="dantuoSplitForm" :model="dantuoSplitForm" label-width="100px" size="small">
        <el-form-item label="胆码" required>
          <el-input v-model.trim="dantuoSplitForm.danma" placeholder="请输入胆码，如 9 或 12"></el-input>
        </el-form-item>
        <el-form-item label="拖码" required>
          <el-input v-model.trim="dantuoSplitForm.tuoma" placeholder="请输入拖码，如 123568"></el-input>
        </el-form-item>
        <el-form-item label="单量" required>
          <el-input v-model.number="dantuoSplitForm.bet_count" type="number" placeholder="请输入单量"></el-input>
        </el-form-item>
        <el-form-item label="价格" required>
          <el-input v-model.number="dantuoSplitForm.bet_amount" type="number" placeholder="请输入价格"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dantuoSplitDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="executeDantuoSplit" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 生成号码弹窗 -->
    <el-dialog title="生成号码" :visible.sync="generateNumberDialogVisible" width="400px" append-to-body>
      <el-form ref="generateNumberForm" :model="generateNumberForm" label-width="100px" size="small">
        <el-form-item label="起始号码" required>
          <el-input v-model.trim="generateNumberForm.start_number" maxlength="3" placeholder="如 000"></el-input>
        </el-form-item>
        <el-form-item label="结束号码" required>
          <el-input v-model.trim="generateNumberForm.end_number" maxlength="3" placeholder="如 999"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="generateNumberDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="executeGenerateNumber" size="small">确 定</el-button>
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
        bet_count: 1,
        bet_amount: 2,
      },
      // 手动拆分loading状态
      manualSplitLoading: false,
      // 定位组合弹窗状态
      positionMergeDialogVisible: false,
      // 胆拖拆分弹窗状态
      dantuoSplitDialogVisible: false,
      // 定位组合表单数据
      positionMergeForm: {
        game_category: 1,
        bet_count: 1,
        bet_amount: 2,
      },
      // 胆拖拆分表单数据
      dantuoSplitForm: {
        danma: "",
        tuoma: "",
        game_category: 1,
        bet_count: 1,
        bet_amount: 2,
      },
      // 定位组合数字缓存
      positionMergeDigits: {
        hundreds: [],
        tens: [],
        units: [],
      },
      // 生成号码弹窗状态
      generateNumberDialogVisible: false,
      // 是否已生成过号码（用于判断是否覆盖原内容）
      hasGeneratedNumber: false,
      // 生成号码表单数据
      generateNumberForm: {
        start_number: "",
        end_number: "",
      },
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
    async open(orderId, orderDetailState) {
      try {
        const res = await findFcgOrder({
          ID: orderId,
          orderDetailState: orderDetailState,
        });
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
      this.hasGeneratedNumber = false;
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
        bet_count: 1,
        bet_amount: 2,
      };
      this.manualSplitDialogVisible = true;
    },

    // 打开胆拖拆分弹窗
    openDantuoSplitDialog() {
      const defaultCategory =
        this.formData.order_details && this.formData.order_details.length > 0
          ? this.formData.order_details[0].game_category || 1
          : 1;
      this.dantuoSplitForm = {
        danma: "",
        tuoma: "",
        game_category: defaultCategory,
        bet_count: 1,
        bet_amount: 2,
      };
      this.dantuoSplitDialogVisible = true;
    },

    // 打开生成号码弹窗
    openGenerateNumberDialog() {
      this.generateNumberForm = {
        start_number: "",
        end_number: "",
      };
      this.generateNumberDialogVisible = true;
    },

    // 执行生成号码，将范围内的所有号码填入修改内容文本框
    executeGenerateNumber() {
      const { start_number, end_number } = this.generateNumberForm;

      // 校验输入非空
      if (!start_number || !end_number) {
        this.$message.warning("请输入起始号码和结束号码");
        return;
      }

      // 校验为三位数字
      const isThreeDigit = /^\d{3}$/;
      if (!isThreeDigit.test(start_number) || !isThreeDigit.test(end_number)) {
        this.$message.warning("请输入三位数字号码");
        return;
      }

      const start = parseInt(start_number, 10);
      const end = parseInt(end_number, 10);

      // 校验范围有效
      if (start > end) {
        this.$message.warning("起始号码不能大于结束号码");
        return;
      }

      // 生成从起始到结束的所有号码，不足三位前补零
      const numbers = [];
      for (let i = start; i <= end; i++) {
        numbers.push(String(i).padStart(3, "0"));
      }

      const generated = numbers.join(" ");
      if (this.hasGeneratedNumber) {
        // 非首次生成，追加到新的一行，不覆盖已有内容
        this.formData.bet_content = this.formData.bet_content + "\n" + generated;
      } else {
        // 首次生成，清空原内容后写入
        this.formData.bet_content = generated;
        this.hasGeneratedNumber = true;
      }
      this.$message.success(`成功生成 ${numbers.length} 个号码`);
      this.generateNumberDialogVisible = false;
    },

    // 从输入中提取去重后的数字，保持用户输入顺序
    extractUniqueDigits(rawValue) {
      const digits = (rawValue || "").match(/\d/g) || [];
      return [...new Set(digits)];
    },

    // 从数组中取定长组合
    buildDigitCombinations(sourceDigits, pickCount, start = 0, path = [], result = []) {
      if (path.length === pickCount) {
        result.push([...path]);
        return result;
      }

      for (let i = start; i < sourceDigits.length; i++) {
        path.push(sourceDigits[i]);
        this.buildDigitCombinations(sourceDigits, pickCount, i + 1, path, result);
        path.pop();
      }

      return result;
    },

    // 执行胆拖拆分（组六胆拖转直选）
    executeDantuoSplit() {
      const { danma, tuoma, game_category, bet_count, bet_amount } = this.dantuoSplitForm;
      const danDigits = this.extractUniqueDigits(danma);
      const tuoDigits = this.extractUniqueDigits(tuoma);

      if (danDigits.length === 0) {
        this.$message.warning("请输入胆码");
        return;
      }
      if (tuoDigits.length === 0) {
        this.$message.warning("请输入拖码");
        return;
      }
      if (danDigits.length >= 3) {
        this.$message.warning("组六胆拖最多支持2位胆码");
        return;
      }
      if (!bet_count || Number(bet_count) <= 0) {
        this.$message.warning("请输入有效的单量");
        return;
      }
      if (!bet_amount || Number(bet_amount) <= 0) {
        this.$message.warning("请输入有效的价格");
        return;
      }

      const overlapDigits = danDigits.filter((digit) => tuoDigits.includes(digit));
      if (overlapDigits.length > 0) {
        this.$message.warning("胆码和拖码不能重复");
        return;
      }

      const needFromTuo = 3 - danDigits.length;
      if (tuoDigits.length < needFromTuo) {
        this.$message.warning(`拖码数量不足，至少需要 ${needFromTuo} 位`);
        return;
      }

      const combos = this.buildDigitCombinations(tuoDigits, needFromTuo);
      const betNumbers = combos.map((combo) => `${danDigits.join("")}${combo.join("")}`);

      if (!this.formData.order_details) {
        this.formData.order_details = [];
      }

      const countValue = Number(bet_count);
      const amountValue = Number(bet_amount);

      betNumbers.forEach((betNumber) => {
        this.formData.order_details.push({
          game_category: game_category || 1,
          game_type: 1, // 拆分后写入直选玩法
          bet_number: betNumber,
          bet_count: countValue,
          bet_amount: amountValue,
          multiple: 1,
          order_amount: amountValue,
        });
      });

      this.$message.success(`成功拆分 ${betNumbers.length} 个直选号码`);
      this.dantuoSplitDialogVisible = false;
    },

    // 手动拆分-单量变化
    handleManualSplitCountChange(val) {
      if (val) {
        this.manualSplitForm.bet_amount = val * 2;
      }
    },
    // 手动拆分-金额变化
    handleManualSplitAmountChange(val) {
      if (val) {
        this.manualSplitForm.bet_count = (val % 2 !== 0 || val < 2) ? 1 : val / 2;
      }
    },
    // 定位组合-单量变化
    handlePositionMergeCountChange(val) {
      if (val) {
        this.positionMergeForm.bet_amount = val * 2;
      }
    },
    // 定位组合-金额变化
    handlePositionMergeAmountChange(val) {
      if (val) {
        this.positionMergeForm.bet_count = (val % 2 !== 0 || val < 2) ? 1 : val / 2;
      }
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

          // 预先计算注数和金额
          const betAmount = this.manualSplitForm.bet_amount;
          const betCount = this.manualSplitForm.bet_count;
          const gameCategory = this.manualSplitForm.game_category;
          const gameType = this.manualSplitForm.game_type;

          // 为每个号码创建订单详情并添加到 order_details
          uniqueNumbers.forEach((number) => {
            this.formData.order_details.push({
              game_category: gameCategory,
              game_type: gameType,
              bet_number: number,
              bet_count: betCount,
              bet_amount: betAmount,
              multiple: 1,
              order_amount: betAmount,
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

    // 定位组合
    mergePositionNumber() {
      const content = this.formData.bet_content || "";
      const hundredsMatch = content.match(/百位\s*(\d+)/);
      const tensMatch = content.match(/十位\s*(\d+)/);
      const unitsMatch = content.match(/个位\s*(\d+)/);

      if (!hundredsMatch || !tensMatch || !unitsMatch) {
        this.$message.error("拆分失败，缺少[百位/十位/个位]信息");
        return;
      }

      this.positionMergeDigits.hundreds = hundredsMatch[1].split("");
      this.positionMergeDigits.tens = tensMatch[1].split("");
      this.positionMergeDigits.units = unitsMatch[1].split("");

      this.positionMergeForm.game_category = 1; // 默认福彩
      this.positionMergeForm.bet_count = 1;
      this.positionMergeForm.bet_amount = 2; // 默认2元
      this.positionMergeDialogVisible = true;
    },

    // 执行定位组合
    executePositionMerge() {
      // 检查金额
      if (
        !this.positionMergeForm.bet_amount ||
        this.positionMergeForm.bet_amount <= 0
      ) {
        this.$message.warning("请输入有效的投注金额");
        return;
      }

      const { hundreds, tens, units } = this.positionMergeDigits;
      const amount = Number(this.positionMergeForm.bet_amount);
      const category = this.positionMergeForm.game_category;
      const betCount = this.positionMergeForm.bet_count;

      let count = 0;
      hundreds.forEach((h) => {
        tens.forEach((t) => {
          units.forEach((u) => {
            const betNumber = `${h}${t}${u}`;

            // 添加到 order_details
            if (!this.formData.order_details) {
              this.formData.order_details = [];
            }

            this.formData.order_details.push({
              game_category: category,
              game_type: 1, // 默认为直选
              bet_number: betNumber,
              bet_count: betCount,
              bet_amount: amount,
              multiple: 1, // 默认为1倍
              order_amount: amount,
            });
            count++;
          });
        });
      });

      this.$message.success(`成功生成 ${count} 个号码`);
      this.positionMergeDialogVisible = false;
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

    // 订单详情-数量变化，自动计算金额
    handleBetCountChange(row) {
      const count = Number(row.bet_count);
      if (count > 0) {
        // 按照默认单价2元计算
        row.bet_amount = count * 2;
      }
    },

    // 订单详情-金额变化，自动计算数量
    handleBetAmountChange(row) {
      // 如果输入为空或不是有效数字，不进行计算
      if (row.bet_amount === '' || row.bet_amount === null || row.bet_amount === undefined) {
        return;
      }

      const amount = Number(row.bet_amount);
      if (amount > 0) {
        // 按照默认单价2元计算，无法整除时四舍五入取整，数量最低为1
        const calculatedCount = Math.round(amount / 2);
        row.bet_count = calculatedCount < 1 ? 1 : calculatedCount;
      }
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
