import { getFcgInfo } from "@/api/fcgame/fcg_info";

// 辅助函数：将对象的字符串key转换为数值key
const convertKeysToNumbers = (obj) => {
    const result = {};
    Object.keys(obj).forEach(key => {
        const numKey = parseInt(key, 10);
        result[numKey] = obj[key];
    });
    return result;
};

export const gameInfo = {
    namespaced: true,
    state: {
        gameTypes: {}, // 游戏类型映射
        gameCategory: {}, // 游戏分类映射
        simulatedOdds: {}, // 模拟赔率映射
        tenants: [], // 组织列表
        issues: [],  //期号列表
        lastUpdateTime: null // 最后更新时间
    },
    mutations: {
        setGameInfo(state, data) {
            // 将字符串key转换为数值key
            state.gameTypes = convertKeysToNumbers(data.game_types || {});
            state.gameCategory = convertKeysToNumbers(data.game_category || {});
            state.simulatedOdds = convertKeysToNumbers(data.simulated_odds || {});
            state.tenants = data.tenants || [];
            state.issues = data.issues || [];
            state.lastUpdateTime = new Date().getTime();
        },
        clearGameInfo(state) {
            state.gameTypes = {};
            state.gameCategory = {};
            state.simulatedOdds = {};
            state.tenants = [];
            state.issues = [];
            state.lastUpdateTime = null;
        }
    },
    actions: {
        async fetchGameInfo({ commit }) {
            try {
                const res = await getFcgInfo();
                if (res.code === 0) {
                    commit('setGameInfo', res.data);
                    return res.data;
                } else {
                    console.error('获取游戏信息失败:', res.msg);
                    throw new Error(res.msg || '获取游戏信息失败');
                }
            } catch (error) {
                console.error('调用游戏信息接口失败:', error);
                throw error;
            }
        },
        // 初始化游戏信息，用于全局刷新时调用
        async initGameInfo({ dispatch }) {
            try {
                await dispatch('fetchGameInfo');
            } catch (error) {
                console.warn('初始化游戏信息失败，将在下次重试:', error);
            }
        }
    },
    getters: {
        gameTypes: state => state.gameTypes,
        gameCategory: state => state.gameCategory,
        simulatedOdds: state => state.simulatedOdds,
        tenants: state => state.tenants,
        issues: state => state.issues,
        lastUpdateTime: state => state.lastUpdateTime,
        // 根据ID获取游戏类型名称
        getGameTypeName: (state) => (id) => {
            return state.gameTypes[id] || '';
        },
        // 根据ID获取游戏分类名称
        getGameCategoryName: (state) => (id) => {
            return state.gameCategory[id] || '';
        },
        // 根据游戏标识获取赔率
        getGameOdds: (state) => (gameKey) => {
            return state.simulatedOdds[gameKey] || 0;
        },
        // 获取游戏类型选项列表（用于下拉选择等）
        gameTypeOptions: (state) => {
            return Object.entries(state.gameTypes).map(([value, label]) => ({
                value,
                label
            }));
        },
        // 获取游戏分类选项列表（用于下拉选择等）
        gameCategoryOptions: (state) => {
            return Object.entries(state.gameCategory).map(([value, label]) => ({
                value,
                label
            }));
        }
    }
}
