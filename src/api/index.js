/*
 * @Description:
 * @Author: CHENSHONE
 * @Date: 2019-11-12 21:52:12
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-12-01 20:15:54
 */
import jsonp from 'jsonp'
import { message } from 'antd'
/*
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import ajax from './ajax'
const BASE = '/api'
// login
export const reqLogin = (username, password) =>
    ajax(BASE + '/login', { username, password }, 'POST')

// 获取一级/耳机分类的列表
export const reqCategories = parentId =>
    ajax(BASE + '/manage/category/list', { parentId })

// 添加分类
export const reqAddCategory = (categoryName, parentId) =>
    ajax(BASE + 'manage/category/add', { categoryName, parentId }, 'POST')
// 更新分类名
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
    ajax(BASE + 'manage/category/update', { categoryId, categoryName }, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) =>
    ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 搜索商品分页列表
// searchType:搜索的类型,productName/productDesc
export const reqSearchProducts = ({
    pageNum,
    pageSize,
    searchName,
    searchType
}) =>
    ajax(BASE + '/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchName
    })

// 获取商品分类名称
export const reqCategory = categoryId =>
    ajax(BASE + '/manage/category/info', { categoryId })

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) =>
    ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 删除图片
export const reqDeleteImg = name =>
    ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/更新商品
export const reqAddOrUpdateProduct = product =>
    ajax(
        BASE + '/manage/product/' + (product._id ? 'update' : 'add'),
        product,
        'POST'
    )
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddRole = roleName =>
    ajax(BASE + '/manage/role/add', { roleName }, 'POST')

// 更新角色
export const reqUpdateRole = role =>
    ajax(BASE + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除指定用户
export const reqDeleteUser = userId =>
    ajax(BASE + '/manage/user/delete', { userId }, 'POST')

// 添加/修改用户
export const reqAddOrUpdateUser = user =>
    ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// jsonp请求的接口请求函数
export const reqWeather = city => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p4
9MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve, reject) => {
        jsonp(
            url,
            {
                param: 'callback'
            },
            (error, response) => {
                if (!error && response.status === 'success') {
                    const {
                        dayPictureUrl,
                        weather
                    } = response.results[0].weather_data[0]
                    resolve({ dayPictureUrl, weather })
                } else {
                    message.error(' 获取天气信息失败')
                }
            }
        )
    })
}
