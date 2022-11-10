const path = require('path');
// const compressionwebpackplugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
// const productiongzipextensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
// const bundleanalyzerplugin = require("webpack-bundle-analyzer").bundleanalyzerplugin; // 打包分析
// const is_prod = ['production', 'prod'].includes(process.env.node_env);
// const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    publicPath:'/',
    assetsDir:'static',
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    // 要公用的scss的路径
                    resources: './src/style/app.scss'
                })
                .end()
        })
    },
    lintOnSave: false
}
