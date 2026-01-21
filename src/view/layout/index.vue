<template>
  <div>
    <OrderReminder />
    <SystemNotice />
    <GlobalLoading :loadingFlag="loadingFlag" text="正在加载中" />
    <StatisticsDisplay :visible="showStatistics" :floating="true" @close="closeStatistics" />
    <FloatingStatisticsIcon v-if="userInfo.perm['host']" @toggle-statistics="toggleStatistics" />
    <el-container class="layout-cont">
      <el-container :class="[isSider ? 'openside' : 'hideside', isMobile ? 'mobile' : '']">
        <el-row :class="[isShadowBg ? 'shadowBg' : '']" @click.native="changeShadow()"></el-row>
        <el-aside class="main-cont main-left">
          <div class="tilte">
            <!-- <img alt class="logoimg" :src="~@/assets/nav_logo.png" /> -->
            <img alt class="logoimg" :src="siteInfo.logo_action" />
            <h2 class="tit-text" v-if="isSider && siteInfo">
              {{ siteInfo.site_name }}
            </h2>
          </div>
          <Aside class="aside" />
        </el-aside>

        <!-- 分块滑动功能 -->
        <el-main class="main-cont main-right">
          <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
            <div :style="{
              width: `calc(100% - ${isMobile ? '0px' : isCollapse ? '54px' : '220px'
                })`,
            }" class="topfix">
              <el-row>
                <!-- :xs="8" :sm="6" :md="4" :lg="3" :xl="1" -->
                <el-header class="header-cont">
                  <el-col :xs="10" :lg="14" :md="14" :sm="9" :xl="14">
                    <div @click="totalCollapse" class="menu-total">
                      <i class="el-icon-s-unfold" v-if="isCollapse"></i>
                      <i class="el-icon-s-fold" v-else></i>
                    </div>
                    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
                      <el-breadcrumb-item :key="item.path" v-for="item in matched.slice(1, matched.length)">{{
                        item.meta.title }}</el-breadcrumb-item>
                    </el-breadcrumb>
                  </el-col>
                  <el-col :xs="12" :md="9" :sm="14" :xl="10" :lg="10">
                    <div class="fl-right right-box">
                      <Search />
                      <Screenfull class="screenfull" :style="{ cursor: 'pointer' }"></Screenfull>

                      <el-dropdown>
                        <span class="header-avatar">
                          <CustomPic />
                          <span style="margin-right: 5px">{{
                            userInfo.nickName
                          }}</span>
                          <i class="el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu class="dropdown-group" slot="dropdown">
                          <el-dropdown-item @click.native="toPerson" icon="el-icon-s-custom">个人设置</el-dropdown-item>
                          <el-dropdown-item @click.native="LoginOut" icon="el-icon-table-lamp">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </el-col>
                </el-header>
              </el-row>
              <!-- 当前面包屑用路由自动生成可根据需求修改 -->
              <!--
            :to="{ path: item.path }" 暂时注释不用-->
              <HistoryComponent />
            </div>
          </transition>
          <transition mode="out-in" name="el-fade-in-linear">
            <keep-alive>
              <router-view class="admin-box" v-if="$route.meta.keepAlive && reloadFlag"></router-view>
            </keep-alive>
          </transition>
          <transition mode="out-in" name="el-fade-in-linear">
            <router-view class="admin-box" v-if="!$route.meta.keepAlive && reloadFlag"></router-view>
          </transition>
          <BottomInfo />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "@/view/layout/aside";
import HistoryComponent from "@/view/layout/aside/historyComponent/history";
import Screenfull from "@/view/layout/screenfull";
import Search from "@/view/layout/search/search";
import BottomInfo from "@/view/layout/bottomInfo/bottomInfo";
import { mapGetters, mapActions } from "vuex";
import CustomPic from "@/components/customPic";
import GlobalLoading from "@/components/common/GlobalLoading";
import SystemNotice from "@/components/common/SystemNotice";
import OrderReminder from "@/components/common/OrderReminder";
import StatisticsDisplay from "@/components/statistics/StatisticsDisplay";
import FloatingStatisticsIcon from "@/components/statistics/FloatingStatisticsIcon";

