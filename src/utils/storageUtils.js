/*
 * @Description: 进行local数据存储管理的工具模块
 * @Author: CHENSHONE
 * @Date: 2019-11-13 21:15:50
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-12-01 20:03:10
 */

import store from 'store'

const USER_KEY = 'user_key'
export default {
    // 保存user
    saveUser(user) {
        // 参数二需要一个str，而obj会默认调用toString方法--> [object,Object],所以需要转成json格式
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },
    // 读取user
    getUser() {
        // 如果是空串的话，会返回null，希望的是返回一个'{}'
        // return JSON.parse(localStorage.getItem(USER_KEY || '{}'))
        return store.get(USER_KEY) || {}
    },
    // 删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}
