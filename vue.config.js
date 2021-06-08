const path = require('path')

const resolve = dir => path.join(__dirname, dir)

const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'


module.exports = {
    assetsDir: "static",
    devServer: {
        port: 3333,
        open: true,
        disableHostCheck: true,
        historyApiFallback: true
        // pubilc: '2997345589.imdo.co/'
    },
    publicPath: BASE_URL,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('_c', resolve('src/components'))
    },
    productionSourceMap: false,
    lintOnSave: false   //关闭空格检查
}
