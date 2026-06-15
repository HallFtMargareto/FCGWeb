<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">
        <el-form-item label="期号">
          <IssueSelect v-model="searchInfo.issue_id" placeholder="请选择期号" clearable></IssueSelect>
        </el-form-item>

        <template v-if="userInfo.perm['host']">
          <el-form-item label="所属组织">
            <TenantSelect v-model="searchInfo.tenant_ids" placeholder="请选择组织" :autoSelectFirst="false" :multiple="true"
              clearable></TenantSelect>
          </el-form-item>
        </template>

        <el-form-item label="所属会话">
          <FcgContactSelect v-model="searchInfo.session_id" :tenant-id="searchInfo.tenant_id"
            :tenant-ids="searchInfo.tenant_ids" cache-key-prefix="fcg_order_contact_list" />
        </el-form-item>


        <el-form-item label="投注内容">
          <el-input v-model="searchInfo.bet_content" placeholder="投注内容" clearable></el-input>
        </el-form-item>

        <el-form-item label="彩票类型">
          <GCategory v-model.number="searchInfo.game_category" placeholder="请输入游戏类别" clearable :autoSelectFirst="false">
          </GCategory>
        </el-form-item>

        <el-form-item label="订单ID">
          <el-input v-model="searchInfo.ID" placeholder="订单ID" clearable></el-input>
        </el-form-item>

        <template v-if="userInfo.perm['host']">
          <el-form-item label="投注号码">
            <el-input v-model="searchInfo.bet_number" placeholder="投注号码" clearable></el-input>
          </el-form-item>

          <el-form-item label="识别难度">
            <el-select v-model="searchInfo.risk_level" placeholder="请选择识别难度">
              <el-option label="容易" value="1"></el-option>
              <el-option label="一般" value="2"></el-option>
              <el-option label="困难" value="3"></el-option>
              <el-option label="极难" value="4"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="用户名称">
            <el-input v-model="searchInfo.nick_name" placeholder="用户名称" clearable></el-input>
          </el-form-item>

          <el-form-item label="投注数量">
            <el-input v-model.number="searchInfo.bet_count" placeholder="请输入" clearable></el-input>
          </el-form-item>

          <!-- <el-form-item label="用户账号">
            <el-input
              v-model="searchInfo.user_name"
              placeholder="用户账号"
              clearable
            ></el-input>
          </el-form-item> -->

          <!-- <el-form-item label="业务单号">
            <el-input
              v-model="searchInfo.order_no"
              placeholder="业务单号"
              clearable
            ></el-input>
          </el-form-item> -->

          <el-form-item label="投注金额">
            <el-input v-model="searchInfo.bet_amount" placeholder="投注总金额" clearable></el-input>
          </el-form-item>

          <el-form-item label="中奖金额">
            <el-input v-model="searchInfo.win_amount" placeholder="中奖金额" clearable></el-input>
          </el-form-item>

          <!-- <el-form-item label="下单来源">
            <el-input
              v-model="searchInfo.source"
              placeholder="下单来源(APP,WEB,第三方渠道等)"
              clearable
            ></el-input>
          </el-form-item> -->

          <el-form-item label="开始时间">
            <datepicker v-model="searchInfo.startTime" type="datetime" />
          </el-form-item>
          <el-form-item label="结束时间">
            <datepicker v-model="searchInfo.endTime" type="datetime" />
          </el-form-item>
        </template>

        <el-form-item label="排序方式">
          <el-select v-model="searchInfo.sort_num" placeholder="请选择订单排序方式">
            <el-option label="投注金额从大到小" value="2"></el-option>
            <el-option label="中奖金额从大到小" value="3"></el-option>
            <el-option label="投注数量从大到小" value="4"></el-option>
            <el-option label="发送顺序" value="1"></el-option>
            <el-option label="发送顺序-倒序" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="导入导出">
          <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
          <el-button v-if="userInfo.perm['fcg_order.export']" @click="exportExcel"
            icon="el-icon-sold-out">导出</el-button>
        </el-form-item>

        <el-form-item label="获取详情">
          <el-select v-model="orderDetailState" placeholder="获取订单详情">
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
      </searchform>
    </div>

    <!-- 订单状态标签页 -->
    <div>
      <el-row :gutter="24">
        <el-col :span="8">
          <!-- 订单状态标签页 -->
          <el-tabs v-model="statusTabState" @tab-click="handleStatusTabClick">
            <el-tab-pane label="全部订单" name="all"></el-tab-pane>
            <el-tab-pane label="识别失败" name="1"></el-tab-pane>
            <el-tab-pane label="识别成功" name="2"></el-tab-pane>
            <el-tab-pane label="已中奖" name="4"></el-tab-pane>
            <el-tab-pane label="未中奖" name="3"></el-tab-pane>
            <el-tab-pane label="待识别" name="100"></el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="8">
          <!-- 订单标记状态标签页 -->
          <el-tabs v-model="mark_state" @tab-click="handleMarkStateTabClick">
            <el-tab-pane label="全部状态" name="all"></el-tab-pane>
            <el-tab-pane label="未标记" name="1"></el-tab-pane>
            <el-tab-pane label="已标记" name="2"></el-tab-pane>
            <el-tab-pane label="自动标记" name="3"></el-tab-pane>
            <!-- <el-tab-pane label="已转出" name="11"></el-tab-pane> -->
            <el-tab-pane label="AI标记" name="5"></el-tab-pane>
            <el-tab-pane label="最近标记" name="10"></el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="8">
          <!-- 玩法类型标签页 -->
          <el-tabs v-model="tabState" @tab-click="handleClick">
            <el-tab-pane v-for="item in gameTypes" :key="item.value" :label="item.label"
              :name="String(item.value)"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div>
      <el-row :gutter="24">
        <el-col :span="6" v-if="statusTabState === '1' || statusTabState === '2' || mark_state === '1'">
          <el-button @click="toggleSelectAll">{{
            isAllSelected ? "取消全选" : "全选"
          }}</el-button>

          <el-button v-if="statusTabState === '1'" icon="el-icon-s-unfold" @click="openBatchEditDialog">
            批量编辑
          </el-button>

          <el-button v-if="(statusTabState === '1' || statusTabState === '2')" icon="el-icon-delete"
            @click="handleBatchDelete" :disabled="multipleSelection.length === 0"
            class="batch-operation-btn">批量撤单</el-button>

          <el-button v-if="mark_state === '1'" @click="handleBatchMark" :disabled="multipleSelection.length === 0">
            批量标记
          </el-button>
        </el-col>
        <el-col :span="(statusTabState === '1' || statusTabState === '2' || mark_state === '1') ? 18 : 24">
          <!-- 数据合计,按需求启用 -->
          <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
          <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
            :style="{ float: 'right', padding: '0' }" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- table -->
    <div class="card-container" v-if="groupedTableData">
      <div v-if="!groupedTableData || groupedTableData.length === 0" class="empty-state">
        暂无订单数据
      </div>

      <el-card v-for="(orderGroup, index) in groupedTableData" :key="index" class="order-card"
        :class="{ selected: orderGroup.selected }" shadow="hover">
        <!-- 订单选择框 -->
        <div class="card-checkbox" v-if="statusTabState === '1' || statusTabState === '2' || mark_state === '1'">
          <el-checkbox v-model="orderGroup.selected" @change="handleOrderSelectionChange(orderGroup)"></el-checkbox>
        </div>
        <!-- 订单功能区 -->
        <div class="card-title">
          <div class="left-content">
            <span style="margin-right: 5px">【{{ orderGroup.group_name }}】</span>
            <span style="margin-right: 5px">{{ orderGroup.user_info }} :</span>
            <span class="chat-content">{{ orderGroup.chat_content }}</span>
          </div>
          <div class="right-content">
            <!-- <el-button type="text" size="mini" icon="el-icon-s-promotion"
              v-if="statusTabState === 'all' || statusTabState === '2'">
              立即转出
            </el-button> -->
            <el-button type="text" size="mini" icon="el-icon-error" @click="handleMarkFailClick(orderGroup)">
              标记失败
            </el-button>

            <el-button @click="infoRow(orderGroup)" type="text" size="mini" icon="el-icon-warning-outline"
              v-if="userInfo.perm['host']">
              订单信息
            </el-button>
            <el-button v-if="
              userInfo.perm['fcg_order.update'] && orderGroup.order_status > 0
            " @click="editRow(orderGroup)" type="text" size="mini" icon="el-icon-edit">
              编辑
            </el-button>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
              title="确定要撤销这个订单吗？" @confirm="deleteRow(orderGroup)" v-if="userInfo.perm['fcg_order.delete']">
              <el-button type="text" size="mini" icon="el-icon-delete" slot="reference" style="color: red">
                撤单
              </el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="card-content">
          <!-- 左侧：订单信息 -->
          <!-- <el-tag size="small"></el-tag> -->
          <div class="left-panel">
            <el-descriptions :column="2" size="mini" border :labelStyle="{ width: '100px' }">
              <el-descriptions-item label="ID">{{
                orderGroup.ID
              }}</el-descriptions-item>

              <el-descriptions-item label="总金额">
                <span :style="{
                  fontWeight: 'bold',
                  color: getAmountColor(orderGroup.mark_state),
                }">
                  ¥ {{ orderGroup.total_bet_amount }}
                </span>
                <el-link :style="{
                  color: orderGroup.mark_state === 2 ? '#67c23a' : '#f56c6c',
                  fontSize: '12px',
                  float: 'right',
                }" @click="handleMarkClick(orderGroup)">
                  {{ getMarkStateText(orderGroup.mark_state) }}
                </el-link>
              </el-descriptions-item>

              <el-descriptions-item label="识别次数">{{
                orderGroup.version
              }}</el-descriptions-item>
              <el-descriptions-item label="代理佣金">¥ {{ orderGroup.commission }}</el-descriptions-item>
              <el-descriptions-item label="识别难度">
                {{ getRiskLevelText(orderGroup.risk_score) }}
              </el-descriptions-item>
              <el-descriptions-item label="号码数量">
                {{ orderGroup.order_num }}
              </el-descriptions-item>
              <el-descriptions-item label="识别耗时">{{
                orderGroup.message ? orderGroup.message.llmcons_at : ""
              }}</el-descriptions-item>
              <el-descriptions-item label="投注数量">
                {{ orderGroup.total_bet_count }}
              </el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag :type="getOrderStatusType(orderGroup.order_status)" size="mini">
                  {{ getOrderStatusText(orderGroup.order_status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="中奖金额">
                <span :class="{ 'win-amount': orderGroup.win_amount > 0 }">
                  ¥ {{ orderGroup.win_amount }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="发单时间">{{
                $utils.formatTimeToStr(orderGroup.sort_seq)
              }}</el-descriptions-item>
              <el-descriptions-item label="所属组织">
                {{ getTenantName(orderGroup.tenant_id) }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{
                orderGroup.created_at
                }}</el-descriptions-item>
              <el-descriptions-item label="单号">{{
                orderGroup.order_no
              }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 右侧：子订单表格 -->
          <div class="right-panel">
            <el-table :data="orderGroup.order_details" size="small" border style="width: 100%" highlight-current-row>
              <el-table-column prop="seq" label="序号" align="center" sortable :sort-method="sortBySeq"
                :sort-orders="['ascending', 'descending']"></el-table-column>
              <el-table-column prop="game_category_name" label="游戏类型" align="center" width="80"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="game_type_name" label="玩法" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="bet_number" label="投注号码" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="bet-number-clear">{{ scope.row.bet_number }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="bet_count" label="数量" align="center"></el-table-column>
              <el-table-column prop="bet_amount" label="投注金额" align="center" width="110" sortable
                :sort-method="sortByBetAmount" :sort-orders="['ascending', 'descending']">
                <template slot-scope="scope">
                  ¥ {{ scope.row.bet_amount }}
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="multiple"
                label="倍投"
                align="center"
              ></el-table-column> -->
              <el-table-column prop="odds" label="赔率" align="center"></el-table-column>
              <el-table-column prop="win_amount" label="中奖金额" align="center" width="110" sortable
                :sort-method="sortByWinAmount" :sort-orders="['ascending', 'descending']">
                <template slot-scope="scope">
                  <span :class="{ 'win-amount': scope.row.win_amount > 0 }">
                    {{ scope.row.win_amount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="win_status" label="中奖状态" align="center">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.win_amount > 0 ? 'danger' : 'info'" size="mini">
                    {{ scope.row.win_amount > 0 ? "中奖" : "未中奖" }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>

      <div>
        <el-col span="24">
          <!-- 数据合计,按需求启用 -->
          <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
          <el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
            :style="{ float: 'right', padding: '0' }" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" background>
          </el-pagination>
        </el-col>
      </div>
    </div>

    <!-- 订单修改弹窗 -->
    <OrderEditDialog ref="orderEditDialog" v-model="openDialog" :title="dialogTitle" :gameTypes="gameTypes"
      @success="handleEditSuccess"></OrderEditDialog>

    <!-- 订单拆分详情弹窗 -->
    <OrderDetailDialog ref="orderDetailDialog" v-model="orderDetailDialogVisible" :gameTypes="gameTypes">
    </OrderDetailDialog>

    <!-- 导入订单弹窗 -->
    <ImportOrderDialog ref="importOrderDialog" v-model="importDialogVisible"></ImportOrderDialog>

    <!-- 批量编辑弹窗 -->
    <BatchEditDialog ref="batchEditDialog" v-model="batchEditDialogVisible" :searchInfo="searchInfo"
      @success="handleBatchEditSuccess"></BatchEditDialog>
  </div>
</template>

<script>
import {
  createFcgOrder,
  deleteFcgOrder,
  updateFcgOrder,
  getFcgOrderList,
  batchFcgOrderOperation,
  getFcgOrderSummary,
} from "@/api/fcgame/fcg_order";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import TenantSelect from "@/components/tenant/index.vue";
import FcgContactSelect from "@/components/fcgContactSelect/index.vue";
// 引入新创建的组件
import OrderEditDialog from "./components/OrderEditDialog.vue";
import OrderDetailDialog from "./components/OrderDetailDialog.vue";
import ImportOrderDialog from "./components/ImportOrderDialog.vue";
import BatchEditDialog from "./components/BatchEditDialog.vue";

export default {
  name: "fcg_order",
  components: {
    TenantSelect,
    FcgContactSelect,
    OrderEditDialog,
    OrderDetailDialog,
    ImportOrderDialog,
    BatchEditDialog,
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapGetters("gameInfo", ["tenants"]),
    // 判断是否所有订单都被选中
    isAllSelected() {
      if (!this.groupedTableData || this.groupedTableData.length === 0) {
        return false;
      }
      // 检查是否所有订单都被选中
      return this.groupedTableData.every((order) => order.selected);
    },
    // 处理表格数据，将订单按主订单分组
    groupedTableData() {
      if (!this.tableData || this.tableData.length === 0) {
        return [];
      }

      // 缓存游戏类型和玩法名称，避免重复计算
      const gameCategoryCache = {};
      const gameTypeCache = {};

      return this.tableData.map((order) => {
        const groupName = order.message ? order.message.session_name : "未知群";
        const userInfo = order.user
          ? order.user.nickname || order.user.username
          : order.username || "未知用户";
        const chatContent = order.bet_content || "";

        // 处理子订单数据
        const orderDetails =
          order.order_details && order.order_details.length > 0
            ? order.order_details.map((detail, index) => ({
              ...detail,
              seq: detail.seq || index + 1,
              game_category_name:
                gameCategoryCache[detail.game_category] ||
                (gameCategoryCache[detail.game_category] =
                  this.$utils.getGameCategoryName(detail.game_category)),
              game_type_name:
                gameTypeCache[detail.game_type] ||
                (gameTypeCache[detail.game_type] = this.getGameTypeName(
                  detail.game_type
                )),
              win_status: detail.win_amount > 0 ? "中奖" : "未中奖",
            }))
            : [];

        return {
          ...order,
          group_name: groupName,
          user_info: userInfo,
          chat_content: chatContent,
          issue_no_display: order.issue_no || "",
          total_bet_count: order.bet_count || 0,
          total_bet_amount: order.bet_amount || 0,
          order_details: orderDetails,
        };
      });
    },
  },
  data() {
    return {
      orderDetailState: "1",

      // 弹窗显示状态
      openDialog: false,
      orderDetailDialogVisible: false,
      importDialogVisible: false,
      batchEditDialogVisible: false,

      // 弹窗标题
      dialogTitle: "",

      // 其他数据
      listApi: getFcgOrderList,
      type: "",
      multipleSelection: [],
      activeFilter: "all",
      // 防抖定时器
      searchDebounceTimer: null,
      formData: {},
      tabState: "0",
      statusTabState: "all",
      mark_state: "all",
      gameTypes: [
        { value: 0, label: "全部玩法" },
        { value: 1, label: "直选" },
        { value: 14, label: "独胆" },
        { value: 23, label: "豹子" },
        { value: 2, label: "组三" },
        { value: 3, label: "组六" },
        { value: 4, label: "组六四码" },
        { value: 5, label: "组六五码" },
        { value: 6, label: "组六六码" },
        { value: 7, label: "组六七码" },
        { value: 8, label: "组六八码" },
        { value: 9, label: "组三四码" },
        { value: 24, label: "组三两码" },
        { value: 25, label: "组三三码" },
        { value: 10, label: "组三五码" },
        { value: 11, label: "组三六码" },
        { value: 12, label: "组三七码" },
        { value: 13, label: "组三八码" },
        { value: 16, label: "一码定位" },
        { value: 15, label: "一码不定位" },
        { value: 18, label: "两码定位" },
        { value: 17, label: "两码不定位(双飞)" },
        { value: 19, label: "复试-重复号" },
        { value: 20, label: "复试-不同号" },
        { value: 21, label: "包对子" },
        { value: 22, label: "包对一" },
      ],
    };
  },
  methods: {
    // 保存状态到localStorage
    saveStateToLocalStorage() {
      try {
        const stateToSave = {
          statusTabState: this.statusTabState,
          mark_state: this.mark_state,
          pageSize: this.pageSize,
        };
        localStorage.setItem("fcg_order_state", JSON.stringify(stateToSave));
      } catch (error) {
        console.error("保存状态到localStorage失败:", error);
      }
    },

    // 从localStorage读取状态
    loadStateFromLocalStorage() {
      try {
        const savedState = localStorage.getItem("fcg_order_state");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // 恢复状态
          if (parsedState.statusTabState) {
            this.statusTabState = parsedState.statusTabState;
            // 同时更新搜索条件
            if (parsedState.statusTabState === "all") {
              delete this.searchInfo.order_status;
            } else {
              this.searchInfo.order_status = parsedState.statusTabState;
            }
          }

          if (parsedState.mark_state) {
            this.mark_state = parsedState.mark_state;
            // 同时更新搜索条件
            if (parsedState.mark_state === "all") {
              delete this.searchInfo.mark_state;
            } else {
              this.searchInfo.mark_state = parsedState.mark_state;
            }
          }

          if (parsedState.pageSize) {
            this.pageSize = parsedState.pageSize;
          }
        }
      } catch (error) {
        console.error("从localStorage读取状态失败:", error);
      }
    },
    // 重写handleSizeChange方法，添加localStorage保存功能
    handleSizeChange(val) {
      this.pageSize = val;
      this.saveStateToLocalStorage(); // 保存状态到localStorage
      this.showSummary = false;
      this.getTableData();
    },
    getTenantName(tenantId) {
      if (!tenantId || !this.tenants || this.tenants.length === 0) {
        return "";
      }
      const tenant = this.tenants.find((t) => t.ID === tenantId);
      return tenant ? tenant.platform_name : "";
    },
    handleIssueChange() {
      this.onQuery();
      //  this.$set(this.searchInfo, 'issue_no', issue_no)
      // this.loadData();
    },
    async infoRow(row) {
      const orderId = row.order_id || row.ID;
      // 使用组件的open方法
      this.$refs.orderDetailDialog.open(orderId);
    },
    // 返回顶部功能
    handleBackToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    // 获取风险级别文本
    getRiskLevelText(score) {
      const numScore = parseInt(score) || 0;
      if (numScore >= 0 && numScore <= 40) return "容易";
      if (numScore >= 41 && numScore <= 80) return "一般";
      if (numScore >= 81 && numScore <= 100) return "困难";
      if (numScore >= 100 && numScore <= 10000) return "极难";
      return "未知";
    },

    // 订单筛选功能
    filterOrders(filterType) {
      this.activeFilter = filterType;

      // 清除之前的筛选条件
      delete this.searchInfo.order_status;
      delete this.searchInfo.win_flag;

      // 根据筛选类型设置查询条件
      switch (filterType) {
        case "pending": // 待开奖
          this.searchInfo.order_status = 2;
          break;
        case "opened": // 已开奖
          this.searchInfo.order_status = 3;
          break;
        case "won": // 已中奖
          this.searchInfo.win_flag = 1;
          break;
        case "lost": // 未中奖
          this.searchInfo.win_flag = 0;
          break;
        case "cancelled": // 已撤单
          this.searchInfo.order_status = 4;
          break;
        case "all":
        default:
          // 全部状态，不添加筛选条件
          break;
      }

      // 重置页码并重新获取数据
      this.page = 1;
      this.pageSize = 10;
      this.getTableData();
    },

    handleClick(tab) {
      // 重置页码并重新获取数据
      this.page = 1;
      if (tab.name == 0) {
        this.searchInfo.game_type = undefined;
      } else {
        this.searchInfo.game_type = tab.name;
      }
      this.getTableData();
    },

    // 处理订单状态标签页点击
    handleStatusTabClick(tab) {
      // 重置页码并重新获取数据
      this.page = 1;
      if (tab.name === "all") {
        delete this.searchInfo.order_status;
      } else {
        this.searchInfo.order_status = tab.name;
      }
      this.saveStateToLocalStorage(); // 保存状态到localStorage
      this.getTableData();
    },

    // 处理标记状态标签页点击
    handleMarkStateTabClick(tab) {
      // 重置页码并重新获取数据
      this.page = 1;
      if (tab.name === "all") {
        delete this.searchInfo.mark_state;
      } else {
        this.searchInfo.mark_state = tab.name;
      }
      this.saveStateToLocalStorage(); // 保存状态到localStorage
      this.getTableData();
    },
    // 获取订单状态类型
    getOrderStatusType(status) {
      const statusMap = {
        0: "warning", // 待支付
        1: "warning", //识别失败
        2: "success", //识别成功
        3: "success", // 未中奖
        4: "danger", //已中奖
      };
      return statusMap[status] || "info";
    },
    // 获取订单状态文本
    getOrderStatusText(status) {
      const statusMap = {
        0: "待识别",
        1: "识别失败",
        2: "识别成功",
        3: "未中奖",
        4: "已中奖",
      };
      return statusMap[status] || "待开奖";
    },
    // 获取支付状态类型
    getPayStatusType(status) {
      const statusMap = {
        0: "info", // 未支付
        1: "success", // 已支付
        2: "danger", // 支付失败
      };
      return statusMap[status] || "info";
    },
    // 获取支付状态文本
    getPayStatusText(status) {
      const statusMap = {
        0: "未支付",
        1: "已支付",
        2: "支付失败",
      };
      return statusMap[status] || "已支付";
    },
    // 获取总金额颜色
    getAmountColor(markState) {
      // 值为0、1时显示危险红色，值为2时显示绿色
      if (markState === 0 || markState === 1) {
        return "#f56c6c"; // 危险红色
      } else if (markState === 2) {
        return "#67c23a"; // 绿色
      }
      return "#606266"; // 默认灰色
    },
    // 获取标记状态文字
    getMarkStateText(markState) {
      if (markState === 2) {
        return "已标记";
      } else if (markState == 3) {
        return "自动标记";
      } else if (markState == 4) {
        return "AI标记中...";
      } else if (markState == 5) {
        return "AI标记";
      } else {
        return "未标记";
      }
    },
    // 处理标记点击事件
    async handleMarkClick(orderGroup) {
      // 只有未标记状态才能点击
      if (orderGroup.mark_state == 2 || orderGroup.mark_state == 4) {
        return;
      }

      try {
        const orderId = orderGroup.order_id || orderGroup.ID;
        const res = await batchFcgOrderOperation({
          command: "mark_order",
          ids: [orderId],
        }, { donNotShowLoading: true });

        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "标记成功",
          });
          // 从当前页面删除当前标记的订单元素
          const index = this.tableData.findIndex(item => (item.ID) === orderId);
          if (index !== -1) {
            this.tableData.splice(index, 1);
          }

          // 当页面的订单少于等于2的时候再重新 this.getTableData();
          if (this.tableData.length <= 3) {
            this.getTableData();
          }
        } else {
          this.$message({
            type: "error",
            message: res.msg || "标记失败",
          });
        }
      } catch (error) {
        console.error("标记订单失败:", error);
        this.$message({
          type: "error",
          message: "标记订单失败",
        });
      }
    },
    // 处理标记失败点击事件
    async handleMarkFailClick(orderGroup) {
      try {
        const orderId = orderGroup.order_id || orderGroup.ID;
        const res = await batchFcgOrderOperation({
          command: "mark_order_fail",
          ids: [orderId],
        });

        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "标记失败成功",
          });
          // 更新本地数据状态
          orderGroup.mark_state = 1; // 设置为失败状态
          // 重新获取数据以确保状态同步
          this.getTableData();
        } else {
          this.$message({
            type: "error",
            message: res.msg || "标记失败失败",
          });
        }
      } catch (error) {
        console.error("标记订单失败失败:", error);
        this.$message({
          type: "error",
          message: "标记订单失败失败",
        });
      }
    },
    onQuery() {
      // 清除之前的定时器
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }

      // 设置新的防抖定时器
      this.searchDebounceTimer = setTimeout(() => {
        this.summary = {};
        this.showSummary = false;
        this.page = 1;
        this.pageSize = 10;
        this.getTableData();
      }, 300); // 300ms防抖延迟
    },
    createRow() {
      this.formData = {};
      this.type = "create";
      this.dialogTitle = "创建";
      this.openDialog = true;
    },
    async editRow(row) {
      this.type = "update";
      this.dialogTitle = "编辑订单";
      // 使用订单的原始ID，而不是可能被明细覆盖的ID
      const orderId = row.order_id || row.ID;
      // 使用组件的open方法
      this.$refs.orderEditDialog.open(orderId, this.orderDetailState);
    },
    async deleteRow(row) {
      // 使用订单的原始ID，而不是可能被明细覆盖的ID
      const orderId = row.order_id || row.ID;
      const res = await deleteFcgOrder({ ID: orderId });
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
          message: "操作成功",
        });
        this.$refs.dialog.handleClose();
        this.openDialog = false;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 处理订单选择变化
    handleOrderSelectionChange(orderGroup) {
      // 更新multipleSelection数组
      if (orderGroup.selected) {
        // 如果选中，添加到选择数组
        if (
          !this.multipleSelection.find(
            (item) =>
              (item.order_id || item.ID) ===
              (orderGroup.order_id || orderGroup.ID)
          )
        ) {
          this.multipleSelection.push(orderGroup);
        }
      } else {
        // 如果取消选中，从选择数组中移除
        this.multipleSelection = this.multipleSelection.filter(
          (item) =>
            (item.order_id || item.ID) !==
            (orderGroup.order_id || orderGroup.ID)
        );
      }
    },

    // 清空所有选择
    clearSelections() {
      this.multipleSelection = [];
      // 清空所有订单的选中状态
      if (this.groupedTableData && this.groupedTableData.length > 0) {
        this.groupedTableData.forEach((order) => {
          this.$set(order, "selected", false);
        });
      }
    },

    // 全选/取消全选
    toggleSelectAll() {
      if (!this.groupedTableData || this.groupedTableData.length === 0) {
        return;
      }

      const shouldSelectAll = !this.isAllSelected;

      // 遍历所有订单，设置选中状态
      this.groupedTableData.forEach((order) => {
        this.$set(order, "selected", shouldSelectAll);
      });

      // 更新 multipleSelection 数组
      if (shouldSelectAll) {
        // 全选：将所有订单添加到选择数组
        this.multipleSelection = [...this.groupedTableData];
      } else {
        // 取消全选：清空选择数组
        this.multipleSelection = [];
      }
    },

    // 批量撤单处理方法
    handleBatchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择需要撤单的订单",
        });
        return;
      }

      this.$confirm(
        `确定要撤销选中的 ${this.multipleSelection.length} 个订单吗？`,
        "批量撤单确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          try {
            const ids = this.multipleSelection.map(
              (item) => item.order_id || item.ID
            );
            const res = await batchFcgOrderOperation({
              command: "remove",
              ids: ids,
            });

            if (res.code === 0) {
              this.$message({
                type: "success",
                message: `成功撤销 ${this.multipleSelection.length} 个订单`,
              });
              // 清空选择
              this.clearSelections();
              // 刷新数据
              this.getTableData();
            } else {
              this.$message({
                type: "error",
                message: res.msg || "批量撤单失败",
              });
            }
          } catch (error) {
            console.error("批量撤单异常:", error);
            this.$message({
              type: "error",
              message: "批量撤单异常，请稍后重试",
            });
          }
        })
        .catch(() => {
          // 用户取消操作
          this.$message({
            type: "info",
            message: "已取消批量撤单",
          });
        });
    },

    // 批量标记处理方法
    async handleBatchMark() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择需要标记的订单",
        });
        return;
      }

      try {
        const ids = this.multipleSelection.map(
          (item) => item.order_id || item.ID
        );
        const res = await batchFcgOrderOperation({
          command: "mark_order",
          ids: ids,
        });

        if (res.code === 0) {
          this.$message({
            type: "success",
            message: `成功标记 ${this.multipleSelection.length} 个订单`,
          });
          // 清空选择
          this.clearSelections();
          // 刷新数据
          this.getTableData();
        } else {
          this.$message({
            type: "error",
            message: res.msg || "批量标记失败",
          });
        }
      } catch (error) {
        console.error("批量标记异常:", error);
        this.$message({
          type: "error",
          message: "批量标记异常，请稍后重试",
        });
      }
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
            // 使用订单的原始ID，而不是可能被明细覆盖的ID
            ids.push(item.order_id || item.ID);
          });

        const res = await batchFcgOrderOperation({
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

    // 获取玩法名称
    getGameTypeName(typeId) {
      // 创建缓存对象
      if (!this._gameTypeCache) {
        this._gameTypeCache = {};
      }

      // 如果缓存中存在，直接返回
      if (this._gameTypeCache[typeId] !== undefined) {
        return this._gameTypeCache[typeId];
      }

      // 查找并缓存结果
      const type = this.gameTypes.find((item) => item.value === typeId);
      const result = type ? type.label : "未知";
      this._gameTypeCache[typeId] = result;
      return result;
    },
    sortBySeq(a, b) {
      const seqA = Number(a.seq);
      const seqB = Number(b.seq);
      const safeA = Number.isNaN(seqA) ? 0 : seqA;
      const safeB = Number.isNaN(seqB) ? 0 : seqB;
      return safeA - safeB;
    },
    // 投注金额排序方法
    sortByBetAmount(a, b) {
      const amountA = Number(a.bet_amount);
      const amountB = Number(b.bet_amount);
      const safeA = Number.isNaN(amountA) ? 0 : amountA;
      const safeB = Number.isNaN(amountB) ? 0 : amountB;
      return safeA - safeB;
    },
    // 中奖金额排序方法
    sortByWinAmount(a, b) {
      const amountA = Number(a.win_amount);
      const amountB = Number(b.win_amount);
      const safeA = Number.isNaN(amountA) ? 0 : amountA;
      const safeB = Number.isNaN(amountB) ? 0 : amountB;
      return safeA - safeB;
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
    async exportExcel() {
      this.searchInfo.action = "fcg_order";
      await this.$api.getExcel(this.searchInfo);
    },
    // 处理编辑成功回调
    handleEditSuccess() {
      this.getTableData();
    },

    // 处理批量编辑成功回调
    handleBatchEditSuccess() {
      this.getTableData();
    },

    // 导入相关方法
    // 修改导入按钮点击事件，打开弹窗而不是直接选择文件
    importExcel() {
      this.$refs.importOrderDialog.open();
    },

    // 打开批量编辑弹窗
    openBatchEditDialog() {
      this.$refs.batchEditDialog.open();
    },
  },
  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    // 性能监控：记录组件创建时间
    if (process.env.NODE_ENV === "development") {
      console.time("fcg_order component created");
    }

    // 从localStorage加载保存的状态
    this.loadStateFromLocalStorage();

    // 检查URL查询参数中的状态（优先级高于localStorage）
    const status = this.$route.query.status;
    if (status) {
      // 设置状态标签页
      this.statusTabState = status;
      // 设置搜索条件
      this.searchInfo.order_status = status;
      // 保存到localStorage
      this.saveStateToLocalStorage();
    }
    // 清空选择状态
    this.clearSelections();
    await this.getTableData();
    if (process.env.NODE_ENV === "development") {
      console.timeEnd("fcg_order component created");
    }
  },
  beforeDestroy() {
    // 清理缓存，避免内存泄漏
    if (this._gameTypeCache) {
      this._gameTypeCache = null;
    }

    // 清理防抖定时器
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
  },
};
</script>


<style scoped>
@import "./fcg_order.css";
</style>
