<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="onQuery">
        <el-form-item label="业务单号">
          <el-input v-model="searchInfo.order_no" placeholder="业务单号" clearable></el-input>
        </el-form-item>

        <el-form-item label="用户账号">
          <el-input v-model="searchInfo.user_name" placeholder="用户账号" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="searchInfo.nick_name" placeholder="用户名称" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="期号ID">
          <el-input v-model="searchInfo.issue_id" placeholder="期号ID" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="期号">
          <el-input v-model="searchInfo.issue_no" placeholder="冗余的期号，便于查询" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="追号组ID（若属于追号则有值）">
          <el-input v-model="searchInfo.trace_id" placeholder="追号组ID（若属于追号则有值）" clearable></el-input>
        </el-form-item> -->


        <!-- <el-form-item label="若为组合/拆单的顶层单，可记录父ID">
          <el-input v-model="searchInfo.parent_order_id" placeholder="若为组合/拆单的顶层单，可记录父ID" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="原始内容">
          <el-input v-model="searchInfo.bet_content" placeholder="原始内容" clearable></el-input>
        </el-form-item>


        <el-form-item label="投注数量">
          <el-input v-model.number="searchInfo.bet_count" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="投注金额">
          <el-input v-model="searchInfo.bet_amount" placeholder="投注总金额" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="倍数">
          <el-input v-model.number="searchInfo.multiple" placeholder="请输入" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="订单状态" prop="order_status">
          <el-select v-model="searchInfo.order_status" placeholder="请选择">
            <el-option label="待支付" value="0"></el-option>
            <el-option label="待开奖" value="1"></el-option>
            <el-option label="已开奖" value="2"></el-option>
            <el-option label="已取消" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付状态" prop="pay_status">
          <el-select v-model="searchInfo.pay_status" placeholder="请选择">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="支付失败" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付渠道">
          <el-input v-model="searchInfo.pay_channel" placeholder="支付渠道(余额/微信/支付宝/第三方)" clearable></el-input>
        </el-form-item>


        <el-form-item label="支付流水号">
          <el-input v-model="searchInfo.transaction_id" placeholder="支付流水号" clearable></el-input>
        </el-form-item>


        <el-form-item label="支付时间">
          <datepicker v-model="searchInfo.payment_time" type="datetime" placeholder="选择日期" style="width: 100%"
            clearable />
        </el-form-item>



        <el-form-item label="中奖总金额">
          <el-input v-model="searchInfo.win_amount" placeholder="中奖总金额" clearable></el-input>
        </el-form-item>



        <!-- <el-form-item label="派奖状态（0=未派奖,1=待派奖,2=派奖中,3=已派奖,4=派奖失败）" prop="award_status">
          <el-select v-model="searchInfo.award_status" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item> -->


        <!-- <el-form-item label="实际派奖时间">
          <datepicker v-model="searchInfo.award_time" type="datetime" placeholder="选择日期" style="width: 100%"
            clearable />
        </el-form-item> -->


        <el-form-item label="撤单类型" prop="cancel_type">
          <el-select v-model="searchInfo.cancel_type" placeholder="请选择">
            <el-option label="用户取消" :value="0"></el-option>
            <el-option label="系统超时" :value="1"></el-option>
            <el-option label="风控" :value="2"></el-option>
            <el-option label="人工" :value="3"></el-option>
          </el-select>
        </el-form-item>


        <!-- <el-form-item label="退款金额（分）">
          <el-input v-model="searchInfo.refund_amount" placeholder="退款金额（分）" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="退款状态" prop="refund_status">
          <el-select v-model="searchInfo.refund_status" placeholder="请选择">
            <el-option label="无退款" :value="0"></el-option>
            <el-option label="退款中" :value="1"></el-option>
            <el-option label="已退款" :value="2"></el-option>
            <el-option label="退款失败" :value="3"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="下单来源">
          <el-input v-model="searchInfo.source" placeholder="下单来源(APP,WEB,第三方渠道等)" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="clientIp">
          <el-input v-model="searchInfo.client_ip" placeholder="clientIp" clearable></el-input>
        </el-form-item> -->



        <!-- <el-form-item label="deviceId">
          <el-input v-model="searchInfo.device_id" placeholder="deviceId" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="风控分">
          <el-input v-model.number="searchInfo.risk_score" placeholder="请输入" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="乐观/悲观锁标志（简易）" prop="is_locked">
          <el-select v-model="searchInfo.is_locked" placeholder="请选择">
            <el-option key="true" label="是" value="true"></el-option>
            <el-option key="false" label="否" value="false"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="乐观锁版本号(更新时+1)">
          <el-input v-model.number="searchInfo.version" placeholder="请输入" clearable></el-input>
        </el-form-item> -->



        <!-- <el-form-item label="扩展字段（备用）">
          <el-input v-model="searchInfo.ext" placeholder="扩展字段（备用）" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="创建时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <!-- <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button> -->
        <!-- <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button> -->
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form>
    </div>

    <!-- 订单卡片列表 -->
    <div class="order-list">
      <el-card v-for="order in tableData" :key="order.ID" class="order-card" shadow="hover">
        <!-- 订单头部信息 -->
        <div class="order-header">
          <div class="order-title">
            <span class="order-no">订单号：{{ order.order_no }}</span>
            <div class="order-status-group">
              <el-tag :type="getOrderStatusType(order.order_status)" size="mini">
                {{ getOrderStatusText(order.order_status) }}
              </el-tag>
              <el-tag :type="getPayStatusType(order.pay_status)" size="mini">
                {{ getPayStatusText(order.pay_status) }}
              </el-tag>
            </div>
          </div>
          <div class="order-meta">
            <span class="order-time">{{ formatTimestamp(order.created_at) }}</span>
            <span class="order-amount">¥{{ (order.bet_amount / 100).toFixed(2) }}</span>
          </div>
        </div>

        <!-- 订单内容 -->
        <div class="order-content">
          <el-row :gutter="20">
            <!-- 左侧：基础信息 -->
            <el-col :xs="24" :sm="12" :md="8">
              <div class="info-section">
                <h4 class="section-title">基础信息</h4>
                <div class="info-item">
                  <span class="label">用户：</span>
                  <span class="value">{{ order.user ? order.user.nickname || order.user.username : order.username
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="label">投注内容：</span>
                  <span class="value">{{ order.bet_content }}</span>
                </div>
                <div class="info-item">
                  <span class="label">期号：</span>
                  <span class="value">{{ order.issue_no_display || order.issue_no }}</span>
                </div>
                <div class="info-item">
                  <span class="label">投注数量：</span>
                  <span class="value">{{ order.bet_count }}</span>
                </div>
                <div class="info-item">
                  <span class="label">总投金额：</span>
                  <span class="value">¥{{ (order.bet_amount / 100).toFixed(2) }}</span>
                </div>
              </div>
            </el-col>

            <!-- 中间：支付信息 -->
            <el-col :xs="24" :sm="12" :md="8">
              <div class="info-section">
                <h4 class="section-title">支付信息</h4>
                <div class="info-item">
                  <span class="label">支付渠道：</span>
                  <span class="value">{{ order.pay_channel }}</span>
                </div>
                <div class="info-item">
                  <span class="label">支付时间：</span>
                  <span class="value">{{ formatTimestamp(order.payment_time) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">交易流水：</span>
                  <span class="value">{{ order.transaction_id }}</span>
                </div>
                <div class="info-item">
                  <span class="label">来源：</span>
                  <span class="value">{{ order.source }}</span>
                </div>
              </div>
            </el-col>

            <!-- 右侧：奖金信息 -->
            <el-col :xs="24" :sm="12" :md="8">
              <div class="info-section">
                <h4 class="section-title">奖金信息</h4>
                <div class="info-item">
                  <span class="label">中奖金额：</span>
                  <span class="value" :class="{ 'win-amount': order.win_amount > 0 }">
                    ¥{{ (order.win_amount / 100).toFixed(2) }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">派奖状态：</span>
                  <el-tag :type="order.award_status ? 'success' : 'info'" size="mini">
                    {{ order.award_status ? '已派奖' : '未派奖' }}
                  </el-tag>
                </div>
                <div class="info-item">
                  <span class="label">派奖时间：</span>
                  <span class="value">{{ formatTimestamp(order.award_time) }}</span>
                </div>
                <div class="info-item" v-if="order.refund_amount > 0">
                  <span class="label">退款金额：</span>
                  <span class="value">¥{{ (order.refund_amount / 100).toFixed(2) }}</span>
                </div>
              </div>
            </el-col>
          </el-row>

          <!-- 订单明细 -->
          <div class="order-details" v-if="order.order_details && order.order_details.length > 0">
            <h4 class="section-title">投注明细</h4>
            <el-table :data="order.order_details" size="mini" class="details-table">
              <el-table-column prop="seq" label="序号" width="60" align="center"></el-table-column>
              <el-table-column prop="game_category_name" label="游戏类型" width="100"></el-table-column>
              <el-table-column prop="game_type_name" label="玩法" width="120"></el-table-column>
              <el-table-column prop="bet_number" label="投注号码" min-width="100"></el-table-column>
              <el-table-column prop="bet_count" label="注数" width="60" align="center"></el-table-column>
              <el-table-column label="投注金额" width="100" align="right">
                <template slot-scope="scope">
                  ¥{{ (scope.row.bet_amount / 100).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="multiple" label="倍数" width="60" align="center"></el-table-column>
              <el-table-column label="中奖金额" width="100" align="right">
                <template slot-scope="scope">
                  <span :class="{ 'win-amount': scope.row.win_amount > 0 }">
                    ¥{{ (scope.row.win_amount / 100).toFixed(2) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="中奖状态" width="80" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.win_flag ? 'success' : 'info'" size="mini">
                    {{ scope.row.win_flag ? '中奖' : '未中' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 订单操作按钮 -->
        <div class="order-actions">
          <el-button v-if="userInfo.perm['system.update']" @click="editRow(order)" type="text" size="small"
            icon="el-icon-edit">
            编辑
          </el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="确定要删除这个订单吗？" @confirm="deleteRow(order)" v-if="userInfo.perm['system.delete']">
            <el-button type="text" size="small" icon="el-icon-delete" slot="reference" class="danger-btn">
              删除
            </el-button>
          </el-popconfirm>
        </div>
      </el-card>

      <!-- 无数据状态 -->
      <div v-if="!tableData || tableData.length === 0" class="empty-state">
        <el-empty description="暂无订单数据">
          <el-button type="primary" @click="getTableData">刷新数据</el-button>
        </el-empty>
      </div>
    </div>

    <!-- class="pagination-container" -->
    <div>
      <!-- 数据合计,按需求启用 -->
      <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
      <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]"
        :style="{ float: 'right', padding: '20px' }" :total="total" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
    </div>

    <uploadexcel ref="uploadexcel" action="FcgOrder"></uploadexcel>
  </div>
</template>

<script>
import {
  createFcgOrder,
  deleteFcgOrder,
  updateFcgOrder,
  findFcgOrder,
  getFcgOrderList,
  batchFcgOrderOperation,
  getFcgOrderSummary,
} from "@/api/fcgame/fcg_order";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import { formatTimeToStr } from "@/utils/date";
export default {
  name: "fcg_order",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        order_no: "",
        user_id: undefined,
        issue_id: undefined,
        issue_no: "",
        trace_id: undefined,
        parent_order_id: undefined,
        bet_content: "",
        bet_count: undefined,
        bet_amount: undefined,
        multiple: undefined,
        order_status: true,
        pay_status: true,
        pay_channel: "",
        transaction_id: "",
        win_amount: undefined,
        award_status: true,
        cancel_type: true,
        refund_amount: undefined,
        refund_status: true,
        source: "",
        client_ip: "",
        device_id: "",
        risk_score: undefined,
        is_locked: true,
        version: undefined,
        ext: "",

      },
      formRules: {
        order_no: [{ required: true, message: "请填写数据", trigger: "blur" }],
        user_id: [{ required: true, message: "请选择项目", trigger: "change" }],

        issue_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        issue_no: [{ required: true, message: "请填写数据", trigger: "blur" }],
        trace_id: [{ required: true, message: "请选择项目", trigger: "change" }],

        parent_order_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        bet_content: [{ required: true, message: "请填写数据", trigger: "blur" }], bet_count: [{ required: true, message: "请填写数据", trigger: "blur" }],
        bet_amount: [{ required: true, message: "请选择项目", trigger: "change" }],
        multiple: [{ required: true, message: "请填写数据", trigger: "blur" }],
        order_status: [{ required: true, message: "请选择项目", trigger: "change" }],

        pay_status: [{ required: true, message: "请选择项目", trigger: "change" }],
        pay_channel: [{ required: true, message: "请填写数据", trigger: "blur" }], transaction_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
        payment_time: [{ required: true, message: "请选择项目", trigger: "change" }],

        win_amount: [{ required: true, message: "请选择项目", trigger: "change" }],

        award_status: [{ required: true, message: "请选择项目", trigger: "change" }],

        award_time: [{ required: true, message: "请选择项目", trigger: "change" }],

        cancel_type: [{ required: true, message: "请选择项目", trigger: "change" }],

        refund_amount: [{ required: true, message: "请选择项目", trigger: "change" }],

        refund_status: [{ required: true, message: "请选择项目", trigger: "change" }],
        source: [{ required: true, message: "请填写数据", trigger: "blur" }], client_ip: [{ required: true, message: "请填写数据", trigger: "blur" }], device_id: [{ required: true, message: "请填写数据", trigger: "blur" }], risk_score: [{ required: true, message: "请填写数据", trigger: "blur" }],
        is_locked: [{ required: true, message: "请选择项目", trigger: "change" }],
        version: [{ required: true, message: "请填写数据", trigger: "blur" }], ext: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 格式化时间戳为标准时间格式
    formatTimestamp(timestamp) {
      if (!timestamp || timestamp === "0001-01-01 00:00:00") return '';
      // 如果是时间戳（数字），转换为毫秒
      const time = typeof timestamp === 'number' ? timestamp * 1000 : timestamp;
      return formatTimeToStr(time, "yyyy-MM-dd hh:mm:ss");
    },
    // 获取订单状态类型
    getOrderStatusType(status) {
      const statusMap = {
        0: 'warning', // 待支付
        1: 'info',    // 待开奖  
        2: 'success', // 已开奖
        3: 'danger'   // 已取消
      };
      return statusMap[status] || 'info';
    },
    // 获取订单状态文本
    getOrderStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '待开奖',
        2: '已开奖',
        3: '已取消'
      };
      return statusMap[status] || '未知';
    },
    // 获取支付状态类型
    getPayStatusType(status) {
      const statusMap = {
        0: 'info',    // 未支付
        1: 'success', // 已支付
        2: 'danger'   // 支付失败
      };
      return statusMap[status] || 'info';
    },
    // 获取支付状态文本
    getPayStatusText(status) {
      const statusMap = {
        0: '未支付',
        1: '已支付',
        2: '支付失败'
      };
      return statusMap[status] || '未知';
    },
    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1
      this.pageSize = 10
      this.getTableData()
    },
    createRow() {
      this.formData = {};
      this.type = "create";
      this.dialogTitle = "创建";
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑";
      const res = await findFcgOrder({ ID: row.ID });
      if (res.code == 0) {
        this.formData = res.data.refcg_order;
        this.openDialog = true;
      }
    },
    async deleteRow(row) {
      const res = await deleteFcgOrder({ ID: row.ID });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "删除成功"
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
          res = await createFcgOrder(this.formData);
          break;
        case "update":
          res = await updateFcgOrder(this.formData);
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
          message: "操作成功"
        })
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCommand(command) {
      this.$confirm('是否要执行批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = [];
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: "warning",
            message: "请选择需要操作的数据",
          });
          return;
        }
        this.multipleSelection && this.multipleSelection.map((item) => {
          ids.push(item.ID);
        });

        const res = await batchFcgOrderOperation({
          ids,
          'command': command
        });
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.getTableData();
        }
      })
    },
    sortChange(row) {
      //自定义排序要设置两个属性prop="field-name" sortable="custom"
      this.orderField = row.prop;
      this.orderType = this.directionMap[row.order] || "";
      this.getTableData();
    },
    async getSummaryList() {
      const res = await getFcgOrderSummary(this.searchInfo);
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
      this.searchInfo.action = "fcg_order";
      await this.$api.getExcel(this.searchInfo);
    },
  },
  async created() {
    await this.getTableData();
  }
};
</script>

