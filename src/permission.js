import router from './router'
import { store } from '@/store/index'
import getPageTitle from '@/utils/page'

let asyncRouterFlag = 0

const whiteList = ['login', 'init']
router.beforeEach(async (to, from, next) => {
    const token = store.getters['user/token']
    // 在白名单中的判断情况
    //修改网页标签名称
    document.title = getPageTitle(to.meta.title)
    if (whiteList.indexOf(to.name) > -1) {
        if (token) {
            //获取基础数据
            next({ name: store.getters["user/userInfo"].authority.defaultRouter })
        } else {
            next()
        }
    } else {
        // 不在白名单中并且已经登陆的时候
        if (token) {
            // 添加flag防止多次获取动态路由和栈溢出
            if (!asyncRouterFlag && store.getters['router/asyncRouters'].length == 0) {
                asyncRouterFlag++
                
                // 先获取动态路由
                await store.dispatch('router/SetAsyncRouter')
                const asyncRouters = store.getters['router/asyncRouters']
                router.addRoutes(asyncRouters)
                
                // 预加载游戏信息 - 确保在页面组件初始化前完成
                try {
                    await store.dispatch('gameInfo/initGameInfo')
                    console.log('游戏信息在路由守卫中预加载完成')
                } catch (error) {
                    console.warn('路由守卫中预加载游戏信息失败:', error)
                    // 即使失败也继续，不影响页面访问
                }
                
                next({ ...to, replace: true })
            } else {
                // 对于已经初始化过的路由，确保游戏信息已加载
                const tenants = store.getters['gameInfo/tenants']
                if (!tenants || tenants.length === 0) {
                    try {
                        await store.dispatch('gameInfo/initGameInfo')
                        console.log('游戏信息补充加载完成')
                    } catch (error) {
                        console.warn('补充加载游戏信息失败:', error)
                    }
                }
                next()
            }
        }
        // 不在白名单中并且未登陆的时候
        if (!token) {
            next({
                name: "login",
                query: {
                    redirect: document.location.hash
                }
            })
        }
    }
})
