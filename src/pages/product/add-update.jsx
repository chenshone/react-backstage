import React, { PureComponent } from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { reqCategories, reqAddOrUpdateProduct } from '../../api'
import LinkButton from '../../components/link-button'
const { Item } = Form
const { TextArea } = Input

// product的添加和更新的子路由组件
class ProductAddUpdate extends PureComponent {
    state = {
        options: []
    }
    // 借助ref 把子组件的函数暴露给父组件调用
    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async categories => {
        // 根据categories生成一个options对象数组
        const options = categories.map(item => ({
            value: item._id,
            label: item.name,
            isLeaf: false
        }))
        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId, categoryId } = product
        if (isUpdate && pCategoryId === '0') {
            // 获取对应的二级分类列表
            const subCategories = await this.getCategories(pCategoryId)
            // 生成二级拉下列表的options
            const childrenOptions = subCategories.map(item => ({
                value: item._id,
                label: item.name
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(
                option => option.value === pCategoryId
            )
            // 关联到对应的一级option上
            targetOption.children = childrenOptions
        }

        this.setState({ options })
    }

    // 异步获取一级/二级分类列表，并显示
    // async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    getCategories = async parentId => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            const categories = result.data
            // 如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                // 返回二级列表 ===> 当前async函数返回的promise就会成功且值为categories
                return categories
            }
        }
    }
    submit = () => {
        // 进行表单验证
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                console.log('submit()', values)
                // 1. 收集数据,并封装成product对象
                const { name, desc, price, categoriesIds } = values
                let pCategoryId, categoryId
                if (categoriesIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoriesIds[0]
                } else {
                    pCategoryId = categoriesIds[0]
                    categoryId = categoriesIds[1]
                }
                // 借助ref 把子组件的函数暴露给父组件调用
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                console.log('imgs', imgs, detail)

                const product = {
                    name,
                    desc,
                    price,
                    pCategoryId,
                    categoryId,
                    imgs,
                    detail
                }
                // 如果是更新，需要添加_id
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                // 2. 调用接口请求函数去添加/更新数据
                const result = await reqAddOrUpdateProduct(product)
                // 3. 根据结果提示
                if (result.status === 0) {
                    message.success(
                        `${this.isUpdate ? '更新' : '添加'}商品成功！！！`
                    )
                    this.props.history.goBack()
                } else {
                    message.error(
                        `${this.isUpdate ? '更新' : '添加'}商品失败！！！`
                    )
                }
            }
        })
    }
    // 自定义验证商品价格
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            // 验证通过
            callback()
        } else {
            // 验证不通过
            callback('价格必须大于0')
        }
    }
    // 用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true

        // 根据选中的分类，请求获取二级分类列表
        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false
        if (subCategories && subCategories.length > 0) {
            // 生成一个二级列表的options
            const childrenOptions = subCategories.map(item => ({
                value: item._id,
                label: item.name
            }))
            // 关联到当前option上
            targetOption.children = childrenOptions
        } else {
            // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        // 更新options状态
        this.setState({ options: [...this.state.options] })
    }

    componentWillMount() {
        // 取出携带的state
        // 如果是添加则没值，如果是修改则有值
        const product = this.props.location.state
        // 保存一个是否是更新的标识
        this.isUpdate = !!product
        // 保存商品信息(如果没有，保存的是空对象)
        this.product = product || {}
    }
    componentDidMount() {
        this.getCategories('0')
    }
    render() {
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        // 用来接收级联分类ID的数组
        const categoriesIds = []
        if (isUpdate) {
            // 一级分类下的商品
            if (pCategoryId === '0') {
                categoriesIds.push(categoryId)
            } else {
                // 二级分类下的商品
                categoriesIds.push(pCategoryId)
                categoriesIds.push(categoryId)
            }
        }
        // 指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 }, // 左侧label的宽度
            wrapperCol: { span: 8 } // 指定右侧包裹的宽度
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type="arrow-left" />
                </LinkButton>
                <span>{isUpdate ? '更新商品' : '添加商品'}</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                { required: true, message: '必须输入商品名称' }
                            ]
                        })(<Input placeholder="商品名称" />)}
                    </Item>
                    <Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                { required: true, message: '必须输入商品描述' }
                            ]
                        })(
                            <TextArea
                                placeholder="商品描述"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                            />
                        )}
                    </Item>
                    <Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: '必须输入商品价格' },
                                { validator: this.validatePrice }
                            ]
                        })(
                            <Input
                                placeholder="商品价格"
                                type="number"
                                addonAfter="元"
                            />
                        )}
                    </Item>
                    <Item label="商品分类">
                        {getFieldDecorator('categoriesIds', {
                            initialValue: categoriesIds,
                            rules: [
                                { required: true, message: '必须输入商品分类' }
                            ]
                        })(
                            <Cascader
                                placeholder="请指定商品分类"
                                // 需要显示的列表数据数组
                                options={this.state.options}
                                // 当选择某个列表项，加载下一级列表的监听回调
                                loadData={this.loadData}
                            />
                        )}
                    </Item>
                    <Item label="商品图片">
                        {/* 借助ref 把子组件的函数暴露给父组件调用 */}
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item
                        label="商品详情"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>
                            提交
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)

/*
    1. 子组件调用父组件的方法，将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
    2. 父组件调用子组件的方法：在父组件只能通过ref得到子组件标签对象(也就是组件对象),调用其方法
*/
