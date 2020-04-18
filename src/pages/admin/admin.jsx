import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout } from 'antd'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Product from '../product/product'
import Category from '../category/category'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'
const { Footer, Sider, Content } = Layout
// 后台管理的路由组件
class Admin extends Component {
    render() {
        const user = this.props.user
        // 如果内存中没有存储user ==> 当前没有登录
        if (!user || !user._id) {
            // 自动跳转到登录(在render()中)
            return <Redirect to="/login" />
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header />
                    <Content
                        style={{
                            backgroundColor: '#fff',
                            margin: '15px'
                        }}>
                        <Switch>
                            <Redirect from="/" to="/home" exact />
                            <Route path="/home" component={Home} />
                            <Route path="/category" component={Category} />
                            <Route path="/product" component={Product} />
                            <Route path="/role" component={Role} />
                            <Route path="/user" component={User} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/line" component={Line} />
                            <Route path="/charts/pie" component={Pie} />
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                    <Footer
                        style={{
                            textAlign: 'center',
                            color: '#cccccc',
                            backgroundColor: '#fff'
                        }}>
                        推荐使用谷歌浏览器，可以获得更佳的页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(state => ({ user: state.user }), {})(Admin)
