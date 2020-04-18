import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'

import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option
// product的默认子路由组件
class ProductHome extends Component {
    state = {
        total: 0, //商品的总数量
        products: [], // 商品的数组
        loading: false, // 是否正在加载中
        searchName: '', // 搜索关键字
        searchType: 'productName' // 根据哪个字段搜索
    }
    // 初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: price => '￥' + price // 当前指定了对应的dataIndex属性，所以传入的是对应的属性值
            },
            {
                title: '状态',
                width: 100,
                render: product => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.updateStatus(_id, status === 1 ? 2 : 1)
                                }}>
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: product => {
                    return (
                        <span>
                            <LinkButton
                                onClick={() => {
                                    // 将product对象使用state传递给目标路由组件
                                    this.props.history.push('/product/detail', {
                                        product
                                    })
                                }}>
                                详情
                            </LinkButton>
                            <LinkButton
                                onClick={() => {
                                    // 将product对象使用state传递给目标路由组件
                                    this.props.history.push(
                                        '/product/addupdate',
                                        product
                                    )
                                }}>
                                修改
                            </LinkButton>
                        </span>
                    )
                }
            }
        ]
    }

    // 更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    // 获取指定页码的列表数据显示
    getProducts = async pageNum => {
        // 保存pageNum
        this.pageNum = pageNum
        this.setState({ loading: true }) // 显示loading
        const { searchName, searchType } = this.state
        let result
        // searchName如果有值，说明我们要做搜索分页
        if (searchName) {
            result = await reqSearchProducts({
                pageNum,
                pageSize: PAGE_SIZE,
                searchName,
                searchType
            })
        } else {
            // 一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({ loading: false }) // 隐藏loading
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({ total, products: list })
        }
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        // 取出状态数据
        const { products, total, loading, searchName, searchType } = this.state

        const title = (
            <span>
                <Select
                    defaultValue={searchType}
                    style={{ width: 150 }}
                    onChange={value => this.setState({ searchType: value })}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{ width: 200, margin: '0 15px' }}
                    value={searchName}
                    onChange={e =>
                        this.setState({ searchName: e.target.value })
                    }
                />
                <Button
                    type="primary"
                    onClick={() => {
                        this.getProducts(1)
                    }}>
                    搜索
                </Button>
            </span>
        )
        const extra = (
            <Button
                type="primary"
                onClick={() => {
                    this.props.history.push('/product/addupdate')
                }}>
                <Icon type="plus" />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    bordered
                    dataSource={products}
                    columns={this.columns}
                    rowKey="_id"
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}

export default ProductHome
