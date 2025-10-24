<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="4" @search="onQuery">
        <el-form-item label="彩期">
          <IssueSelect
            v-model="searchInfo.issue_id"
            placeholder="请选择彩期"
            clearable
          ></IssueSelect>
        </el-form-item>

        <el-form-item label="所属组织">
          <TenantSelect
            v-model="searchInfo.tenant_id"
            placeholder="请选择组织"
            clearable
          ></TenantSelect>
        </el-form-item>

        <el-form-item label="会话名称">
          <el-input
            v-model="searchInfo.group_name"
            placeholder="群组名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="投注内容">
          <el-input
            v-model="searchInfo.bet_content"
            placeholder="投注内容"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label=" ">
          <el-button
            v-if="userInfo.perm['system.import']"
            @click="importExcel"
            icon="el-icon-sell"
            >导入</el-button
          >
          <el-button
            v-if="userInfo.perm['system.export']"
            @click="exportExcel"
            icon="el-icon-sold-out"
            >导出</el-button
          >
        </el-form-item>

        <el-form-item label="投注号码">
          <el-input
            v-model="searchInfo.bet_number"
            placeholder="投注号码"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="订单ID">
          <el-input
            v-model="searchInfo.ID"
            placeholder="投注号码"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="识别难度">
          <el-select
            v-model="searchInfo.risk_level"
            placeholder="请选择识别难度"
          >
            <el-option label="容易" value="1"></el-option>
            <el-option label="一般" value="2"></el-option>
            <el-option label="困难" value="3"></el-option>
            <el-option label="极难" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名称">
          <el-input
            v-model="searchInfo.nick_name"
            placeholder="用户名称"
            clearable
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="订单筛选">
          <el-select v-model="activeFilter" @change="filterOrders">
            <el-option label="全部" value="all"></el-option>
            <el-option label="已中奖" value="won"></el-option>
            <el-option label="未中奖" value="lost"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="期号">
          <el-input v-model="searchInfo.issue_no" placeholder="冗余的期号，便于查询" clearable></el-input>
        </el-form-item> -->

        <el-form-item label="投注数量">
          <el-input
            v-model.number="searchInfo.bet_count"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="用户账号">
          <el-input
            v-model="searchInfo.user_name"
            placeholder="用户账号"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="业务单号">
          <el-input
            v-model="searchInfo.order_no"
            placeholder="业务单号"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="投注金额">
          <el-input
            v-model="searchInfo.bet_amount"
            placeholder="投注总金额"
            clearable
          ></el-input>
        </el-form-item>

        <!-- <el-form-item label="订单状态" prop="order_status">
          <el-select v-model="searchInfo.order_status" placeholder="请选择">
            <el-option label="待识别" value="0"></el-option>
            <el-option label="识别失败" value="1"></el-option>
            <el-option label="识别成功" value="2"></el-option>
            <el-option label="未中奖" value="3"></el-option>
            <el-option label="已中奖" value="3"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="支付状态" prop="pay_status">
          <el-select v-model="searchInfo.pay_status" placeholder="请选择">
            <el-option label="未支付" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="支付失败" value="2"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="支付渠道">
          <el-input v-model="searchInfo.pay_channel" placeholder="支付渠道(余额/微信/支付宝/第三方)" clearable></el-input>
        </el-form-item>

        <el-form-item label="支付流水号">
          <el-input v-model="searchInfo.transaction_id" placeholder="支付流水号" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="支付时间">
          <datepicker v-model="searchInfo.payment_time" type="datetime" placeholder="选择日期" style="width: 100%"
            clearable />
        </el-form-item> -->

        <el-form-item label="中奖总金额">
          <el-input
            v-model="searchInfo.win_amount"
            placeholder="中奖总金额"
            clearable
          ></el-input>
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

        <!-- <el-form-item label="撤单类型" prop="cancel_type">
          <el-select v-model="searchInfo.cancel_type" placeholder="请选择">
            <el-option label="用户取消" :value="0"></el-option>
            <el-option label="系统超时" :value="1"></el-option>
            <el-option label="风控" :value="2"></el-option>
            <el-option label="人工" :value="3"></el-option>
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="退款金额（分）">
          <el-input v-model="searchInfo.refund_amount" placeholder="退款金额（分）" clearable></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="退款状态" prop="refund_status">
          <el-select v-model="searchInfo.refund_status" placeholder="请选择">
            <el-option label="无退款" :value="0"></el-option>
            <el-option label="退款中" :value="1"></el-option>
            <el-option label="已退款" :value="2"></el-option>
            <el-option label="退款失败" :value="3"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="下单来源">
          <el-input
            v-model="searchInfo.source"
            placeholder="下单来源(APP,WEB,第三方渠道等)"
            clearable
          ></el-input>
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

        <el-form-item label="开始时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>
    </div>

    <!-- 订单状态标签页 -->
    <div>
      <el-row :gutter="24">
        <el-col :span="7">
          <!-- 订单状态标签页 -->
          <el-tabs v-model="statusTabState" @tab-click="handleStatusTabClick">
            <el-tab-pane label="全部订单" name="all"></el-tab-pane>
            <!-- <el-tab-pane label="待识别" name="0"></el-tab-pane> -->
            <el-tab-pane label="识别失败" name="1"></el-tab-pane>
            <el-tab-pane label="识别成功" name="2"></el-tab-pane>
            <el-tab-pane label="未中奖" name="3"></el-tab-pane>
            <el-tab-pane label="已中奖" name="4"></el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="4">
          <!-- 订单状态标签页 -->
          <el-tabs v-model="mark_state" @tab-click="handleMarkStateTabClick">
            <el-tab-pane label="全部状态" name="all"></el-tab-pane>
            <el-tab-pane label="未标记" name="1"></el-tab-pane>
            <el-tab-pane label="已标记" name="2"></el-tab-pane>
          </el-tabs>
        </el-col>

        <el-col :span="13">
          <!-- 玩法类型标签页 -->
          <el-tabs v-model="tabState" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in gameTypes"
              :key="item.value"
              :label="item.label"
              :name="String(item.value)"
            ></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div>
      <el-row :gutter="24">
        <el-col :span="4" v-if="statusTabState === '1'">
          <el-button icon="el-icon-s-unfold" @click="openBatchEditDialog"
            >批量编辑</el-button
          >
        </el-col>
        <el-col :span="statusTabState === '1' ? 20 : 24">
          <!-- 数据合计,按需求启用 -->
          <!-- <el-button v-if="userInfo.perm['system.summary']" @click="getSummaryList">合计</el-button> -->
          <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :style="{ float: 'right', padding: '0' }"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            background
          ></el-pagination>
        </el-col>
      </el-row>
    </div>

    <!-- table -->
    <div class="card-container" v-if="groupedTableData">
      <div
        v-if="!groupedTableData || groupedTableData.length === 0"
        class="empty-state"
      >
        暂无订单数据
      </div>

      <el-card
        v-for="(orderGroup, index) in groupedTableData"
        :key="index"
        class="order-card"
        shadow="hover"
      >
        <div class="card-title">
          <div class="left-content">
            <span style="margin-right: 5px"
              >【{{ orderGroup.group_name }}】</span
            >
            <span style="margin-right: 5px">{{ orderGroup.user_info }} :</span>
            <span class="chat-content">{{ orderGroup.chat_content }}</span>
          </div>
          <div class="right-content">
            <el-button
              @click="infoRow(orderGroup)"
              type="text"
              size="mini"
              icon="el-icon-warning-outline"
            >
              订单信息
            </el-button>
            <el-button
              v-if="userInfo.perm['system.update']"
              @click="editRow(orderGroup)"
              type="text"
              size="mini"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定要撤销这个订单吗？"
              @confirm="deleteRow(orderGroup)"
              v-if="userInfo.perm['system.delete']"
            >
              <el-button
                type="text"
                size="mini"
                icon="el-icon-delete"
                slot="reference"
                style="color: red"
              >
                撤单
              </el-button>
            </el-popconfirm>
          </div>
        </div>
        <div class="card-content">
          <!-- 左侧：订单信息 -->
          <!-- <el-tag size="small"></el-tag> -->
          <div class="left-panel">
            <el-descriptions
              :column="2"
              size="mini"
              border
              :labelStyle="{ width: '100px' }"
            >
              <el-descriptions-item label="ID">{{
                orderGroup.ID
              }}</el-descriptions-item>

              <el-descriptions-item label="总金额">
                <span
                  :style="{
                    fontWeight: 'bold',
                    color: getAmountColor(orderGroup.mark_state),
                  }"
                >
                  ¥ {{ orderGroup.total_bet_amount }}
                </span>
                <el-link
                  :style="{
                    color: orderGroup.mark_state === 2 ? '#67c23a' : '#f56c6c',
                    fontSize: '12px',
                    float: 'right',
                  }"
                  @click="handleMarkClick(orderGroup)"
                >
                  {{ getMarkStateText(orderGroup.mark_state) }}
                </el-link>
              </el-descriptions-item>

              <el-descriptions-item label="识别次数">{{
                orderGroup.version
              }}</el-descriptions-item>
              <el-descriptions-item label="代理佣金"
                >¥ {{ orderGroup.commission }}</el-descriptions-item
              >
              <el-descriptions-item label="识别难度">
                {{ getRiskLevelText(orderGroup.risk_score) }}
              </el-descriptions-item>
              <el-descriptions-item label="总投注">
                {{ orderGroup.total_bet_count }}
              </el-descriptions-item>
              <el-descriptions-item label="识别耗时">{{
                orderGroup.message ? orderGroup.message.llmcons_at : ""
              }}</el-descriptions-item>
              <el-descriptions-item label="期号">{{
                orderGroup.issue_no || orderGroup.issue_no_display
              }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag
                  :type="getOrderStatusType(orderGroup.order_status)"
                  size="mini"
                >
                  {{ getOrderStatusText(orderGroup.order_status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="中奖金额">
                <span :class="{ 'win-amount': orderGroup.win_amount > 0 }">
                  ¥ {{ orderGroup.win_amount }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{
                orderGroup.created_at
              }}</el-descriptions-item>
              <el-descriptions-item label="来源">{{
                orderGroup.source
              }}</el-descriptions-item>
              <el-descriptions-item label="单号">{{
                orderGroup.order_no
              }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 右侧：子订单表格 -->
          <div class="right-panel">
            <el-table
              :data="orderGroup.order_details"
              size="small"
              border
              style="width: 100%"
              highlight-current-row
            >
              <el-table-column
                prop="seq"
                label="序号"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="game_category_name"
                label="游戏类型"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="game_type_name"
                label="玩法"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="bet_number"
                label="投注号码"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div class="bet-number-clear">{{ scope.row.bet_number }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="bet_count"
                label="投注数量"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="bet_amount"
                label="投注金额"
                align="center"
              >
                <template slot-scope="scope">
                  ¥ {{ scope.row.bet_amount }}
                </template>
              </el-table-column>
              <el-table-column
                prop="multiple"
                label="倍投"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="odds"
                label="赔率"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="win_amount"
                label="中奖金额"
                align="center"
              >
                <template slot-scope="scope">
                  <span :class="{ 'win-amount': scope.row.win_amount > 0 }">
                    {{ scope.row.win_amount }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="win_status"
                label="中奖状态"
                align="center"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.win_amount > 0 ? 'danger' : 'info'"
                    size="mini"
                  >
                    {{ scope.row.win_amount > 0 ? "中奖" : "未中奖" }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 订单修改弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="openDialog"
      width="60%"
      @close="handleDialogClose"
      class="order-dialog"
    >
      <el-form
        ref="editForm"
        :model="editFormData"
        label-width="100px"
        size="mini"
      >
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="订单总金额">
              <el-input v-model.number="editFormData.bet_amount" placeholder="请输入订单总金额"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="19">
            <el-form-item label="投注内容">
              <el-input
                type="textarea"
                :rows="5"
                v-model="editFormData.bet_content"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button
              style="margin-left: 5px; margin-top: 10px"
              type="success"
              @click="reidentify(editFormData)"
              size="mini"
              >重新识别</el-button
            >
          </el-col>
        </el-row>

        <div class="dialog-table-container">
          <el-table
            :data="editFormData.order_details"
            border
            style="width: 100%"
            size="mini"
            max-height="400"
            highlight-current-row
          >
            <el-table-column label="游戏类型">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.game_type"
                  placeholder="请选择游戏类型"
                >
                  <el-option
                    v-for="item in gameTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="玩法">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.game_category"
                  placeholder="请选择玩法"
                >
                  <el-option label="福彩" :value="1"></el-option>
                  <el-option label="体彩" :value="2"></el-option>
                  <el-option label="排列三" :value="3"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="投注号码">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.bet_number"
                  placeholder="投注号码"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="注数">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.bet_count"
                  placeholder="注数"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="投注金额">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.bet_amount"
                  placeholder="投注金额"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="倍数">
              <template slot-scope="scope">
                <el-input
                  v-model.number="scope.row.multiple"
                  placeholder="倍数"
                ></el-input>
              </template>
            </el-table-column>

            <!-- <el-table-column label="订单金额">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.order_amount" placeholder="订单金额"></el-input>
              </template>
            </el-table-column> -->

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="removeOrderDetail(scope.$index)"
                  size="mini"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-button
            style="float: right"
            type="primary"
            @click="addOrderDetail"
            size="mini"
            >添加子订单</el-button
          >
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveOrderEdit" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 订单拆分详情弹窗 -->
    <el-dialog
      title="订单信息"
      :visible.sync="orderDetailDialogVisible"
      width="60%"
      center
    >
      <div class="detail-section">
        <h3>投注文本</h3>
        <code>{{ orderDetailData.content }}</code>
      </div>

      <div class="detail-section">
        <h3>投注金额</h3>
        <span>总金额:{{ orderDetailData.total_amount }}</span>
      </div>

      <!-- 显示split数据 -->
      <div
        v-if="orderDetailData.split && orderDetailData.split.length > 0"
        class="detail-section"
      >
        <h3>拆分信息</h3>
        <el-table
          :data="orderDetailData.split"
          size="small"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="bet_number"
            label="投注号码"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="game_category"
            label="彩种"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              {{ getGameCategoryName(scope.row.game_category) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="game_type"
            label="玩法"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              {{ getGameTypeName(scope.row.game_type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="bet_num"
            label="投注数量"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="bet_amount"
            label="投注金额"
            align="center"
          ></el-table-column>
          <el-table-column prop="split_number" label="拆分信息" align="center">
            <template slot-scope="scope">
              <div class="split-numbers">
                {{ scope.row.split_number }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="average_amount"
            label="平均金额"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="split_count"
            label="拆分数量"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="ava_amount" label="单个号码金额" align="center"></el-table-column> -->
        </el-table>
      </div>

      <div class="detail-section">
        <h3>LLM报文</h3>
        <code>{{ orderDetailData.msg }}</code>
      </div>
    </el-dialog>

    <!-- 导入订单弹窗 -->
    <el-dialog
      title="导入订单"
      :visible.sync="importDialogVisible"
      width="50%"
      top="10vh"
    >
      <el-form label-width="100px">
        <el-form-item label="选择会话" required>
          <el-select
            v-model="uploadExtraParams.contactId"
            placeholder="请选择会话"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in contactList"
              :key="item.ID"
              :label="item.nick_name || item.user_name"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择文件">
          <el-button @click="loadFile" icon="el-icon-sell">导入</el-button>
        </el-form-item>

        <uploadexcel
          ref="uploadexcel"
          action="FcgMessage"
          :extraParams="uploadExtraParams"
        ></uploadexcel>
      </el-form>
    </el-dialog>

    <!-- 批量编辑弹窗 -->
    <el-dialog
      title="批量编辑投注内容"
      :visible.sync="batchEditDialogVisible"
      width="70%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <div style="max-height: 60vh; overflow-y: auto">
        <div v-if="batchEditFormData.orders.length === 0" class="empty-state">
          暂无识别失败的订单数据
        </div>
        <div
          v-for="order in batchEditFormData.orders"
          :key="order.id"
          style="
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ebeef5;
            border-radius: 4px;
          "
        >
          <div style="margin-bottom: 8px; font-weight: bold; color: #409eff">
            订单ID: {{ order.id }}
          </div>
          <el-input
            type="textarea"
            :rows="3"
            v-model="order.bet_content"
            placeholder="请输入投注内容"
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchEditDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submitBatchEdit"
          size="small"
          :loading="batchEditLoading"
          >确 定</el-button
        >
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
import { getFcgContactList } from "@/api/fcgame/fcg_contact.js";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import TenantSelect from "@/components/tenant/index.vue";
export default {
  name: "fcg_order",
  components: {
    TenantSelect,
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
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
                    this.getGameCategoryName(detail.game_category)),
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
      uploadExtraParams: {
        contactId: "", // 选中的会话ID
      },

      // 订单详情弹窗相关
      orderDetailDialogVisible: false,
      orderDetailData: {},

      // 导入弹窗相关
      importDialogVisible: false,
      contactList: [], // 会话数据列表
      selectedContact: "", // 选中的会话
      importFile: null, // 选中的文件
      uploadLoading: false, // 上传loading状态

      // 批量编辑弹窗相关
      batchEditDialogVisible: false,
      batchEditLoading: false,
      batchEditFormData: {
        orders: [], // 格式: [{id: xx, bet_content: "xx"}]
      },

      listApi: getFcgOrderList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      activeFilter: "all",
      // 防抖定时器
      searchDebounceTimer: null,
      formData: {},
      // 添加编辑订单相关的数据
      editFormData: {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        order_details: [],
      },
      tabState: "0",
      statusTabState: "all",
      mark_state: "all",
      gameTypes: [
        { value: 0, label: "全部玩法" },
        { value: 1, label: "单选" },
        { value: 2, label: "组三(对子)" },
        { value: 3, label: "组六(无重复)" },
        { value: 4, label: "组六四码" },
        { value: 5, label: "组六五码" },
        { value: 6, label: "组六六码" },
        { value: 7, label: "组六七码" },
        { value: 8, label: "组六八码" },
        { value: 9, label: "组三四码" },
        { value: 10, label: "组三五码" },
        { value: 11, label: "组三六码" },
        { value: 12, label: "组三七码" },
        { value: 13, label: "组三八码" },
        { value: 14, label: "独胆" },
        { value: 15, label: "一码不定位" },
        { value: 16, label: "一码定位" },
        { value: 17, label: "两码不定位(双飞)" },
        { value: 18, label: "两码定位" },
        { value: 19, label: "复试重复号" },
        { value: 20, label: "复试(三不同号)" },
        { value: 21, label: "包对子" },
        { value: 22, label: "包对一" },
        { value: 23, label: "豹子" },
      ],
    };
  },
  methods: {
    handleIssueChange() {
      this.onQuery();
      //  this.$set(this.searchInfo, 'issue_no', issue_no)
      // this.loadData();
    },
    async infoRow(row) {
      const orderId = row.order_id || row.ID;
      const res = await findFcgOrder({ ID: orderId, action: "split_info" });
      console.log(res);
      if (res.code == 0) {
        // 保存订单详情数据
        this.orderDetailData = res.data;
        // 解析msg字段中的JSON字符串
        // this.orderDetailData.parsedMsg = res.data.msg;
        // 显示弹窗
        this.orderDetailDialogVisible = true;
      }
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
      if (numScore >= 0 && numScore <= 20) return "容易";
      if (numScore >= 21 && numScore <= 40) return "一般";
      if (numScore >= 41 && numScore <= 60) return "困难";
      if (numScore >= 61 && numScore <= 100) return "极难";
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
      if (tab.name == 0) {
        this.searchInfo.game_type = undefined;
      } else {
        this.searchInfo.game_type = tab.name;
      }
      this.getTableData();
    },

    // 处理订单状态标签页点击
    handleStatusTabClick(tab) {
      if (tab.name === "all") {
        delete this.searchInfo.order_status;
      } else {
        this.searchInfo.order_status = tab.name;
      }
      this.getTableData();
    },

    // 处理标记状态标签页点击
    handleMarkStateTabClick(tab) {
      if (tab.name === "all") {
        delete this.searchInfo.mark_state;
      } else {
        this.searchInfo.mark_state = tab.name;
      }
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
      } else {
        return "未标记";
      }
    },
    // 处理标记点击事件
    async handleMarkClick(orderGroup) {
      // 只有未标记状态才能点击
      if (orderGroup.mark_state == 2) {
        return;
      }

      try {
        const orderId = orderGroup.order_id || orderGroup.ID;
        const res = await batchFcgOrderOperation({
          command: "mark_order",
          ids: [orderId],
        });

        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "标记成功",
          });
          // 更新本地数据状态
          orderGroup.mark_state = 2;
          // 重新获取数据以确保状态同步
          this.getTableData();
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
      const res = await findFcgOrder({ ID: orderId });
      if (res.code == 0) {
        // 构造编辑表单数据
        const order = res.data.refcg_order;
        this.editFormData = {
          ID: order.ID,
          order_no: order.order_no,
          bet_amount: order.bet_amount,
          bet_content: order.bet_content,
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
        this.openDialog = true;
      }
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
    // 获取游戏类型名称
    getGameCategoryName(categoryId) {
      const categoryMap = {
        1: "福彩",
        2: "体彩",
        3: "排列三",
      };
      return categoryMap[categoryId] || "未知";
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
    async reidentify(row) {
      //重新识别
      const res = await findFcgOrder({
        ID: row.ID,
        bet_content: row.bet_content,
        action: "reidentify",
      });
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "识别成功",
        });
        // 保存订单详情数据
        this.editFormData = res.data.refcg_order;
      }
    },
    // 添加子订单
    addOrderDetail() {
      this.editFormData.order_details.push({
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
      this.editFormData.order_details.splice(index, 1);
    },
    // 保存订单编辑
    async saveOrderEdit() {
      const res = await updateFcgOrder(this.editFormData);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "订单编辑成功",
        });
        this.openDialog = false;
        this.getTableData();
      } else {
        this.$message({
          type: "error",
          message: res.msg || "订单编辑失败",
        });
      }
    },
    // 关闭弹窗时的处理
    handleDialogClose() {
      this.editFormData = {
        ID: undefined,
        order_no: "",
        bet_amount: undefined,
        order_details: [],
      };
    },

    // 导入相关方法
    // 修改导入按钮点击事件，打开弹窗而不是直接选择文件
    importExcel() {
      this.importDialogVisible = true;
      this.loadContactList();
    },
    loadFile() {
      this.$refs.uploadexcel.chooseFile();
    },

    // 加载会话数据列表
    async loadContactList() {
      try {
        const res = await getFcgContactList({ state: 1, pageSize: 10000 });
        if (res.code === 0) {
          this.contactList = res.data.list || [];
        } else {
          this.$message.error("获取会话数据失败");
        }
      } catch (error) {
        console.error("获取会话数据异常:", error);
        this.$message.error("获取会话数据异常");
      }
    },

    // 打开批量编辑弹窗
    async openBatchEditDialog() {
      try {
        // 获取所有识别失败的订单数据
        const searchParams = {
          ...this.searchInfo,
          order_status: "1", // 识别失败
          page: 1,
          pageSize: 1000, // 获取足够多的数据
        };

        const res = await getFcgOrderList(searchParams);
        if (res.code === 0) {
          const failedOrders = res.data.list || [];

          // 格式化数据为批量编辑需要的格式
          this.batchEditFormData.orders = failedOrders.map((order) => ({
            id: order.ID,
            bet_content: order.bet_content || "",
          }));

          this.batchEditDialogVisible = true;
        } else {
          this.$message.error("获取识别失败订单数据失败");
        }
      } catch (error) {
        console.error("获取识别失败订单数据异常:", error);
        this.$message.error("获取识别失败订单数据异常");
      }
    },

    // 提交批量编辑
    async submitBatchEdit() {
      try {
        this.batchEditLoading = true;

        // 验证数据
        if (this.batchEditFormData.orders.length === 0) {
          this.$message.warning("没有需要编辑的订单数据");
          return;
        }

        // 构建提交数据
        const submitData = this.batchEditFormData.orders.map((order) => ({
          id: order.id,
          bet_content: order.bet_content,
        }));

        // 调用批量操作接口
        const res = await batchFcgOrderOperation({
          command: "batch_alter",
          bet_contents: submitData,
          ids: this.batchEditFormData.orders.map((order) => order.id),
        });

        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "批量编辑成功",
          });

          // 关闭弹窗
          this.batchEditDialogVisible = false;

          // 刷新列表数据
          this.getTableData();
        } else {
          this.$message({
            type: "error",
            message: res.msg || "批量编辑失败",
          });
        }
      } catch (error) {
        console.error("批量编辑异常:", error);
        this.$message({
          type: "error",
          message: "批量编辑异常",
        });
      } finally {
        this.batchEditLoading = false;
      }
    },
  },
  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    console.log(this.searchInfo);
    // 性能监控：记录组件创建时间
    if (process.env.NODE_ENV === "development") {
      console.time("fcg_order component created");
    }

    // 检查URL查询参数中的状态
    const status = this.$route.query.status;
    if (status) {
      // 设置状态标签页
      this.statusTabState = status;
      // 设置搜索条件
      this.searchInfo.order_status = status;
    }
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
