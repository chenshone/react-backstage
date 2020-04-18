import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import { connect } from 'react-redux'

import { setHeadTitle } from '../../redux/actions'
import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu } = Menu
class LeftNav extends Component {
    // 根据menu的数据数组生成对应的标签数组
    // 使用map+递归调用
    // getMenuNodes_map(menuList) {
    //     return menuList.map(item => {
    //         /*
    //             {
    //                 title: ' 首页', // 菜单标题名称
    //                 key: '/home', // 对应的 path
    //                 icon: 'home', // 图标名称
    //                 children:[] // 可能有，也可能没有
    //             }
    //         */
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                         <Icon type={item.icon} />
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                             <Icon type={item.icon} />
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {this.getMenuNodes_map(item.children)}
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }

    // 判断当前登录用户对item是否有权限
    hasAuth = item => {
        const key = item.key
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        // 1. 如果当前用户是admin
        // 2. 如果当前item是公开的
        // 3. 当前用户有此item的权限:key是不是在menus中
        if (username === 'admin' || item.isPublic || menus.indexOf(key) !== -1)
            return true
        else if (item.children) {
            // 4. 当前用户有此item的子item的权限
            return !!item.children.find(
                child => menus.indexOf(child.key) !== -1
            )
        }
        return false
    }

    // 根据menu的数据数组生成对应的标签数组
    // 使用reduce+递归调用
    getMenuNodes = menuList => {
        // 等到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre, current) => {
            if (this.hasAuth(current)) {
                // 向pre中添加<Menu.Item></Menu.Item>
                if (!current.children) {
                    // 判断current是否是当前对应的item
                    if (
                        current.key === path ||
                        path.indexOf(current.key) === 0
                    ) {
                        // 更新redux中的headerTitle状态
                        this.props.setHeadTitle(current.title)
                    }
                    pre.push(
                        <Menu.Item key={current.key}>
                            <Link
                                to={current.key}
                                onClick={() =>
                                    this.props.setHeadTitle(current.title)
                                }>
                                <Icon type={current.icon} />
                                <span>{current.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    // 查找一个与当前请求路径匹配的子item
                    const cItem = current.children.find(
                        cItem => path.indexOf(cItem.key) === 0
                    )
                    // 如果存在，说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = current.key
                    }
                    // 向pre中添加<SubMenu></SubMenu>
                    pre.push(
                        <SubMenu
                            key={current.key}
                            title={
                                <span>
                                    <Icon type={current.icon} />
                                    <span>{current.title}</span>
                                </span>
                            }>
                            {this.getMenuNodes(current.children)}
                        </SubMenu>
                    )
                }
            }

            return pre
        }, [])
    }
    // 在第一次render()之前执行一次
    // 为第一个render()准备数据(必须同步的)
    // 就是说，在渲染之前，要得到menuNodes，这样才能得到openKey
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        const menuNodes = this.menuNodes
        // 等到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0)
            // 说明当前请求的是商品或其子路由界面
            path = '/product'
        console.log(path, menuNodes)
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        memoryUtils.chooseKey = path
        return (
            <div className="left-nav">
                <Link to="/" className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}>
                    {menuNodes}
                </Menu>
            </div>
        )
    }
}

/*
withRouter高阶组件：
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history、location、match
*/
export default connect(state => ({ user: state.user }), { setHeadTitle })(
    withRouter(LeftNav)
)
