import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option
class UserForm extends PureComponent {
    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
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
    componentWillMount() {
        // 将form对象通过setForm方法传递给父组件
        this.props.setForm(this.props.form)
    }
    render() {
        // 指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 20 } // 指定右侧包裹的宽度
        }
        const { getFieldDecorator } = this.props.form
        const { roles, user } = this.props
        return (
            <Form {...formItemLayout}>
                <Item label="用户名">
                    {getFieldDecorator('username', {
                        initialValue: user.username,
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
                                message: '用户名必须是英文、数字或下划线组成'
                            }
                        ]
                    })(<Input placeholder="请输入用户名" />)}
                </Item>
                {user._id ? null : (
                    <Item label="密码">
                        {getFieldDecorator('password', {
                            initialValue: user.password,
                            rules: [
                                {
                                    required: true,
                                    message: '密码必须输入'
                                },
                                {
                                    validator: this.validatePwd
                                }
                            ]
                        })(<Input type="password" placeholder="请输入密码" />)}
                    </Item>
                )}

                <Item label="手机号">
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                        rules: [
                            {
                                required: true,
                                message: '手机号必须输入'
                            }
                        ]
                    })(<Input placeholder="请输入手机号" />)}
                </Item>
                <Item label="邮箱">
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                        rules: [
                            {
                                required: true,
                                message: '邮箱必须输入'
                            }
                        ]
                    })(<Input type="email" placeholder="请输入邮箱" />)}
                </Item>
                <Item label="角色">
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id
                    })(
                        <Select>
                            {roles.map(role => (
                                <Option value={role._id} key={role._id}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)
