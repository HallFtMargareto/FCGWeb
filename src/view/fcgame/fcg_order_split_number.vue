<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="getChartData">

        <el-form-item label="期号">
          <el-select v-model="chartIssueId" placeholder="请选择期号" @change="getChartData" clearable>
            <el-option v-for="item in lotteryIssueList" :key="item.ID" :label="item.issue_no" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="彩票类型">
          <el-select v-model="game_category" placeholder="彩票类型">
            <el-option label="福彩" value="1"></el-option>
            <el-option label="体彩" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item>
      </searchform>
      <!-- <el-form size="mini" :inline="true" class="btn-form-inline">
        <el-button v-if="userInfo.perm['system.create']" @click="createRow" icon="el-icon-plus"
          type="primary">新增</el-button>
        <el-button v-if="userInfo.perm['system.batch_delete'] && multipleSelection.length > 0"
          @click="handleCommand('remove')" icon="el-icon-delete" type="danger" plain>批量删除</el-button>
        <el-button v-if="userInfo.perm['system.import']" @click="importExcel" icon="el-icon-sell">导入</el-button>
        <el-button v-if="userInfo.perm['system.export']" @click="exportExcel" icon="el-icon-sold-out">导出</el-button>
      </el-form> -->

      <!-- <div class="issue-selector">
        <el-button type="primary" @click="getChartData" :loading="chartLoading">刷新数据</el-button>
      </div> -->
    </div>

    <!-- 图表区域 -->
    <div class="chart-container" style="margin: 20px 0;">
      <div ref="chart" class="chart"
        :style="{ height: '600px', overflowX: 'auto', border: '1px solid #e4e7ed', borderRadius: '12px', padding: '20px', backgroundColor: '#fafafa', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }"
        v-loading="chartLoading">
      </div>
    </div>


    <!-- 数据概览 -->
    <div v-if="chartData" class="data-summary">
      <el-card>
        <div slot="header" class="clearfix">
          <span>数据概览 (期号: {{ chartData.issue_id }})</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">总投注金额:</div>
              <div class="summary-value">{{ chartData.total }} {{ chartData.unit }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">最大值:</div>
              <div class="summary-value" style="color: #91cc75;">{{ chartData.lines.max }} {{ chartData.unit }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">平均值:</div>
              <div class="summary-value" style="color: #fac858;">{{ chartData.lines.avg }} {{ chartData.unit }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">最小值:</div>
              <div class="summary-value" style="color: #ee6666;">{{ chartData.lines.min }} {{ chartData.unit }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getFcgOrderSplitNumberList
} from "@/api/fcgame/fcg_order_split_number";
import { getFcgLotteryIssueList } from "@/api/fcgame/fcg_lottery_issue";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import * as echarts from 'echarts';
export default {
  name: "fcg_order_split_number",
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: getFcgOrderSplitNumberList,
      openDialog: false,
      dialogTitle: "",
      type: "",
      multipleSelection: [],
      formData: {
        order_id: undefined,
        order_detail_id: undefined,
        bet_number: "",
        split_number: "",
        split_amount: undefined,
        game_type: undefined,
        game_category: undefined,
        issue_id: undefined,
      },
      formRules: {
        order_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        order_detail_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        bet_number: [{ required: true, message: "请填写数据", trigger: "blur" }], split_number: [{ required: true, message: "请填写数据", trigger: "blur" }],
        split_amount: [{ required: true, message: "请选择项目", trigger: "change" }],
        game_type: [{ required: true, message: "请填写数据", trigger: "blur" }], game_category: [{ required: true, message: "请填写数据", trigger: "blur" }], issue_id: [{ required: true, message: "请填写数据", trigger: "blur" }],
      },
      // 图表相关数据
      chartData: null,
      chartLoading: false, // 图表加载状态
      chartIssueId: '',
      chartInstance: null,
      maxValue: 0,
      // 期号列表
      lotteryIssueList: [],
    };
  },
  mounted() {
    // 初始化图表
    this.initChart();
    // 监听窗口大小变化，自动调整图表
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 获取期号列表
    async getLotteryIssueList() {
      try {
        const res = await getFcgLotteryIssueList({ page: 1, pageSize: 100 });
        if (res.code === 0 && res.data && res.data.list) {
          this.lotteryIssueList = res.data.list;
          console.log(this.lotteryIssueList);
          // 获取到列表后默认取第一条期号作为参数
          if (this.lotteryIssueList.length > 0) {
            this.chartIssueId = this.lotteryIssueList[0].issue_id
            this.getChartData()
          }
          console.log(this.chartIssueId)
        }
      } catch (error) {
        console.error('获取期号列表失败:', error);
        this.$message.error('获取期号列表失败');
      }
    },

    // 初始化图表
    initChart() {
      if (this.$refs.chart) {
        this.chartInstance = echarts.init(this.$refs.chart);
        // 设置默认配置
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              const data = params[0];
              return `${data.name}: ${data.value}元`;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '投注金额'
          },
          series: [{
            data: [],
            type: 'bar',
            itemStyle: {
              color: '#5470c6'
            }
          }]
        };
        this.chartInstance.setOption(option);

        // 为柱状图添加点击事件
        this.chartInstance.on('click', (params) => {
          console.log('点击的柱条数据:', params);
          // 可以在这里添加更多的交互逻辑，例如显示详细信息等
        });
      }
      window.addEventListener('resize', this.handleResize);
    },

    // 获取图表数据
    async getChartData() {
      if (!this.chartIssueId) {
        this.$message.warning('请输入期号');
        return;
      }
      this.chartLoading = true;
      try {
        const res = await getFcgOrderSplitNumberList({ issue_id: this.chartIssueId });
        if (res.code === 0 && res.data) {
          this.chartData = res.data;
          this.renderChart();
        } else {
          this.chartData = null;
          this.$message.error(res.msg || '获取数据失败');
        }
      } catch (error) {
        this.chartData = null;
        this.$message.error('获取数据失败');
        console.error('获取图表数据失败:', error);
      } finally {
        this.chartLoading = false;
      }
    },

    // 渲染图表
    renderChart() {
      if (!this.chartInstance || !this.chartData) return;

      const { x, series, lines, unit } = this.chartData;

      // 计算最大值，用于设置Y轴范围
      this.maxValue = Math.max(...series);

      const option = {
        backgroundColor: '#fff', // 设置图表背景色
        textStyle: {
          fontSize: 12,
          color: '#333'
        },
        title: {
          text: '拆分号码统计',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        legend: {
          data: ['出现次数'],
          top: '10%',
          // 在小屏幕上调整图例位置
          left: 'center',
          textStyle: {
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            const data = params[0];
            return `${data.name}<br/>${data.value} ${unit}`;
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '2%',  // 减少左边距
          right: '5%',
          bottom: '15%',  // 增加底部边距，为X轴标签留出更多空间
          top: '10%', // 增加顶部边距以适应标题和图例
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: x,
          axisLabel: {
            rotate: 0, // 将X轴标签从斜体改为正常显示
            // 当数据量大时，调整标签显示间隔
            interval: 0, // 显示所有标签
            color: '#666' // 设置X轴标签颜色
          },
          // 当数据量大时启用滚动条
          axisPointer: {
            type: 'shadow'
          },
          splitLine: {
            show: false, // 默认不显示X轴网格线
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: `投注金额（${unit}）`,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e0e0e0' // 设置网格线颜色
            }
          },
          max: this.maxValue, // 调整Y轴最大值为数据最大值，使显示更贴近实际数据
          // 当数据量大时，调整Y轴标签显示间隔
          axisLabel: {
            formatter: function (value) {
              if (value >= 10000) {
                return (value / 10000) + 'w';
              } else if (value >= 1000) {
                return (value / 1000) + 'k';
              }
              return value;
            },
            color: '#666' // 设置Y轴标签颜色
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            // 当数据量大时，默认只显示前30个数据点
            start: 0,
            end: 3, // 默认显示数据
            height: 30, // 设置dataZoom高度
            bottom: 30, // 调整dataZoom距离底部的距离，使其更靠近图表
            fillerColor: 'rgba(167, 183, 204, 0.4)', // 设置选中区域的颜色
            borderColor: '#ddd', // 设置边框颜色
            textStyle: {
              color: '#333'
            }
          },
          // 添加inside类型的dataZoom，支持鼠标滚轮缩放和拖拽
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            end: 100
          }
        ],
        series: [{
          data: series,
          type: 'bar',
          barWidth: '20%',  // 设置固定柱条宽度为20像素
          barGap: '20%',    // 设置柱条间隔
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ]),
            borderRadius: [4, 4, 0, 0]  // 添加圆角效果
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 1, color: '#188df0' }
              ]),
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          },
          // 添加数据标签
          label: {
            show: false,
            position: 'top',
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          }
        }],
        // 添加参考线
        markLine: {
          silent: true,
          lineStyle: {
            type: 'dashed',
            width: 1
          },
          data: [
            {
              yAxis: lines.max,
              lineStyle: {
                color: '#91cc75'
              },
              label: {
                formatter: `最大值: ${lines.max}${unit}`,
                position: 'insideEndTop',
                color: '#91cc75',
                fontSize: 12
              }
            },
            {
              yAxis: lines.avg,
              lineStyle: {
                color: '#fac858'
              },
              label: {
                formatter: `平均值: ${lines.avg}${unit}`,
                position: 'insideEndTop',
                color: '#fac858',
                fontSize: 12
              }
            },
            {
              yAxis: lines.min,
              lineStyle: {
                color: '#ee6666'
              },
              label: {
                formatter: `最小值: ${lines.min}${unit}`,
                position: 'insideEndTop',
                color: '#ee6666',
                fontSize: 12
              }
            }
          ]
        }
      };

      this.chartInstance.setOption(option, true); // 使用 true 参数避免合并配置
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();

        // 根据屏幕宽度调整图表配置
        const chartWidth = this.$refs.chart.offsetWidth;
        const option = {
          xAxis: {
            axisLabel: {
              // 在小屏幕上进一步调整标签显示间隔
              interval: (index) => {
                if (this.chartData && this.chartData.x.length > 50) {
                  if (chartWidth < 768) {
                    // 在小屏幕上每隔10个显示一个标签
                    return index % 10 === 0;
                  } else {
                    // 在大屏幕上每隔5个显示一个标签
                    return index % 5 === 0;
                  }
                }
                return true;
              }
            }
          }
        };

        this.chartInstance.setOption(option);
      }
    },

    onQuery() {
      this.summary = {};
      this.showSummary = false;

      this.page = 1
      this.pageSize = 10
      this.getTableData()
    },
  },

  async created() {
    await this.getLotteryIssueList();
  }
};
</script>

<style scoped>
.chart-container {
  margin: 20px 0;
}

.chart {
  width: 100%;
  min-height: 400px;
}

.issue-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 20px;
}

.data-summary {
  margin: 20px 0;
}

.summary-item {
  text-align: center;
  padding: 10px 0;
}

.summary-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
}
</style>
