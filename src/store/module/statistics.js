import { getIssueStatistics } from "@/api/fcgame/fcg_stat";

export const statistics = {
    namespaced: true,
    state: {
        issueStatistics: {
            issue: null,
            statistics: null
        },
        loading: false,
        error: null
    },
    mutations: {
        setIssueStatistics(state, data) {
            state.issueStatistics = data
        },
        setLoading(state, loading) {
            state.loading = loading
        },
        setError(state, error) {
            state.error = error
        },
        clearIssueStatistics(state) {
            state.issueStatistics = {
                issue: null,
                statistics: null
            }
        }
    },
    actions: {
        async fetchIssueStatistics({ commit }, params = {}) {
            commit('setLoading', true)
            commit('setError', null)
            
            try {
                const response = await getIssueStatistics(params)
                if (response.code === 0) {
                    commit('setIssueStatistics', response.data)
                    return response.data
                } else {
                    commit('setError', response.msg || '获取统计数据失败')
                    throw new Error(response.msg || '获取统计数据失败')
                }
            } catch (error) {
                commit('setError', error.message || '网络请求失败')
                throw error
            } finally {
                commit('setLoading', false)
            }
        },
        
        async fetchLatestIssueStatistics({ dispatch }) {
            return await dispatch('fetchIssueStatistics', {})
        },
        
        async fetchIssueStatisticsById({ dispatch }, issueId) {
            return await dispatch('fetchIssueStatistics', { issueId })
        }
    },
    getters: {
        issueStatistics: state => state.issueStatistics,
        statisticsLoading: state => state.loading,
        statisticsError: state => state.error,
        currentIssue: state => state.issueStatistics.issue,
        currentStatistics: state => state.issueStatistics.statistics
    }
}
