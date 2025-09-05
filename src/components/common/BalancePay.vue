<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="变更余额" width="25%">
      <el-form :model="formData" :rules="rules" ref="formData" size="mini" label-position="right" label-width="100px"
        :destroy-on-close="true">

        <el-form-item label="">
          <el-descriptions title="">
            <el-descriptions-item label="名称">{{ name }}</el-descriptions-item>
            <el-descriptions-item label="当前余额">{{ current_balance }}</el-descriptions-item>
          </el-descriptions>
        </el-form-item>

        <!-- <el-divider></el-divider> -->

        <el-form-item label="变更金额:" prop="exchange_amount">
          <el-input v-model="formData.exchange_amount" clearable placeholder="请输入变更金额"></el-input>
        </el-form-item>

        <el-form-item label="货币类型:" prop="currency_type">
          <el-select placeholder="请选择" v-model="formData.currency_type" style="width: 100%">
            <el-option :key="key" :label="key" :value="key"
              v-for="(value, key) in this.$store.state.common.commonData.currency_type"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="货币汇率:" prop="exchange_rate">
          <el-input v-model="formData.exchange_rate" clearable placeholder="不填默认为1比1"></el-input>
        </el-form-item>

        <el-form-item label="操作类型:" prop="name">
          <!-- <el-select placeholder="请选择" v-model="formData.pay_type" style="width: 100%">
            <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in payTyle"></el-option>
          </el-select> -->
          <el-radio-group v-model="formData.pay_type">
            <el-radio :label="1">加款</el-radio>
            <el-radio :label="0">扣款</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="操作备注:">
          <el-input v-model="formData.remark" clearable placeholder="" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="enterDialog" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { alterCustomerBalance } from "@/api/customers";
// import { alterProviderBalance } from "@/api/providers";
// import { changeCustomerAmount } from "@/api/recharge/recharge_customer";
// import { changeProviderAmount } from "@/api/recharge/recharge_provider";

export default {
  props: ["type"],
  data() {
    return {
      dialogVisible: false,
      payTyle: [
        {
          value: 1,
          label: "正常加款",
        },
        // {
        //   value: 3,
        //   label: "对账收入",
        // },
        // {
        //   value: 5,
        //   label: "保证金加款",
        // },
        {
          value: 2,
          label: "正常减款",
        },
        // {
        //   value: 4,
        //   label: "对账损失",
        // },
        // {
        //   value: 6,
        //   label: "保证金减款",
        // },
      ],
      name: "",
      current_balance: 0,
      formData: {
        id: 0,
        pay_type: 1,
        exchange_amount: "",
        remark: "",
        currency_type: "RMB",
        exchange_rate: undefined,
      },
      rules: {
        exchange_amount: [
          { required: true, message: '请输入变更金额', trigger: 'blur' },
        ],
        currency_type: [
          { required: true, message: '请选择货币类型', trigger: 'change' }
        ],
        exchange_rate: [
          { type: 'number', message: '货币汇率必须为数字', trigger: 'blur' }
        ],
        pay_type: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
      },
    };
  },
  methods: {
    openDialog(account) {
      this.current_balance = account.balance;
      if (this.type == "customer") {
        this.formData.id = account.ID;
        this.name = account.name;
      } else if (this.type == "provider") {
        this.formData.id = account.ID;
        this.name = account.name;
      }
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.formData = {
        id: 0,
        pay_type: 1,
        exchange_amount: "",
        remark: "",
        currency_type: "RMB",
        exchange_rate: 1,
      };
    },
    async enterDialog() {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          let res;
          if (this.type == "customer") {
            //res = await changeCustomerAmount(this.formData);
          } else if (this.type == "provider") {
            //res = await changeProviderAmount(this.formData);
          } else {
            return;
          }
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.closeDialog();
            this.$emit("reload");
          }
        } else {
          console.log('校验失败');
          return false;
        }
      });
    }
  }
}
</script>
