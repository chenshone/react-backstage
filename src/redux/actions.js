/*
 * @Description:包含n个action creator函数的模块
 * @Author: CHENSHONE
 * @Date: 2019-11-29 22:41:48
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-30 16:49:32
 */
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
// 设置头部标题的同步action
export const setHeadTitle = headTitle => ({
    type: SET_HEAD_TITLE,
    data: headTitle
})

// 设置登录的同步action
export const receiveUser = user => ({ type: RECEIVE_USER, user })

// 显示错误信息的同步action
export const showErrorMsg = errorMsg => ({ type: SHOW_ERROR_MSG, errorMsg })

// 退出登录的同步action
export const logout = () => {
    // 删除local中的user
    storageUtils.removeUser()
    // 返回action对象
    return { type: RESET_USER }
}

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1. 执行异步ajax请求
        const result = await reqLogin(username, password)
        // 2.1 成功，分发成功的同步action
        if (result.status === 0) {
            const user = result.data
            // 保存到local中
            storageUtils.saveUser(user)
            // 分发接收用户的同步action
            dispatch(receiveUser(user))
        } else {
            // 2.2 失败，分发失败的同步action
            const errorMsg = result.msg
            dispatch(showErrorMsg(errorMsg))
        }
    }
}
