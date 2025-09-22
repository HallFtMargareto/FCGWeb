<template>
  <div>
    <div>
      <el-button-group>
        <el-button class="btg">全部</el-button>
        <el-button class="btg">待开奖</el-button>
        <el-button class="btg">已开奖</el-button>
        <el-button class="btg">已中奖</el-button>
        <el-button class="btg">未中奖</el-button>
        <el-button class="btg">已撤单</el-button>
      </el-button-group>
    </div>

    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">

        <el-form-item label="用户名称">
          <el-input v-model="searchInfo.nick_name" placeholder="用户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="群组名称">
          <el-input v-model="searchInfo.group_name" placeholder="群组名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="投注号码">
          <el-input v-model="searchInfo.bet_number" placeholder="投注号码" clearable></el-input>
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

        <el-form-item label="用户账号">
          <el-input v-model="searchInfo.user_name" placeholder="用户账号" clearable></el-input>
        </el-form-item>

        <el-form-item label="业务单号">
          <el-input v-model="searchInfo.order_no" placeholder="业务单号" clearable></el-input>
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

        <el-form-item label="导出">
          <el-button v-if="userInfo.perm['system.export']" @click="exportExcel"
            icon="el-icon-sold-out">导出EXCEL</el-button>
        </el-form-item>
      </searchform>

      <el-form size="mini" :inline="true" class="btn-form-inline">
        <!-- <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button> -->
        <!-- <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button> -->
      </el-form>
    </div>


    <div>
      <el-tabs v-model="tabState" @tab-click="handleClick">
        <el-tab-pane v-for="item in gameTypes" :key="item.value" :label="item.label"
          :name="String(item.value)"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- Excel风格表格 -->
    <div class="excel-table-container">
      <el-table :data="processedTableData" border class="excel-table" size="mini" :span-method="mergeRows"
        style="width: 100% !important; table-layout: fixed;">
        <!-- 群名 -->
        <el-table-column prop="group_name" label="会话" width="120" align="center">
          <template slot-scope="scope">
            <span class="group-info">{{ scope.row.group_name }}</span>
          </template>
        </el-table-column>

        <!-- 用户 -->
        <el-table-column prop="user_info" label="用户" width="120" align="center">
          <template slot-scope="scope">
            <span class="user-info">{{ scope.row.user_info }}</span>
          </template>
        </el-table-column>

        <!-- 聊天记录 -->
        <el-table-column prop="chat_content" label="聊天记录" width="200" align="center">
          <template slot-scope="scope">
            <div class="chat-content">
              {{ scope.row.chat_content }}
            </div>
          </template>
        </el-table-column>

        <!-- 期号 -->
        <el-table-column prop="issue_no" label="期号" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.issue_no || scope.row.issue_no_display }}
          </template>
        </el-table-column>

        <!-- 序号 -->
        <el-table-column prop="seq" label="序号" width="60" align="center"></el-table-column>

        <!-- 游戏类型 -->
        <el-table-column prop="game_category_name" label="游戏类型" width="120" align="center"></el-table-column>

        <!-- 玩法 -->
        <el-table-column prop="game_type_name" label="玩法" width="150" align="center"></el-table-column>

        <!-- 投注号码 -->
        <el-table-column prop="bet_number" label="投注号码" width="120" align="center">
          <template slot-scope="scope">
            <div class="bet-number-clear">{{ scope.row.bet_number }}</div>
          </template>
        </el-table-column>

        <!-- 注数 -->
        <el-table-column prop="bet_count" label="注数" width="60" align="center"></el-table-column>

        <!-- 投注金额 -->
        <el-table-column prop="bet_amount" label="投注金额" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.single_bet_amount }}
          </template>
        </el-table-column>

        <!-- 倍数 -->
        <el-table-column prop="multiple" label="倍数" width="60" align="center"></el-table-column>

        <!-- 订单金额 -->
        <el-table-column prop="order_amount" label="订单金额" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.order_amount }}
          </template>
        </el-table-column>

        <!-- 中奖金额 -->
        <el-table-column prop="win_amount" label="中奖金额" width="100" align="center">
          <template slot-scope="scope">
            <span :class="{ 'win-amount': scope.row.detail_win_amount > 0 }">
              {{ scope.row.detail_win_amount }}
            </span>
          </template>
        </el-table-column>

        <!-- 中奖状态 -->
        <el-table-column prop="win_status" label="中奖状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.win_flag ? 'success' : 'info'" size="mini">
              {{ scope.row.win_flag ? '中奖' : '未中奖' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 订单状态 -->
        <!-- <el-table-column prop="order_status" label="订单状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="getOrderStatusType(scope.row.order_status)" size="mini">
              {{ getOrderStatusText(scope.row.order_status) }}
            </el-tag>
          </template>
        </el-table-column> -->

        <!-- 中奖总金额 -->
        <el-table-column prop="total_win_amount" label="中奖总金额" width="100" align="center">
          <template slot-scope="scope">
            <span :class="{ 'win-amount': scope.row.total_win_amount > 0 }">
              {{ scope.row.total_win_amount }}
            </span>
          </template>
        </el-table-column>

        <!-- 订单中奖状态 -->
        <!-- <el-table-column prop="order_win_status" label="中奖状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.order_win_amount > 0 ? 'success' : 'info'" size="mini">
              {{ scope.row.order_win_amount > 0 ? '有中奖' : '未中奖' }}
            </el-tag>
          </template>
        </el-table-column> -->

        <el-table-column prop="created_at" label="创建时间" width="160" align="center"></el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row._rowSpan > 0" class="operation-buttons">
              <el-button v-if="userInfo.perm['system.update']" @click="editRow(scope.row)" type="text" size="mini"
                icon="el-icon-edit">
                编辑
              </el-button>
              <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
                title="确定要撤销这个订单吗？" @confirm="deleteRow(scope.row)" v-if="userInfo.perm['system.delete']">
                <el-button type="text" size="mini" icon="el-icon-delete" slot="reference" class="danger-btn">
                  撤单
                </el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 无数据状态 -->
      <div v-if="!tableData || tableData.length === 0" class="empty-state">
        暂无订单数据
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

    <!-- 订单编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="openDialog" width="60%" @close="handleDialogClose"
      class="order-dialog">
      <el-form ref="editForm" :model="editFormData" label-width="100px" size="mini">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="订单总金额">
              <el-input v-model.number="editFormData.bet_amount" placeholder="请输入订单总金额"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <!-- <el-form-item label="投注内容">
              <el-input v-model="editFormData.bet_content" disabled></el-input>
            </el-form-item> -->
            <div style="text-align: center;">{{ editFormData.bet_content }}</div>
          </el-col>
        </el-row>

        <el-row>
          <el-button type="primary" @click="addOrderDetail" size="mini">添加子订单</el-button>
        </el-row>
        <div class="dialog-table-container">
          <el-table :data="editFormData.order_details" border style="width: 100%" size="mini">
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

            <!-- <el-table-column label="订单金额">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.order_amount" placeholder="订单金额"></el-input>
              </template>
            </el-table-column> -->

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="removeOrderDetail(scope.$index)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveOrderEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
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
    // 处理表格数据，将订单明细展开为行数据
    processedTableData() {
      const result = [];
      if (!this.tableData || this.tableData.length === 0) {
        return result;
      }

      this.tableData.forEach(order => {
        const groupName = order.message ? order.message.session_name : '未知群';
        const userInfo = order.user ? (order.user.nickname || order.user.username) : order.username || '未知用户';
        const chatContent = order.bet_content || '';

        if (order.order_details && order.order_details.length > 0) {
          // 有明细的情况
          order.order_details.forEach((detail, index) => {
            result.push({
              ...order,
              ...detail,
              group_name: groupName,
              user_info: userInfo,
              chat_content: chatContent,
              seq: detail.seq || (index + 1),
              single_bet_amount: detail.bet_amount,
              order_amount: detail.bet_amount,
              detail_win_amount: detail.win_amount,
              total_win_amount: order.win_amount,
              order_win_amount: order.win_amount,
              _rowSpan: index === 0 ? order.order_details.length : 0
            });
          });
        } else {
          // 没有明细的情况，显示订单基本信息
          result.push({
            ...order,
            group_name: groupName,
            user_info: userInfo,
            chat_content: chatContent,
            seq: 1,
            game_category_name: '未知',
            game_type_name: '未知',
            bet_number: order.bet_content,
            single_bet_amount: order.bet_amount,
            order_amount: order.bet_amount,
            detail_win_amount: order.win_amount,
            total_win_amount: order.win_amount,
            order_win_amount: order.win_amount,
            win_flag: order.win_amount > 0,
            _rowSpan: 1
          });
        }
      });

      return result;
    }
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
      // 添加编辑订单相关的数据
      editFormData: {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        order_details: []
      },
      tabState: '0',
      gameTypes: [
        { value: 0, label: '全部' },
        { value: 1, label: '单选' },
        { value: 2, label: '组三(对子)' },
        { value: 3, label: '组六(无重复)' },
        { value: 4, label: '组六四码' },
        { value: 5, label: '组六五码' },
        { value: 6, label: '组六六码' },
        { value: 7, label: '组六七码' },
        { value: 8, label: '组六八码' },
        { value: 9, label: '组三四码' },
        { value: 10, label: '组三五码' },
        { value: 11, label: '组三六码' },
        { value: 12, label: '组三七码' },
        { value: 13, label: '组三八码' },
        { value: 14, label: '独胆' },
        { value: 15, label: '一码不定位' },
        { value: 16, label: '一码定位' },
        { value: 17, label: '两码不定位(双飞)' },
        { value: 18, label: '两码定位' },
        { value: 19, label: '复试重复号' },
        { value: 20, label: '复试(三不同号)' },
        { value: 21, label: '包对子' },
        { value: 22, label: '包对一' },
      ]
    };
  },
  methods: {
    // 合并表格行，实现Excel风格的合并单元格
    mergeRows({ row, column }) {
      // 需要合并的列：群名、用户、聊天记录、期号、订单状态、中奖总金额、订单中奖状态
      const mergeColumns = ['group_name', 'user_info', 'chat_content', 'issue_no', 'order_status', 'total_win_amount', 'order_win_status', 'created_at'];

      // 操作列也需要合并
      if (mergeColumns.includes(column.property) || column.label === '操作') {
        if (row._rowSpan > 0) {
          return {
            rowspan: row._rowSpan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },

    handleClick(tab) {
      this.searchInfo.game_type = tab.name;
      this.getTableData();
    },
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
      return statusMap[status] || '待开奖';
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
      return statusMap[status] || '已支付';
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
      this.dialogTitle = "编辑订单";
      const res = await findFcgOrder({ ID: row.ID });
      if (res.code == 0) {
        // 构造编辑表单数据
        const order = res.data.refcg_order;
        this.editFormData = {
          ID: order.ID,
          order_no: order.order_no,
          bet_amount: order.bet_amount,
          bet_content: order.bet_content,
          order_details: order.order_details ? order.order_details.map(detail => {
            return {
              ID: detail.ID,
              game_category: detail.game_category,
              game_type: detail.game_type,
              bet_number: detail.bet_number || '',
              bet_count: Number(detail.bet_count) || 0,
              bet_amount: detail.bet_amount || 0,
              multiple: detail.multiple || 1,
              order_amount: detail.bet_amount * detail.multiple || 0 // 计算订单金额
            };
          }) : []
        };
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
    // 添加子订单
    addOrderDetail() {
      this.editFormData.order_details.push({
        game_category_name: '',
        game_type_name: '',
        bet_number: '',
        bet_count: Number(0),
        bet_amount: 0,
        multiple: 1,
        order_amount: 0
      });
    },
    // 删除子订单
    removeOrderDetail(index) {
      this.editFormData.order_details.splice(index, 1);
    },
    // 保存订单编辑
    async saveOrderEdit() {
      const res = await updateFcgOrder(this.editFormData);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "订单编辑成功"
        });
        this.openDialog = false;
        this.getTableData();
      } else {
        this.$message({
          type: "error",
          message: res.msg || "订单编辑失败"
        });
      }
    },
    // 关闭弹窗时的处理
    handleDialogClose() {
      this.editFormData = {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        order_details: []
      };
    },
  },
  async created() {
    await this.getTableData();
  }
};
</script>

