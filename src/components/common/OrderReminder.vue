<template>
  <div class="order-reminder">
    <!-- 这是一个逻辑组件，不渲染可见内容 -->
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: "OrderReminder",
  data() {
    return {
      timer: null,
      timeOffset: 0, // 服务器时间与本地时间的差值 (Server - Client)
      targetTime1: '',
      targetTime2: '',

      channel_trans: false, //通道转单是否开启
      trans_second: 30,     //通道转单弹窗倒计时

      // 记录当天是否已经提醒过，防止重复弹窗
      // Record whether notified today to prevent duplicate popups
      notifiedStatus: {
        time1: false,
        time2: false
      },
      channelTransTimers: {
        time1: null,
        time2: null
      }
    };
  },
  computed: {
    ...mapGetters("user", ["token", "userInfo"]),
  },
  async mounted() {
    await this.syncServerTime();
    this.checkTime();
    // 每秒检查一次时间
    this.timer = setInterval(this.checkTime, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    Object.keys(this.channelTransTimers).forEach(key => {
      if (this.channelTransTimers[key]) {
        clearTimeout(this.channelTransTimers[key]);
        this.channelTransTimers[key] = null;
      }
    });
  },
  methods: {
    async syncServerTime() {
      // 获取服务器时间及配置
      const res = await axios({
        url: process.env.VUE_APP_BASE_API + '/fcg_info/get',
        method: 'get',
        headers: {
          'x-token': this.token,
          'x-user-id': this.userInfo ? this.userInfo.ID : ''
        }
      });
      if (res.headers.date) {
        const serverTime = new Date(res.headers.date).getTime();
        const clientTime = Date.now();
        this.timeOffset = serverTime - clientTime;
        console.log('Server time sync offset (ms):', serverTime, clientTime, this.timeOffset);
      }

      // 从响应体中获取目标时间配置
      if (res.data) {
        // 支持直接返回或通过data包裹的情况
        // Support direct return or wrapped in data
        const data = res.data.data || res.data;
        if (data['fcft-end-time']) {
          this.targetTime1 = data['fcft-end-time'];
        }
        if (data['tcft-end-time']) {
          this.targetTime2 = data['tcft-end-time'];
        }
        console.log('Target times loaded:', this.targetTime1, this.targetTime2);

        this.channel_trans = data["channel_trans"]
        this.trans_second = data["trans_second"]
        console.log(this.channel_trans, this.trans_second)
      }
    },
    checkTime() {
      // 使用修正后的时间
      const now = new Date(Date.now() + this.timeOffset);
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // 当前秒数
      const currentSeconds = hours * 3600 + minutes * 60 + seconds;

      // 目标时间1
      // 提醒开始时间：提前3分钟
      const target1End = this.timeToSeconds(this.targetTime1);
      const target1Start = target1End - 3 * 60;

      // 目标时间2
      // 提醒开始时间：提前3分钟
      const target2End = this.timeToSeconds(this.targetTime2);
      const target2Start = target2End - 3 * 60;

      // 检查时间段1
      if (currentSeconds >= target1Start && currentSeconds < target1End) {
        if (!this.notifiedStatus.time1) {
          this.openNotification(target1End, 'time1');
          this.notifiedStatus.time1 = true;
        }
      } else {
        // 如果不在时间段内，重置状态（可选，为了支持第二天继续提醒，或者用户刷新页面也会重置）
        // 这里简单处理：如果过了时间点很久，可以重置，但在SPA中通常刷新重置即可
        // 为了安全起见，如果当前时间小于开始时间，说明是新的一天或者时间还早，重置
        if (currentSeconds < target1Start) {
          this.notifiedStatus.time1 = false;
        }
      }

      // 检查时间段2
      if (currentSeconds >= target2Start && currentSeconds < target2End) {
        if (!this.notifiedStatus.time2) {
          this.openNotification(target2End, 'time2');
          this.notifiedStatus.time2 = true;
        }
      } else {
        if (currentSeconds < target2Start) {
          this.notifiedStatus.time2 = false;
        }
      }
    },
    openNotification(targetEndTime, notifyKey) {
      // 计算剩余毫秒数
      const now = new Date(Date.now() + this.timeOffset);
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const remainingSeconds = targetEndTime - currentSeconds;

      if (remainingSeconds <= 0) return;

      const duration = remainingSeconds * 1000;

      if (this.isChannelTransEnabled()) {
        this.scheduleChannelTransNotification(duration, notifyKey);
      }

      // 定义倒计时组件
      const ReminderContent = {
        props: ['endTime', 'timeOffset', 'totalSeconds'],
        data() {
          return {
            remainingText: '',
            color: '#67C23A'
          };
        },
        mounted() {
          this.updateTimer();
          this.timer = setInterval(this.updateTimer, 1000);
        },
        beforeDestroy() {
          if (this.timer) clearInterval(this.timer);
        },
        methods: {
          updateTimer() {
            const now = new Date(Date.now() + this.timeOffset);
            const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            const remaining = this.endTime - currentSeconds;

            if (remaining <= 0) {
              this.remainingText = '00:00';
              this.color = '#F56C6C';
              return;
            }

            // 颜色计算: Green(120) -> Red(0)
            const total = 180; // 3分钟
            const ratio = Math.max(0, Math.min(1, remaining / total));
            const hue = Math.floor(ratio * 120);
            this.color = `hsl(${hue}, 80%, 45%)`;

            // 格式化时间
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            this.remainingText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          }
        },
        render(h) {
          return h('div', { style: 'display: flex; align-items: center;' }, [
            h('span', '快速转单即将停止,请及时处理'),
            h('span', {
              style: {
                color: this.color,
                fontWeight: 'bold',
                fontSize: '16px',
                marginLeft: '10px',
                minWidth: '50px'
              }
            }, this.remainingText)
          ]);
        }
      };

      this.$notify({
        title: '温馨提示',
        message: this.$createElement(ReminderContent, {
          props: {
            endTime: targetEndTime,
            timeOffset: this.timeOffset
          }
        }),
        showClose: true,
        duration: duration, // 设置为剩余时间，到时间自动关闭
        offset: 40 // 设置距离顶部的偏移量，避免遮挡导航条
      });
    },
    scheduleChannelTransNotification(delay, notifyKey) {
      const transSecond = Number(this.trans_second);
      if (!Number.isFinite(transSecond) || transSecond <= 0) return;

      if (notifyKey && this.channelTransTimers[notifyKey]) {
        clearTimeout(this.channelTransTimers[notifyKey]);
      }

      const timer = setTimeout(() => {
        if (notifyKey) {
          this.channelTransTimers[notifyKey] = null;
        }
        if (this.isChannelTransEnabled()) {
          this.openChannelTransNotification(transSecond);
        }
      }, delay);

      if (notifyKey) {
        this.channelTransTimers[notifyKey] = timer;
      }
    },
    openChannelTransNotification(totalSeconds) {
      const duration = totalSeconds * 1000;
      const endTimestamp = Date.now() + duration;

      const ChannelTransContent = {
        props: ['endTimestamp', 'totalSeconds'],
        data() {
          return {
            remainingText: '',
            color: '#67C23A',
            timer: null
          };
        },
        mounted() {
          this.updateTimer();
          this.timer = setInterval(this.updateTimer, 1000);
        },
        beforeDestroy() {
          if (this.timer) clearInterval(this.timer);
        },
        methods: {
          updateTimer() {
            const remaining = Math.ceil((this.endTimestamp - Date.now()) / 1000);

            if (remaining <= 0) {
              this.remainingText = '00:00';
              this.color = '#F56C6C';
              return;
            }

            const ratio = Math.max(0, Math.min(1, remaining / this.totalSeconds));
            const hue = Math.floor(ratio * 120);
            this.color = `hsl(${hue}, 80%, 45%)`;

            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            this.remainingText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          }
        },
        render(h) {
          return h('div', { style: 'display: flex; align-items: center;' }, [
            h('span', '通道转单即将停止, 请及时处理'),
            h('span', {
              style: {
                color: this.color,
                fontWeight: 'bold',
                fontSize: '16px',
                marginLeft: '10px',
                minWidth: '50px'
              }
            }, this.remainingText)
          ]);
        }
      };

      this.$notify({
        title: '温馨提示',
        message: this.$createElement(ChannelTransContent, {
          props: {
            endTimestamp,
            totalSeconds
          }
        }),
        showClose: true,
        duration,
        offset: 40
      });
    },
    isChannelTransEnabled() {
      return this.channel_trans === true || this.channel_trans === 1 || this.channel_trans === '1' || this.channel_trans === 'true';
    },
    timeToSeconds(timeStr) {
      if (!timeStr) return 0;
      const parts = timeStr.split(':');
      const h = parseInt(parts[0] || 0);
      const m = parseInt(parts[1] || 0);
      const s = parseInt(parts[2] || 0);
      return h * 3600 + m * 60 + s;
    }
  }
};
</script>
