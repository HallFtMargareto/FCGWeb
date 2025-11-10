


2024-10-17 20:36:42 星期四
升级node-sass 和sass-load, 最新支持node20




## 安装依赖

```
npm install pnpm -g

pnpm install

pnpm run serve

pnpm run build
```



## host权限
```
v-if="this.$store.state.user.userInfo.perm['host']"
```


## 查询组件
```
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

  async created() {
    await this.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));
  },
```


## 获取store数据

```
this.$store.state.common.baseInfo.system.webSocket

const baseInfo = this.$store.getters["common/baseInfo"];
console.log(baseInfo.webSocket);
```


## webSocket
```
//发送消息
this.$store.dispatch("websocets/send", jsonString);


//页面监听接受websocket信息
import { mapGetters } from "vuex";
computed: {
    ...mapGetters("websocets", ["socketMsgs"]),
},

watch: {
    socketMsgs: {
      //处理接收到的消息
      handler: function () {
        let that = this;
        that.methodName(that.socketMsgs);
      },
    },
},
```



```
  TAG页面
  
 <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
  
    data() {
      return {
        activeName: 'first',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
```


```js
常用表单

<el-input
  type="textarea"
  :rows="2"
  placeholder="请输入内容"
  v-model="textarea">
</el-input>
```