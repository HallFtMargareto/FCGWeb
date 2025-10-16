// import { getBaseInfo } from "@/api/base";
// import { getItemList } from "@/api/common";
import { getSystemConfig } from "@/api/system";

export const common = {
    namespaced: true,
    state: {
        baseInfo: {},
        siteInfo: {},
        commonData: {},
        alpha: 0.8, // 默认阈值比例
        beta: 0.5   // 默认目标线比例
    },
    mutations: {
        setBaseInfo(state, list) {
            state.baseInfo = list
        },
        setCommonData(state, list) {
            state.commonData = list
        },
        setSiteInfo(state, list) {
            state.siteInfo = list
        },
        setAlpha(state, value) {
            state.alpha = value
        },
        setBeta(state, value) {
            state.beta = value
        }
    },
    actions: {
        async updateCommonData(content) {
            const jsonData = require('@/assets/province_data.json');
            const newData = {
                "province": jsonData,
            };
            content.commit('setCommonData', newData);
        },
        async updateSiteData(content) {
            const configData = {
                key: 'site',
            };
            let res = await getSystemConfig(configData);
            if (res.code == 0) {
                content.commit('setSiteInfo', res.data.config);
            }
        }
    },
    getters: {
        baseInfo(state) {
            return state.baseInfo
        },
        commonData(state) {
            return state.commonData
        },
        siteInfo(state) {
            return state.siteInfo
        }
    }
}