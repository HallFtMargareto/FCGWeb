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
        ">
        <el-col :span="2">
          <el-avatar :size="80" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
        </el-col>
        <el-col :span="16">
          <h2>下午好，欢迎使用中源信数字分发系统</h2>
          <p>公司深耕通讯行业数字化转型，专业渠道赋能平台，助力企业实现从销售到服务的一站式通讯业务管理。</p>
        </el-col>
        <el-col :span="6">
          <div style="text-align: right">
            <img src="https://via.placeholder.com/200x100?text=Banner+Image" alt="Banner Image"
              style="max-height: 80px; border-radius: 5px" />
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="24" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          ">
          <h3 style="margin: 0">今日订单信息</h3>
          <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" size="small" style="width: 150px">
          </el-date-picker>
        </el-col>
        <el-col :xs="12" :sm="12" :md="4" v-for="item in coreMetrics" :key="item.label" style="margin-bottom: 20px">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{ item.label }}</span>
            </div>
            <div style="font-size: 24px; font-weight: bold">
              {{ item.value }}
            </div>
            <div :style="{
              color: item.trend === 'up' ? 'red' : 'green',
              fontSize: '12px',
            }">
              同比上周 {{ item.percentage }}%
              <i :class="item.trend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <!-- <el-col :span="6">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>总流量(人次)</span>
                        </div>
                        <div style="font-size: 28px; font-weight: bold; color: #333;">601,986,875</div>
                    </el-card>
                </el-col> -->
        <el-col :span="6" v-for="flow in flowData" :key="flow.label">
          <el-card shadow="hover">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              ">
              <div>
                <div>{{ flow.label }}</div>
                <div style="font-size: 20px; font-weight: bold">
                  {{ flow.value }}
                </div>
                <div style="font-size: 12px; color: #909399">
                  占比 {{ flow.percentage }}%
                </div>
              </div>
              <el-progress type="circle" :percentage="flow.percentage" :width="60"></el-progress>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="4">
          <el-card shadow="hover" body-style="text-align: center;">
            <i class="el-icon-s-order" style="font-size: 32px; color: #409eff; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">736</div>
            <div style="font-size: 12px; color: #909399">今日总订单</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" body-style="text-align: center;">
            <i class="el-icon-warning-outline" style="font-size: 32px; color: #e6a23c; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">12</div>
            <div style="font-size: 12px; color: #909399">未完成待办</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" body-style="text-align: center;">
            <i class="el-icon-warning-outline" style="font-size: 32px; color: #e6a23c; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">12</div>
            <div style="font-size: 12px; color: #909399">未完成待办</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" body-style="text-align: center;">
            <i class="el-icon-warning-outline" style="font-size: 32px; color: #e6a23c; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">12</div>
            <div style="font-size: 12px; color: #909399">未完成待办</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" body-style="text-align: center;">
            <i class="el-icon-warning-outline" style="font-size: 32px; color: #e6a23c; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">12</div>
            <div style="font-size: 12px; color: #909399">未完成待办</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" body-style="text-align: center;">
            <i class="el-icon-warning-outline" style="font-size: 32px; color: #e6a23c; margin-bottom: 10px"></i>
            <div style="font-size: 24px; font-weight: bold">12</div>
            <div style="font-size: 12px; color: #909399">未完成待办</div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :md="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <span>月数据趋势</span>
              <el-link icon="el-icon-more" :underline="false"></el-link>
            </div>
            <div>
              支付成功率:
              <span style="font-size: 24px; font-weight: bold">45.82%</span>
            </div>
            <div style="font-size: 12px; color: #909399">
              <span>周同比
                <i class="el-icon-bottom" style="color: green"></i> 6.47%</span>
              <span style="margin-left: 10px">月同比
                <i class="el-icon-top" style="color: red"></i> 6.47%</span>
            </div>
            <div style="font-size: 12px; color: #909399; margin-top: 5px">
              参考线 55%
            </div>
            <div style="
                height: 200px;
                margin-top: 10px;
                background-color: #f9f9f9;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
              ">
              <p style="color: #ccc">柱状图区域</p>
            </div>
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card shadow="hover" style="margin-bottom: 20px">
            <div slot="header" class="clearfix" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <span>排查代办提示</span>
              <el-link icon="el-icon-more" :underline="false"></el-link>
            </div>
            <div v-for="(item, index) in todos" :key="index" style="
                display: flex;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid #ebeef5;
              ">
              <el-avatar :size="40" :src="item.avatar" style="margin-right: 10px"></el-avatar>
              <div>
                <p style="margin: 0; font-weight: 500">{{ item.title }}</p>
                <p style="margin: 0; font-size: 12px; color: #909399">
                  <i class="el-icon-date"></i> {{ item.date }}
                </p>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover" style="background-color: #409eff; color: white">
            <div slot="header" class="clearfix" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: white;
              ">
              <span>预警提示</span>
              <el-link icon="el-icon-more" :underline="false" style="color: white"></el-link>
            </div>
            <p style="font-size: 16px; margin-bottom: 5px">
              网络流出率高出上月同比 10.23%
            </p>
          </el-card>
        </el-col>

        <el-col :md="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <span>产品销售好评度</span>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link" style="cursor: pointer">
                  近一个月<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>近一周</el-dropdown-item>
                  <el-dropdown-item>近一个月</el-dropdown-item>
                  <el-dropdown-item>近三个月</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div v-for="(product, index) in products" :key="product.name" style="margin-bottom: 15px">
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-bottom: 5px;
                ">
                <span><el-tag size="mini" type="info" style="margin-right: 5px">{{
                  index + 1
                    }}</el-tag>
                  {{ product.name }}</span>
                <span style="color: #909399">{{ product.rating }}%</span>
              </div>
              <el-progress :percentage="product.rating" :show-text="false"></el-progress>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header" class="clearfix" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <span>成员管理</span>
              <div>
                <el-button size="small" icon="el-icon-upload2">批量导出</el-button>
                <el-button type="primary" size="small" icon="el-icon-plus">添加成员</el-button>
              </div>
            </div>
            <el-table :data="members" stripe style="width: 100%">
              <el-table-column label="成员名称" width="180">
                <template slot-scope="scope">
                  <div style="display: flex; align-items: center">
                    <el-avatar :size="30" :src="scope.row.avatar" style="margin-right: 10px"></el-avatar>
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="email" label="邮箱地址"></el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === '成功' ? 'success' : 'danger'" size="small">{{ scope.row.status
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template>
                  <el-button type="text" size="small">操作1</el-button>
                  <el-dropdown trigger="click" size="small">
                    <el-button type="text" size="small">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>操作A</el-dropdown-item>
                      <el-dropdown-item>操作B</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "DashboardPage",
  data() {
    return {
      selectedDate: new Date("2021-08-01"), // 模拟日期选择
      coreMetrics: [
        { label: "交易成功", value: "67", trend: "up", percentage: "8.63" },
        { label: "交易失败", value: "569", trend: "down", percentage: "14.07" },
        { label: "充值中", value: "45", trend: "down", percentage: "23.95" },
        { label: "待充值", value: "366", trend: "up", percentage: "N/A" }, // 图片中无百分比，简化
        { label: "挂起", value: "5639", trend: "up", percentage: "N/A" }, // 图片中无百分比，简化
        // { label: '失败挂起', value: '5639', trend: 'up', percentage: 'N/A' }, // 图片中无百分比，简化
        { label: "未知", value: "5639", trend: "up", percentage: "N/A" }, // 图片中无百分比，简化
      ],
      flowData: [
        { label: "付费流量", value: "370,221,928", percentage: 61.5 },
        { label: "免费流量", value: "180,596,062", percentage: 30 },
        { label: "其他流量", value: "51,168,884", percentage: 8.5 },
        { label: "其他流量", value: "51,168,884", percentage: 8.5 },
      ],
      todos: [
        {
          avatar: "https://via.placeholder.com/40?text=User",
          title: "未出单数高于近期，请排查出货流程",
          date: "2021-08-01",
        },
        {
          avatar: "https://via.placeholder.com/40?text=User",
          title: "支付率偏低下滑，请排查",
          date: "2021-08-01",
        },
      ],
      products: [
        { name: "图玛思特", rating: 83 },
        { name: "FANATEC", rating: 83 },
        { name: "HORI", rating: 83 },
        { name: "Logitech - Ske...", rating: 83 },
        { name: "PXN装仕达", rating: 83 },
      ],
      members: [
        {
          avatar: "https://via.placeholder.com/40/FF0000/FFFFFF?text=A",
          name: "申泰",
          email: "moylol@laji.cnp",
          status: "成功",
        },
        // 添加更多成员数据...
      ],
    };
  },
};
</script>

<style scoped>
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