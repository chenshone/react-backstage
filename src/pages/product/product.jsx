// 商品路由
import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'
class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/product" component={ProductHome} />
                <Route path="/product/addupdate" component={ProductAddUpdate} />
                <Route path="/product/detail" component={ProductDetail} />
                <Redirect to="/product" />
            </Switch>
        )
    }
}

export default Product
