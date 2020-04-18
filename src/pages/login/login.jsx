/*
1. 高阶函数
    1. 一类特别的函数
        1. 接收函数类型的参数
        2. 函数的返回值是函数
    2. 常见的高阶函数
        1. setTimeout()/setInertval()
        2. Promise(()=>{}) then(value => {}, reason =>{})
        3. 数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
        4. fn.bind()
        5. Form.caret()() / getFieldDecorator()()
2. 高阶组件
    1. 本质就是一个函数
    2. 接收一个组件(被包装组件)，返回一个新的组件(包装组件)，包装组件会向被包装组件传入特点属性
    3. 作用：扩展组件的功能
    4. 高阶组件也是高阶函数：接收一个组件函数，返回是一个新的组件函数
*/

/*
async和await
1. 作用
    简化promise对象的使用：
        不用再使用then()来指定成功/失败的回调函数

    以同步编码方式(没有回调函数)实现异步流程
2. 哪里写await
    在返回promise的表达式左侧写await：
        不想要promise，想要promise异步执行的成功的value数据
3. 哪里写async
    await所在函数(最近的)定义的左侧写async
*/
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
import { Form, Icon, Input, Button } from 'antd'

import './login.less'
import logo from '../../assets/images/logo.png'

// 登陆的路由组件
class Login extends Component {
    handleSubmit = e => {
        e.preventDefault()
        // 对所有的表单资源进行校验
        this.props.form.validateFields(async (err, values) => {
            // 校验成功
            if (!err) {
                // console.log('提交登陆的ajax请求', values)
                // 请求登陆
                const { username, password } = values
                this.props.login(username, password)
            } else {
                console.log('校验失败')
            }
        })
        // 得到form对象
        /* const form = this.props.form
        const values = form.getFieldsValue()
        console.log('handleSubmit', values) */
    }
    // 对密码进行自定义验证
    validatePwd = (rule, value, callback) => {
        // console.log('validatePwd()', rule, value)
        if (!value) {
            callback('密码必须输入') // 验证失败，并指定提示的文本
        } else if (value.length < 4) {
            callback('密码必须大于等于4') // 验证失败，并指定提示的文本
        } else if (value.length > 12) {
            callback('密码必须小于等于12') // 验证失败，并指定提示的文本
        } else if (!/^\w+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成') // 验证失败，并指定提示的文本
        } else {
            callback() // 验证成功
        }
    }
    render() {
        // 如果用户已经登录，自动跳转到管理界面
        const user = this.props.user
        if (user && user._id) {
            return <Redirect to="/home" />
        }

        const errorMsg = this.props.user.errorMsg

        // 得到具有强大功能的form对象
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div className={errorMsg ? 'error-msg show' : 'error-msg'}>
                        {errorMsg}
                    </div>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        {/*
                                用户名 / 密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于 4 位
                                3). 必须小于等于 12 位
                                4). 必须是英文、数字或下划线组成
                            */}
                        <Form.Item>
                            {getFieldDecorator('username', {
                                // 配置对象
                                // 声明式验证：直接使用别人定义好的验证规则进行验证
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Please input your username!'
                                    },
                                    {
                                        min: 4,
                                        message: '用户名最少4位'
                                    },
                                    {
                                        max: 12,
                                        message: '用户名最多12位'
                                    },
                                    {
                                        pattern: /^\w+$/,
                                        message:
                                            '用户名必须是英文、数字或下划线组成'
                                    }
                                ],
                                // 指定初始值
                                initialValue: 'admin'
                            })(
                                <Input
                                    prefix={
                                        <Icon
                                            type="user"
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    placeholder="Username"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatePwd
                                    }
                                ]
                            })(
                                <Input
                                    prefix={
                                        <Icon
                                            type="lock"
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    type="password"
                                    placeholder="Password"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/*
包装form组件生成一个新的组件：Form(login)
新组件会向Form组件传递一个强大的对象属性：form
*/
const WarpLogin = Form.create()(Login)
export default connect(state => ({ user: state.user }), { login })(WarpLogin)
