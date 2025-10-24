<template>
  <div>
    <div class="search-term">
      <searchform size="mini" :maxShow="3" @search="getChartData">
        <el-form-item label="彩期">
          <IssueSelect
            v-model="chartIssueId"
            placeholder="请选择彩期"
            clearable
          ></IssueSelect>
        </el-form-item>

        <el-form-item label="所属组织">
          <TenantSelect
            v-model="tenant_id"
            placeholder="请选择组织"
            :autoSelectFirst="false"
            clearable
          ></TenantSelect>
        </el-form-item>

        <el-form-item label="彩票类型">
          <el-select v-model="game_category" placeholder="彩票类型">
            <el-option label="福彩" :value="1"></el-option>
            <el-option label="体彩" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="添加时间">
          <datepicker v-model="searchInfo.startTime" type="datetime" />
        </el-form-item>
        <el-form-item label="结束时间">
          <datepicker v-model="searchInfo.endTime" type="datetime" />
        </el-form-item> -->
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
    <div class="chart-container" style="margin: 20px 0">
      <div
        ref="chart"
        class="chart"
        :style="{
          height: '400px',
          overflowX: 'auto',
          border: '1px solid #e4e7ed',
          borderRadius: '12px',
          padding: '20px',
          backgroundColor: '#fafafa',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }"
        v-loading="chartLoading"
      ></div>
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
              <div class="summary-value">
                {{ chartData.total }} {{ chartData.unit }}
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">最大值:</div>
              <div class="summary-value" style="color: #91cc75">
                {{ chartData.lines.max }} {{ chartData.unit }}
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">平均值:</div>
              <div class="summary-value" style="color: #fac858">
                {{ chartData.lines.avg }} {{ chartData.unit }}
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">最小值:</div>
              <div class="summary-value" style="color: #ee6666">
                {{ chartData.lines.min }} {{ chartData.unit }}
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getFcgOrderSplitNumberList } from "@/api/fcgame/fcg_order_split_number";
import infoList from "@/mixins/infoList";
import { mapGetters } from "vuex";
import * as echarts from "echarts";
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
      // 图表相关数据
      chartData: null,
      chartLoading: false, // 图表加载状态
      chartIssueId: 0,
      tenant_id: null,
      game_category: 1, // 默认福彩
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
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    // 初始化图表
    initChart() {
      if (this.$refs.chart) {
        this.chartInstance = echarts.init(this.$refs.chart);
        // 设置默认配置
        const option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            formatter: function (params) {
              const data = params[0];
              return `${data.name}: ${data.value}元`;
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "10%",
            top: "10%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: [],
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: {
            type: "value",
            name: "投注金额",
          },
          series: [
            {
              data: [],
              type: "bar",
              itemStyle: {
                color: "#5470c6",
              },
            },
          ],
        };
        this.chartInstance.setOption(option);

        // 为柱状图添加点击事件
        this.chartInstance.on("click", (params) => {
          console.log("点击的柱条数据:", params);
          // 可以在这里添加更多的交互逻辑，例如显示详细信息等
        });
      }
      window.addEventListener("resize", this.handleResize);
    },

    // 获取图表数据
    async getChartData() {
      if (this.chartIssueId == 0) {
        this.$message.warning("请输入期号");
        return;
      }
      this.chartLoading = true;
      try {
        const res = await getFcgOrderSplitNumberList({
          game_category: this.game_category,
          issue_id: this.chartIssueId,
          tenant_id: this.tenant_id,
        });
        if (res.code === 0 && res.data) {
          this.chartData = res.data;
          this.renderChart();
        } else {
          this.chartData = null;
          this.$message.error(res.msg || "获取数据失败");
        }
      } catch (error) {
        this.chartData = null;
        this.$message.error("获取数据失败");
        console.error("获取图表数据失败:", error);
      } finally {
        this.chartLoading = false;
      }
    },

    // 渲染图表
    renderChart() {
      if (!this.chartInstance || !this.chartData) return;

      const { x, series, lines, unit } = this.chartData;
      console.log(lines);

      // 计算最大值，用于设置Y轴范围
      let maxValue = 0;
      series.forEach((s) => {
        const maxInSeries = Math.max(...s.data);
        if (maxInSeries > maxValue) maxValue = maxInSeries;
      });
      // 为了让图表显示更美观，给最大值增加一些余量
      this.maxValue = Math.ceil(maxValue * 1.1);

      const option = {
        backgroundColor: "#fff", // 设置图表背景色
        textStyle: {
          fontSize: 12,
          color: "#333",
        },
        title: {
          text: "风控号码统计",
          left: "center",
          top: 0,
          textStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
          },
        },
        legend: {
          data: series.map((s) => s.name),
          top: "3%",
          right: "6%",
          // left: 'right',
          textStyle: {
            color: "#333",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (params) {
            let result = `${params[0].name}<br/>`;
            params.forEach((param) => {
              result += `${param.seriesName}: ${param.value} ${unit}<br/>`;
            });
            return result;
          },
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderColor: "#ccc",
          borderWidth: 1,
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "2%", // 减少左边距
          right: "5%",
          bottom: "15%", // 增加底部边距，为X轴标签留出更多空间
          top: "10%", // 增加顶部边距以适应标题和图例
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: x,
          axisLabel: {
            rotate: 0, // 将X轴标签从斜体改为正常显示
            // 当数据量大时，调整标签显示间隔
            interval: 0, // 显示所有标签
            color: "#666", // 设置X轴标签颜色
          },
          // 当数据量大时启用滚动条
          axisPointer: {
            type: "shadow",
          },
          splitLine: {
            show: true, // 显示X轴网格线
            lineStyle: {
              color: "#e0e0e0",
            },
          },
        },
        yAxis: {
          type: "value",
          name: `金额（${unit}）`,
          splitLine: {
            lineStyle: {
              type: "dashed",
              color: "#e0e0e0", // 设置网格线颜色
            },
          },
          max: this.maxValue, // 调整Y轴最大值为数据最大值，使显示更贴近实际数据
          // 当数据量大时，调整Y轴标签显示间隔
          axisLabel: {
            formatter: function (value) {
              if (value >= 10000) {
                return value / 10000 + "w";
              } else if (value >= 1000) {
                return value / 1000 + "k";
              }
              return value;
            },
            color: "#666", // 设置Y轴标签颜色
          },
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            // 当数据量大时，默认只显示前30个数据点
            start: 0,
            end: 10, // 默认显示数据
            height: 30, // 设置dataZoom高度
            bottom: 20, // 调整dataZoom距离底部的距离，使其更靠近图表
            fillerColor: "rgba(167, 183, 204, 0.4)", // 设置选中区域的颜色
            borderColor: "#ddd", // 设置边框颜色
            textStyle: {
              color: "#333",
            },
          },
          // 添加inside类型的dataZoom，支持鼠标滚轮缩放和拖拽
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 100,
          },
        ],
        series: series.map((s, index) => {
          // 定义颜色数组，按照用户要求指定颜色
          const colors = ["#5070DD", "#B2CD46"];
          const color = colors[index] || "#83bff6"; // 如果索引超出颜色数组，则使用默认颜色

          return {
            ...s,
            barWidth: "20%", // 设置固定柱条宽度为20像素
            barGap: "20%", // 设置柱条间隔
            itemStyle: {
              color: color,
              borderRadius: [4, 4, 0, 0], // 添加圆角效果
            },
            emphasis: {
              itemStyle: {
                color: color,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)",
              },
            },
            // 添加数据标签
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "#333",
                fontSize: 12,
              },
            },
          };
        }),
      };

      // 添加参考线
      if (lines && lines.warr) {
        option.series[0].markLine = {
          silent: true,
          lineStyle: {
            type: "dashed",
            width: 2,
          },
          data: [
            {
              yAxis: lines.warr,
              lineStyle: {
                color: "#ee6666",
                width: 2,
              },
              label: {
                formatter: `风控警戒金额: ${lines.warr}${unit}`,
                position: "insideEndTop",
                color: "#ee6666",
                fontSize: 12,
              },
            },
          ],
        };
      }

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
              },
            },
          },
        };

        this.chartInstance.setOption(option);
      }
    },
  },

  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.getChartData();
  },
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