<style scoped>
/* 搜索区域样式 */
.search-term {
  padding: 20px;
  background-color: #f5f7fa;
  margin-bottom: 20px;
  border-radius: 8px;
}

.btn-form-inline {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

/* 订单列表样式 */
.order-list {
  margin: 20px 0;
}

.order-card {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.order-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-no {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.order-status-group {
  display: flex;
  gap: 8px;
}

.order-meta {
  text-align: right;
  color: #606266;
}

.order-time {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

.order-amount {
  font-size: 18px;
  font-weight: 600;
  color: #e6a23c;
}

/* 信息区域 */
.info-section {
  background-color: #fafbfc;
  padding: 15px;
  border-radius: 8px;
  height: 100%;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #909399;
  font-weight: 500;
  min-width: 70px;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
  text-align: right;
  flex: 1;
  word-break: break-all;
}

.win-amount {
  color: #67c23a !important;
  font-weight: 600;
}

/* 订单明细 */
.order-details {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.details-table {
  margin-top: 15px;
  border-radius: 6px;
  overflow: hidden;
}

.details-table .el-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  font-size: 12px;
}

.details-table .el-table td {
  font-size: 12px;
}

/* 操作按钮 */
.order-actions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.order-actions .el-button--text {
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.order-actions .el-button--text:hover {
  background-color: #f5f7fa;
}

.danger-btn {
  color: #f56c6c !important;
}

.danger-btn:hover {
  background-color: #fef0f0 !important;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 分页样式 */
.el-pagination {
  margin-top: 30px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .order-meta {
    text-align: left;
    width: 100%;
  }

  .info-section {
    margin-bottom: 15px;
  }

  .order-actions {
    text-align: left;
  }
}

/* 搜索表单优化 */
.search-term .el-form-item {
  margin-bottom: 18px;
}

.search-term .el-form-item__label {
  font-weight: 600;
  color: #606266;
}

/* 标签样式优化 */
.el-tag {
  border-radius: 12px;
  font-weight: 500;
}

/* 卡片头部样式优化 */
.el-card__header {
  padding: 20px;
}

.el-card__body {
  padding: 20px;
}
</style>
