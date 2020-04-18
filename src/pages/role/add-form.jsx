import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const Item = Form.Item
class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired // 用来传递form对象的函数
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
        return (
            <Form {...formItemLayout}>
                <Item label="角色名称">
                    {getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                message: '角色名称必须输入'
                            }
                        ]
                    })(<Input placeholder="请输入角色名称" />)}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
