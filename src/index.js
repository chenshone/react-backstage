/*
 * @Description:
 * @Author: CHENSHONE
 * @Date: 2019-11-11 22:35:43
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-30 12:17:55
 */
/*
    入口js
*/
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store from './redux/store'

// 将app组件标签渲染到index页面的div上
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
