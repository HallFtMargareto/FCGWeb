import { formatTimeToStr } from "@/utils/date";
export default {
    data() {
        return {
            page: 1,
            total: 10,
            pageSize: 10,
            orderField: "",
            orderType: "",//oneof=asc desc
            tableData: [],
            searchInfo: {},
            summary: {},
            showSummary: false,  //为true则在表格尾现实合计信息, 获取到自定义合计数据后再修改
            directionMap: {
                'descending': 'desc',
                'ascending': 'asc',
            },
        }
    },
    methods: {
        filterDict(value, type) {
            const rowLabel = this[type + "Options"] && this[type + "Options"].filter(item => item.value == value)
            return rowLabel && rowLabel[0] && rowLabel[0].label
        },
        async getDict(type) {
            const dicts = await this.$utils.getDict(type)
            this[type + "Options"] = dicts
            return dicts
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.showSummary = false
            this.getTableData()
        },
        handleCurrentChange(val) {
            this.page = val
            this.showSummary = false
            this.getTableData()
        },
        async getTableData(page = this.page, pageSize = this.pageSize, orderField = this.orderField, orderType = this.orderType) {
            const table = await this.listApi({ page, pageSize, orderField, orderType, ...this.searchInfo })
            if (table.code == 0) {
                this.tableData = table.data.list
                this.total = table.data.total
                this.page = table.data.page
                this.pageSize = table.data.pageSize
            }
        }
    },
    filters: {
        formatDate: function (time) {
            if (time != null && time != "") {
                var date = new Date(time);
                return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
            } else {
                return "";
            }
        },
        formatBoolean: function (bool) {
            if (bool != null) {
                return bool ? "是" : "否";
            } else {
                return "";
            }
        },
    },
}