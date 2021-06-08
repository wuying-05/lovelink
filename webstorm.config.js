/**
 * Created by WebStorm.
 * User: lantian
 * Date: 2019/6/10
 * Time: 0:52
 * 编译器索引使用 无实际意义
 *  * 编译器索引使用 无实际意义
 *   * 编译器索引使用 无实际意义
 *    * 编译器索引使用 无实际意义
 *     * 编译器索引使用 无实际意义
 *      * 编译器索引使用 无实际意义
 */



const path = require('path')

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = {
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.js', '.vue', '.json','.scss','.sass'],
        alias: {
            '@': resolve('./src'),
            // '@vnodeUI': resolve('vnode-ui/'),
        }
    }
}

const response = {
    data:''
}
const message={
    code:'',
    data:'',
    message:'',

}
function listen_row_change() {

}
const keys = {
    default:'',
}

