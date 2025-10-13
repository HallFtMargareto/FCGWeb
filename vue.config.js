'use strict'

module.exports = {
    // 基础配置 详情看文档
    // publicPath: process.env.NODE_ENV === 'development' ? './' : '//cdn.ifanlm.com/rtp/',
    // publicPath: '//cdn.ifanlm.com/rtp/',        //使用CDN路径
    publicPath: './',        //使用本地
    outputDir: 'dist/admin',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: 8080,
        disableHostCheck: true,
        allowedHosts: [
            'node.dgzyx.cn', // 允许访问的域名地址，即花生壳内网穿透的地址
            '.dgzyx.cn'   // .是二级域名的通配符   
        ],
        open: true,  //是否自动打开chrome
        overlay: {
            warnings: false,
            //关闭eslint
            errors: false
        },
        proxy: {
            // 把key的路径代理到target位置
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: { //需要代理的路径   例如 '/api'
                target: `http://192.168.1.209:9050/`, //代理到 目标路径
                // target: `http://127.0.0.1:888/`, //代理到 目标路径
                // target: `http://go.dgzyx.cn/`, //代理到 目标路径
                changeOrigin: true,
                pathRewrite: { // 修改路径数据
                    ['^' + process.env.VUE_APP_BASE_API]: '' // 举例 '^/api:""' 把路径中的/api字符串删除
                }
            }
        },
    },
    chainWebpack: config => {
        config.module
            .rule('ignore-md')
            .test(/\.md$/)
            .use('ignore-loader')
            .loader('ignore-loader')
    }
}