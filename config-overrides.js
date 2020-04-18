/*
 * @Description:
 * @Author: CHENSHONE
 * @Date: 2019-11-11 23:04:39
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-15 19:34:05
 */
const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
    // 针对antd实现按需打包：根据import来打包
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' }
    })
)