<style scoped>
.btg {
  width: 80px;
  height: 35px;
  border-bottom: none;
  margin-right: 3px !important;
}

.btg {
  width: 80px;
  height: 35px;
  border-bottom: none;
  margin-right: 3px !important;
}

/* 搜索区域样式 */
.search-term {
  padding: 20px 20px 0 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.btn-form-inline {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

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

/* 分页样式 */
.el-pagination {
  margin-top: 30px;
  text-align: right;
}

/* Excel风格表格样式 */
.excel-table-container {
  margin: 20px 0;
  width: 100%;
  overflow-x: auto;
}

.excel-table {
  border-collapse: collapse !important;
  width: 100%;
  font-size: 12px;
  min-width: 100%;
  /* 防止表格太小 */
  max-width: 100%;
  /* 防止表格过宽 */
}

.excel-table .el-table__header th {
  background-color: #f5f7fa;
  color: #303133;
  font-weight: 600;
  font-size: 12px;
  padding: 8px;
  border: 1px solid #e4e7ed;
  text-align: center;
  white-space: nowrap;
}

.excel-table .el-table__body td {
  padding: 6px 8px;
  border: 1px solid #e4e7ed;
  font-size: 12px;
  vertical-align: middle;
}

/* 确保所有列都有边框 */
.excel-table .el-table th,
.excel-table .el-table td {
  border-right: 1px solid #e4e7ed !important;
}

.excel-table .el-table th:last-child,
.excel-table .el-table td:last-child {
  border-right: 1px solid #e4e7ed !important;
}

/* 群信息区域样式 */
.group-info {
  font-weight: 600;
  color: #409eff;
  word-break: break-all;
}

.user-info {
  font-weight: 500;
  color: #606266;
  word-break: break-all;
}

.chat-content {
  max-width: 180px;
  word-break: break-all;
  line-height: 1.4;
  color: #303133;
}

/* 投注号码样式 - 更清晰的显示 */
.bet-number-clear {
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  font-weight: 600;
  background-color: #f0f9ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #1f2937;
  border: 1px solid #e1f5fe;
  word-break: break-all;
  line-height: 1.4;
}

/* 操作按钮区域 */
.operation-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.operation-buttons .el-button {
  margin: 0;
  padding: 4px 8px;
  font-size: 12px;
}

/* 中奖金额样式 */
.win-amount {
  color: #67c23a !important;
  font-weight: 600;
}

/* 文本溢出处理 */
.excel-table .el-table__body td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.excel-table .el-table__body td:hover {
  background-color: #f5f7fa;
}

/* 操作按钮样式 */
.danger-btn {
  color: #f56c6c !important;
}

.danger-btn:hover {
  background-color: #fef0f0 !important;
}

/* 空状态样式 */
.empty-state {
  padding: 60px 0;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

/* 订单编辑弹窗样式 */
.order-dialog {
  display: flex;
  flex-direction: column;
  margin-top: 5%;
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
