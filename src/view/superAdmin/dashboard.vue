<template>
  <el-container style="height: 100vh; background-color: #f0f2f5">
    <el-main>
      <el-row :gutter="20" class="welcome-banner" style="
          background-color: #409eff;
          color: white;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          background-image: url(https://dgzyx.cn/static/banner5.png);
          background-position: left;
        ">
        <el-col :span="2">
          <el-avatar :size="80" src="https://dgzyx.cn/static/logo.png"></el-avatar>
        </el-col>
        <el-col :span="16">
          <h2>{{ getGreeting() }}，欢迎使用{{ siteInfo.site_name }}</h2>
          <p>福彩游戏管理平台，提供专业的福彩投注服务，实现从投注下单到开奖派奖的一站式福彩业务管理。</p>
        </el-col>
        <el-col :span="6">
          <div style="text-align: right">
            <!-- <img src="https://dgzyx.cn/static/banner5.png" alt="Banner Image"
              style="max-height: 80px; border-radius: 5px" /> -->
          </div>
        </el-col>
      </el-row>

      <!-- 待处理投注 -->
      <el-row :gutter="20">
        <el-col :span="24" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          ">
          <h3 style="margin: 0">待处理投注</h3>
          <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" size="small" style="width: 150px">
          </el-date-picker>
        </el-col>

        <el-col :span="4">
          <el-card shadow="hover" style="color: #e6a23c" body-style="text-align: center;">
            <i class="el-icon-position" style="font-size: 32px; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">
              {{ total.RechargingTotalOrder }}
            </div>
            <div style="font-size: 12px; color: #909399">待开奖</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card style="color: #e6a23c" shadow="hover" body-style="text-align: center;">
            <i class="el-icon-loading" style="font-size: 32px; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">
              {{ total.AwaitTotalOrder }}
            </div>
            <div style="font-size: 12px; color: #909399">待支付</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card style="color: #e6a23c" shadow="hover" body-style="text-align: center;">
            <i class="el-icon-stopwatch" style="font-size: 32px; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">
              {{ total.DelaySubmitTotalOrder }}
            </div>
            <div style="font-size: 12px; color: #909399">支付失败</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card style="color: #e6a23c" shadow="hover" body-style="text-align: center;">
            <i class="el-icon-video-pause" style="font-size: 32px; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">
              {{ total.HoldTotalOrder }}
            </div>
            <div style="font-size: 12px; color: #909399">已撤单</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card style="color: #e6a23c" shadow="hover" body-style="text-align: center;">
            <i class="el-icon-circle-close" style="font-size: 32px; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">
              {{ total.FailHoldTotalOrder }}
            </div>
            <div style="font-size: 12px; color: #909399">退款中</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card style="color: #e6a23c" shadow="hover" body-style="text-align: center;">
            <i class="el-icon-warning-outline" style="font-size: 32px; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">
              {{ total.UnknownTotalOrder }}
            </div>
            <div style="font-size: 12px; color: #909399">异常订单</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 今日投注信息 -->
      <el-row :gutter="20">
        <el-col :span="24" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          ">
          <h3 style="margin: 0">今日投注信息</h3>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>全部投注</span>
            </div>
            <div class="odcard" style="color: rgb(64, 158, 255)">
              <div>
                <div class="odfont">¥{{ formattedVal(day.TotalAmount) }}</div>
                <div class="odesc">投注金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ day.SuccTotalDenomination }}
                </div>
                <div class="odesc">投注注数</div>
              </div>
              <div>
                <div class="odfont">
                  {{ day.TotalOrder }}
                </div>
                <div class="odesc">投注笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>已开奖</span>
            </div>
            <div class="odcard" style="color: #67c23a">
              <div>
                <div class="odfont">
                  ¥{{ formattedVal(day.SuccTotalAmount) }}
                </div>
                <div class="odesc">投注金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ day.SuccTotalDenomination }}
                </div>
                <div class="odesc">投注注数</div>
              </div>
              <div>
                <div class="odfont">
                  {{ day.SuccTotalOrder }}
                </div>
                <div class="odesc">投注笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>中奖投注</span>
            </div>
            <div class="odcard" style="color: #f56c6c">
              <div>
                <div class="odfont">
                  ¥{{ formattedVal(day.FailTotalAmount) }}
                </div>
                <div class="odesc">中奖金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ day.FailTotalDenomination }}
                </div>
                <div class="odesc">中奖注数</div>
              </div>
              <div>
                <div class="odfont">
                  {{ day.FailTotalOrder }}
                </div>
                <div class="odesc">中奖笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 全部投注信息 -->
      <el-row :gutter="20">
        <el-col :span="24" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          ">
          <h3 style="margin: 0">全部投注信息</h3>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>全部投注</span>
            </div>
            <div class="odcard" style="color: rgb(64, 158, 255)">
              <div>
                <div class="odfont">¥{{ formattedVal(total.TotalAmount) }}</div>
                <div class="odesc">投注金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.SuccTotalDenomination }}
                </div>
                <div class="odesc">投注注数</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.TotalOrder }}
                </div>
                <div class="odesc">投注笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>已开奖</span>
            </div>
            <div class="odcard" style="color: #67c23a">
              <div>
                <div class="odfont">
                  ¥{{ formattedVal(total.SuccTotalAmount) }}
                </div>
                <div class="odesc">投注金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.SuccTotalDenomination }}
                </div>
                <div class="odesc">投注注数</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.SuccTotalOrder }}
                </div>
                <div class="odesc">投注笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>中奖投注</span>
            </div>
            <div class="odcard" style="color: #f56c6c">
              <div>
                <div class="odfont">
                  ¥{{ formattedVal(total.FailTotalAmount) }}
                </div>
                <div class="odesc">中奖金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.FailTotalDenomination }}
                </div>
                <div class="odesc">中奖注数</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.FailTotalOrder }}
                </div>
                <div class="odesc">中奖笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- <el-col :span="6">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>充值中订单</span>
            </div>
            <div class="odcard" style="color: #0cf">
              <div>
                <div class="odfont">¥{{ total.RechargingTotalAmount }}</div>
                <div class="odesc">交易金额</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.RechargingTotalDenomination }}
                </div>
                <div class="odesc">交易面值</div>
              </div>
              <div>
                <div class="odfont">
                  {{ total.RechargingTotalOrder }}
                </div>
                <div class="odesc">订单数量</div>
              </div>
            </div>
          </el-card>
        </el-col> -->
      </el-row>

      <!-- 中奖派奖 -->
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="6">
          <el-card shadow="hover">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
              <div>
                <div style="font-size: 20px; font-weight: bold; color: #67c23a">
                  {{ formattedVal(total.TotalWinAmount || 0) }}
                </div>
                <div style="font-size: 12px; color: #909399">总中奖金额</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card shadow="hover">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
              <div>
                <div style="font-size: 20px; font-weight: bold; color: #e6a23c">
                  {{ total.TotalUsers || 0 }}
                </div>
                <div style="font-size: 12px; color: #909399">总用户数</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card shadow="hover">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
              <div>
                <div style="font-size: 20px; font-weight: bold; color: #409eff">
                  {{ total.ActiveUsers || 0 }}
                </div>
                <div style="font-size: 12px; color: #909399">活跃用户</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card shadow="hover">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
              <div>
                <div style="font-size: 20px; font-weight: bold; color: #f56c6c">
                  {{ total.PendingAwardCount || 0 }}
                </div>
                <div style="font-size: 12px; color: #909399">待派奖笔数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// import { getSysRechargeOrderDashboard } from "@/api/recharge/recharge_order";
