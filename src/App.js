/*
 * @Description:
 * @Author: CHENSHONE
 * @Date: 2019-11-11 22:36:08
 * @LastEditors: CHENSHONE
 * @LastEditTime: 2019-11-12 13:49:53
 */
/*
    应用根组件
*/
import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}
