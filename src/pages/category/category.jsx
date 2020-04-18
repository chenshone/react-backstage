// 商品分类路由
import React, { Component } from 'react'
import { Card, Icon, Button, Table, message, Modal } from 'antd'

import { reqCategories, reqAddCategory, reqUpdateCategory } from '../../api'
import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateForm from './update-form'

class Category extends Component {
    state = {
        categories: [], // 一级分类列表
        loading: true, //是否正在获取数据中
        parentId: '0', // 当前需要显示的分类列表的parentId
        parentName: '', //当前需要显示的分类列表的父分类名称
        subCategories: [], //二级分类列表
        showStatus: 0 // 标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }

    // 初始化table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name' // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: product => (
                    // 参数为当前行的值
                    // 返回需要显示的界面标签
                    <span>
                        <LinkButton
                            onClick={() => this.showUpdateCategory(product)}
                        >
                            修改分类
                        </LinkButton>
                        {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理的函数，并传入数据 */}
                        {this.state.parentId === '0' ? (
                            <LinkButton
                                onClick={() => this.showSubCategories(product)}
                            >
                                查看子分类
                            </LinkButton>
                        ) : null}
                    </span>
                )
            }
        ]
    }

    // 异步获取一级/二级分类列表显示
    // parentId:如果没有指定，就根据状态中的parentId请求，如果指定了就根据指定的请求
    getCategories = async parentId => {
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            // 取出分类数组(可能是一级也可能是二级)
            const categories = result.data
            // 更新状态
            if (parentId === '0') this.setState({ categories, loading: false })
            else this.setState({ subCategories: categories, loading: false })
        } else {
            message.error('获取分类列表失败')
        }
    }

    // 显示一级分类列表
    showFirstCategories = () => {
        // 更新为显示一级列表的状态
        this.setState({ parentId: '0', parentName: '', subCategories: [] })
    }

    // 显示指定一级分类对象的二级子列表
    showSubCategories = category => {
        // 更新状态
        this.setState(
            { parentId: category._id, parentName: category.name },
            () => {
                // 在状态更新且重新render后执行
                // console.log('parentId1', this.state.parentId)
                this.getCategories()
            }
        )
        // console.log('parentId0', this.state.parentId) // '0'
    }

    // 响应点击取消：隐藏确认框
    handleCancel = () => {
        // 重置一组输入控件的值与状态，如不传入参数，则重置所有组件
        this.form.resetFields()
        // 隐藏确认框
        this.setState({ showStatus: 0 })
    }
    // 显示添加确认框
    showAddCategory = () => {
        this.setState({ showStatus: 1 })
    }
    // 添加分类
    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ showStatus: 0 })

                // 收集数据并提交添加分类的请求
                const { parentId, categoryName } = values
                // 重置一组输入控件的值与状态，如不传入参数，则重置所有组件
                this.form.resetFields()
                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    // 添加的分类就是当前分类列表下的分类
                    // 重新获取当前分类列表显示
                    if (parentId === this.state.parentId) this.getCategories()
                    // 在二级分类列表下添加一级分类，重新获取一级分类列表，但不需要显示一级列表
                    else if (parentId === '0') this.getCategories('0')
                }
            }
        })
    }
    // 显示更新确认框
    showUpdateCategory = product => {
        console.log(product)
        // 保存分类对象
        this.category = product
        this.setState({ showStatus: 2 })
    }
    // 更新分类
    updateCategory = () => {
        // 进行表单验证,只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 1. 隐藏确认框
                this.setState({ showStatus: 0 })

                const categoryId = this.category._id
                const { categoryName } = values
                // 重置一组输入控件的值与状态，如不传入参数，则重置所有组件
                this.form.resetFields()
                // 2. 发请求更新分类
                const result = await reqUpdateCategory({
                    categoryId,
                    categoryName
                })
                if (result.status === 0) {
                    // 3. 重新显示列表
                    this.getCategories()
                }
            }
        })
    }

    // 为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    // 执行异步任务：发异步ajax请求
    // 发异步ajax请求
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategories()
    }

    render() {
        // 读取状态数据
        const {
            categories,
            loading,
            parentId,
            subCategories,
            parentName,
            showStatus
        } = this.state

        // 读取指定的分类
        const category = this.category || {}

        // card的左侧
        const title =
            parentId === '0' ? (
                '一级分类列表'
            ) : (
                <span>
                    <LinkButton onClick={this.showFirstCategories}>
                        一级分类列表
                    </LinkButton>
                    <Icon type="arrow-right" style={{ marginRight: 5 }} />
                    <span>{parentName}</span>
                </span>
            )
        // card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAddCategory}>
                <Icon type="plus" />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    loading={loading}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm={form => {
                            this.form = form
                        }}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    {/* setForm属性：
                            将子组件的form对象传递给父组件的this.form */}
                    <UpdateForm
                        categoryName={category.name}
                        setForm={form => {
                            this.form = form
                        }}
                    />
                </Modal>
            </Card>
        )
    }
}

export default Category
