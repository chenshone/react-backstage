/*
 * @Description: 根据佬的state和指定的action生成并返回新的state的函数
 * @Author: CHENSHONE
 * @Date: 2019-11-29 22:41:37
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-12-01 19:55:17
 */
import { combineReducers } from 'redux'

import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'
import storageUtils from '../utils/storageUtils'

// 用来管理头部标题的reducer函数
const initHeadTitle = ''
function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

// 用来管理当前登录用户的reducer函数
const initUser = storageUtils.getUser()
console.log(storageUtils.getUser())
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            return { ...state, errorMsg }
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/* 向外默认暴露的是合并产生的总的reducer函数，
管理的总的state结构是一个对象,value是函数返回的值
 */
export default combineReducers({ headTitle, user })
