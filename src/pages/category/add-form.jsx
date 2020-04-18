import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Select.Option
class AddForm extends Component {
    static propTypes = {
        categories: PropTypes.array.isRequired, // 一级分类的数组
        parentId: PropTypes.string.isRequired, // 父分类的ID
        setForm: PropTypes.func.isRequired // 用来传递form对象的函数
    }
    componentWillMount() {
        // 将form对象通过setForm方法传递给父组件
        this.props.setForm(this.props.form)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { categories, parentId } = this.props
        return (
            <Form>
                <Item>
                    {getFieldDecorator('parentId', {
                        initialValue: parentId,
                        rules: [
                            {
                                required: true,
                                message: '分类名称必须输入'
                            }
                        ]
                    })(
                        <Select>
                            <Option value="0">一级分类</Option>
                            {categories.map(item => (
                                <Option value={item._id}>{item.name}</Option>
                            ))}
                        </Select>
                    )}
                </Item>
                <Item>
                    {getFieldDecorator('categoryName', { initialValue: '' })(
                        <Input placeholder="请输入分类名称" />
                    )}
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