import { mapGetters } from "vuex";
export default {
  name: "DashboardPage",
  data() {
    return {
      day: {},
      total: {},
      selectedDate: new Date(), // 模拟日期选择
    };
  },
  computed: {
    ...mapGetters("common", ["siteInfo"]),
  },
  methods: {
    formattedVal(val) {
      return (val / 10000).toFixed(2);
    },
    getGreeting() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 6 && hour < 12) {
        return "上午好";
      } else if (hour >= 12 && hour < 18) {
        return "下午好";
      } else {
        return "晚上好";
      }
    }
  },
  async created() {
    // const res = await getSysRechargeOrderDashboard();
    // this.day = res.data.day;
    // this.total = res.data.total;
    // console.log(this.day, this.total);
  },
};
</script>

<style scoped>
.odcard {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.odfont {
  font-size: 24px;
  font-weight: bold;
}

.oicon {
  font-size: 32px;
  color: #409eff;
  margin-bottom: 10px;
}

.onum {
  font-size: 24px;
  font-weight: bold;
}

.odesc {
  font-size: 12px;
  color: #909399;
}

.amountdesc {
  font-size: 12px;
  color: rgb(144, 147, 153);
}

.admin-box {
  min-height: calc(100vh - 160px);
  background-color: #fff;
  padding: 15px;
  margin: 100px 5px 20px;
  border-radius: 2px;
}

.el-main {
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  overflow: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px 20px 10px 10px;
}

/* 为特定元素添加一些自定义样式，使其更接近图片 */
.welcome-banner p {
  font-size: 14px;
  opacity: 0.8;
}

.el-card {
  border-radius: 5px;
}

.el-card__header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
}

.el-table th,
.el-table td {
  padding: 8px 0;
}

/* 调整卡片间距 */
.el-row {
  /* margin-bottom: 20px; */
  /* 已在 style 中处理 */
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

/* 使得环形进度条旁边的文字更好看 */
.flow-data-card .el-card__body>div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flow-data-card .el-card__body>div>div:first-child {
  flex-grow: 1;
}

/* 模拟图片中的一些特定样式 */
.product-rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.product-rating-item .name {
  display: flex;
  align-items: center;
}

.product-rating-item .name .rank {
  background-color: #f0f2f5;
  color: #909399;
  padding: 2px 6px;
  border-radius: 3px;
  margin-right: 8px;
  font-size: 12px;
}

/* 调整日期选择器和核心指标标题的对齐 */
.el-row>.el-col:first-child>h3 {
  margin-bottom: 0;
  /* 移除h3的默认下边距 */
}
</style>