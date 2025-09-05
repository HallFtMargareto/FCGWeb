// import {
//     getSysRechargeProductTypeList
// } from "@/api/recharge/recharge_product_type";


export const product = {
    namespaced: true,
    state: {
        productTypeList: [],
    },
    mutations: {
        setProductList(state, list) {
            state.productTypeList = list
        }
    },
    actions: {
        async updateProductList() {
            // const res = await getSysRechargeProductTypeList({
            //     page: 1,
            //     pageSize: 9999,
            //     orderField: "sort",
            //     orderType: "asc", //oneof=asc desc
            //     pageInfo: {},
            // })
            // if (res.code == 0) {
            //     content.commit('setProductList', res.data.list);
            // }
        }
    },
    getters: {
        getProdTypeList(state) {
            return state.productTypeList
        }
    }
}