/*
 * @Description:redux的管理对象store
 * @Author: CHENSHONE
 * @Date: 2019-11-29 22:40:11
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-29 22:59:01
 */

// 向外默认暴露store

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
