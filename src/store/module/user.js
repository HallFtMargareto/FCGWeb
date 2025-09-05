import { login, logout, getUserInfo } from '@/api/base'
import router from '@/router/index'
export const user = {
    namespaced: true,
    state: {
        userInfo: {
            uuid: "",
            nickName: "",
            headerImg: "",
            authority: "",
            csRole: false,
            perm: {},
        },
        token: "",
    },
    mutations: {
        setUserInfo(state, userInfo) {
            // 这里的 `state` 对象是模块的局部状态
            state.userInfo = userInfo
            if (userInfo.authority.role == "customer") {
                state.userInfo.csRole = true
            }
        },
        setToken(state, token) {
            // 这里的 `state` 对象是模块的局部状态
            state.token = token
        },
        NeedInit(state) {
            state.userInfo = {}
            state.token = ""
            sessionStorage.clear()
            router.push({ name: 'init', replace: true })

        },
        LoginOut(state) {
            state.userInfo = {}
            state.token = ""
            sessionStorage.clear()
            router.push({ name: 'login', replace: true })
            window.location.reload()
        },
        ResetUserInfo(state, userInfo = {}) {
            state.userInfo = {
                ...state.userInfo,
                ...userInfo
            }
        }
    },
    actions: {
        async OauthLogin({ commit, dispatch, rootGetters, getters }, code, state) {

            const res = await getUserInfo({ code, state })
            if (res.code != 0) {
                return false
            }

            let token = res.data.token
            let user = res.data.user
            user.perm = res.data.perm
            commit('setToken', token)
            commit('setUserInfo', user)
            console.log(res.data, dispatch, rootGetters, getters);

            await dispatch('router/SetAsyncRouter', {}, { root: true })
            const asyncRouters = rootGetters['router/asyncRouters']
            router.addRoutes(asyncRouters)
            router.push({ name: getters["userInfo"].authority.defaultRouter })
            return true
        },
        async LoginIn({ commit, dispatch, rootGetters, getters }, loginInfo) {
            const res = await login(loginInfo)
            if (res.code == 0) {
                let user = res.data.user
                user.perm = res.data.perm
                commit('setUserInfo', user)
                commit('setToken', res.data.token)
                await dispatch('router/SetAsyncRouter', {}, { root: true })
                const asyncRouters = rootGetters['router/asyncRouters']
                router.addRoutes(asyncRouters)
                // const redirect = router.history.current.query.redirect
                // console.log(redirect)
                // if (redirect) {
                //     router.push({ path: redirect })
                // } else {
                router.push({ name: getters["userInfo"].authority.defaultRouter })
                // }
                return true
            }
        },
        async LoginOut({ commit }) {
            const res = await logout()
            if (res.code == 0) {
                commit("LoginOut")
            }
        }
    },
    getters: {
        userInfo(state) {
            return state.userInfo
        },
        token(state) {
            return state.token
        },

    }
}


/*
mapState：将 store 中的状态映射为组件的计算属性。
mapGetters：将 store 中的 getters 映射为组件的计算属性。
mapMutations：将 store 中的 mutations 映射为组件的方法。
mapActions：将 store 中的 actions 映射为组件的方法

...mapState('user', ['userInfo', 'token']),
...mapGetters('user', ['userInfo', 'token']),
...mapMutations('user', ['setUserInfo', 'setToken']),

*/