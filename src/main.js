import Vue from 'vue'
import App from './App.vue'

//  按需引入element
import {
    Button,
    Select,
    Dialog,
    Form,
    Input,
    FormItem,
    Option,
    Loading,
    Message,
    Container,
    Card,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Row,
    Col,
    Menu,
    Submenu,
    MenuItem,
    Aside,
    Main,
    Badge,
    Header,
    Tabs,
    Breadcrumb,
    BreadcrumbItem,
    Scrollbar,
    Avatar,
    TabPane,
    Divider,
    Table,
    TableColumn,
    Cascader,
    Checkbox,
    CheckboxGroup,
    Pagination,
    Tag,
    Drawer,
    Tree,
    Popover,
    Switch,
    Collapse,
    CollapseItem,
    Tooltip,
    DatePicker,
    TimePicker,
    InputNumber,
    Steps,
    Step,
    Upload,
    Progress,
    Radio,
    RadioGroup,
    RadioButton,
    MessageBox,
    Link,
    Descriptions,
    DescriptionsItem,
    Notification,
    ButtonGroup,
    Popconfirm,
    Image,
    Rate,
    Slider
} from 'element-ui';

Vue.use(Button);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Option);
Vue.use(Container);
Vue.use(Card);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Badge);
Vue.use(Header);
Vue.use(Tabs);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Avatar);
Vue.use(TabPane);
Vue.use(Divider);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Checkbox);
Vue.use(Cascader);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(Drawer);
Vue.use(Tree);
Vue.use(CheckboxGroup);
Vue.use(Popover);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tooltip);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Scrollbar);
Vue.use(Loading.directive);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Link);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(ButtonGroup);
Vue.use(Popconfirm);
Vue.use(Image);
Vue.use(Rate);
Vue.use(Slider);

import { Timeline, TimelineItem } from 'element-ui';
Vue.use(Timeline).use(TimelineItem);
// time line css
// import '../node_modules/timeline-vuejs/dist/timeline-vuejs.css'

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Dialog.props.closeOnClickModal.default = false

// 引入封装的router
import router from '@/router/index'


import '@/permission'
import { store } from '@/store/index'
Vue.config.productionTip = false

// 路由守卫
import Bus from '@/utils/bus.js'
Vue.use(Bus)

import { auth } from '@/directive/auth'
// 按钮权限指令
auth(Vue)

import uploader from 'vue-simple-uploader'
Vue.use(uploader)

// 自定义组件
import datepicker from "@/components/datepicker";
import uploadexcel from "@/components/uploadexcel";
import searchform from "@/components/searchform";
import dialogform from "@/components/dialogform";
import selectimg from "@/components/selectimg";
import booltag from "@/components/booltag";
import dynamicform from "@/components/dynamicform";

Vue.component('datepicker', datepicker);
Vue.component('uploadexcel', uploadexcel);
Vue.component('searchform', searchform);
Vue.component('dialogform', dialogform);
Vue.component('selectimg', selectimg);
Vue.component('booltag', booltag);
Vue.component('dynamicform', dynamicform);


import api from '@/api';
Vue.prototype.$api = api;

import utils from '@/utils';
Vue.prototype.$utils = utils;

// websocket
// import websocket from '@/utils/websocket.js'
// Vue.prototype.$ws = websocket

export default new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')