/*
 * @Description:
 * @Author: CHENSHONE
 * @Date: 2019-11-12 21:41:42
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-13 21:00:28
 */
/*
能发生异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象

优化：
    1. 统一处理请求异常
        在外层抱一个自己创建的Promise对象
        在请求出错时，不reject(error)，而是显示错误提示
    2. 异步得到的不是response,而是response.data
        在请求成功resolve时：resolve(response.data)

*/
import axios from 'axios'
import { message } from 'antd'
export default function ajax(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        // 1. 执行异步ajax请求
        if (method === 'GET') {
            promise = axios.get(url, {
                // 配置对象
                // 指定请求参数
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }

        promise
            .then(response => {
                // 2. success:调用resolve(value)
                resolve(response.data)
            })
            .catch(error => {
                // 3. error：不调用reject(reason)，而是提示异常信息
                // 这样的话，这个ajax函数模块返回的promise对象就不会出现异常
                // 出错的情况在当前catch下就结束了
                message.error('请求出错了：' + error.message)
            })
    })
}