export default {
  name: "Layout",
  data() {
    return {
      show: false,
      isCollapse: false,
      isSider: true,
      isMobile: false,
      isShadowBg: false,
      loadingFlag: false,
      reloadFlag: true,
      value: "",
      showStatistics: false,
    };
  },
  components: {
    Aside,
    HistoryComponent,
    Screenfull,
    Search,
    BottomInfo,
    CustomPic,
    GlobalLoading,
    SystemNotice,
    OrderReminder,
    StatisticsDisplay,
    FloatingStatisticsIcon,
  },
  methods: {
    ...mapActions("user", ["LoginOut"]),
    reload() {
      this.reloadFlag = false;
      this.$nextTick(() => {
        this.reloadFlag = true;
      });
    },
    totalCollapse() {
      this.isCollapse = !this.isCollapse;
      this.isSider = !this.isCollapse;
      this.isShadowBg = !this.isCollapse;
      this.$bus.emit("collapse", this.isCollapse);
    },
    toPerson() {
      if (this.userInfo.csRole == true) {
        this.$router.push({ name: "dl_password" });
      } else {
        this.$router.push({ name: "person" });
      }
    },
    changeShadow() {
      this.isShadowBg = !this.isShadowBg;
      this.isSider = !!this.isCollapse;
      this.totalCollapse();
    },
    // 切换统计数据显示
    toggleStatistics() {
      this.showStatistics = !this.showStatistics;
    },
    // 关闭统计数据
    closeStatistics() {
      this.showStatistics = false;
    },
    windowInit() {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 1000) {
        //this.isMobile = true;
        this.isSider = false;
        this.isCollapse = true;
      } else if (screenWidth >= 1000 && screenWidth < 1200) {
        this.isMobile = false;
        this.isSider = false;
        this.isCollapse = true;
      } else {
        this.isMobile = false;
        this.isSider = true;
        this.isCollapse = false;
      }
      this.$bus.emit("collapse", this.isCollapse);
      this.$bus.emit("mobile", this.isMobile);
      this.$bus.on("reload", this.reload);
      this.$bus.on("showLoading", () => {
        this.loadingFlag = true;
      });
      this.$bus.on("closeLoading", () => {
        this.loadingFlag = false;
      });
      window.onresize = () => {
        return (() => {
          let screenWidth = document.body.clientWidth;
          if (screenWidth < 1000) {
            this.isMobile = true;
            this.isSider = false;
            this.isCollapse = true;
          } else if (screenWidth >= 1000 && screenWidth < 1200) {
            this.isMobile = false;
            this.isSider = false;
            this.isCollapse = true;
          } else {
            this.isMobile = false;
            this.isSider = true;
            this.isCollapse = false;
          }
          this.$bus.emit("collapse", this.isCollapse);
          this.$bus.emit("mobile", this.isMobile);
        })();
      };
    },
    // 检查并显示系统公告
    checkAndShowAnnouncement() {
      // 如果公告内容长度为0，不显示
      if (
        !this.siteInfo ||
        !this.siteInfo.site_remark ||
        this.siteInfo.site_remark.length === 0
      ) {
        return;
      }

      // 如果公告长度与已保存的长度一致，不显示
      if (this.siteInfo.site_remark.length === this.siteRemarkLen) {
        return;
      }

      // 显示公告弹窗
      this.$confirm(
        this.siteInfo.site_remark.replace(/\n/g, "<br>"),
        "系统公告",
        {
          confirmButtonText: "确定",
          showCancelButton: false,
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          // 用户关闭弹窗后，更新公告长度
          this.$store.commit(
            "common/setSiteRemarkLen",
            this.siteInfo.site_remark.length
          );
        })
        .catch(() => {
          // 即使点击取消或关闭，也要更新长度
          this.$store.commit(
            "common/setSiteRemarkLen",
            this.siteInfo.site_remark.length
          );
        });
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    ...mapGetters("common", ["siteInfo", "siteRemarkLen"]),
    title() {
      return this.$route.meta.title || "当前页面";
    },
    matched() {
      return this.$route.matched;
    },
  },
  async mounted() {

    //全局刷新后处理
    this.windowInit();

    //更新公共数据
    // this.$store.dispatch("product/updateProductList");

    // 使用 async/await 等待数据加载完成
    try {
      await this.$store.dispatch("common/updateCommonData");
      await this.$store.dispatch("common/updateSiteData");
    } catch (error) {
      console.error("加载数据失败:", error);
    }

    //检查是否弹窗
    this.checkAndShowAnnouncement();

    // 获取期号统计数据
    // this.$store
    //   .dispatch("statistics/fetchLatestIssueStatistics")
    //   .catch((error) => {
    //     console.warn("获取期号统计数据失败:", error);
    //   });

    // this.$store.dispatch("websocets/webSocketInit");
  },
  created() {
    // 游戏信息已在路由守卫中预加载，这里不再重复加载
  },
};
</script>

<style scoped></style>
