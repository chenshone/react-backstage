// 用户管理路由
import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import UserForm from './user-form'
import LinkButton from '../../components/link-button'
import formateDate from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
class User extends Component {
    state = {
        users: [],
        roles: [],
        isShow: false
    }
    // 初始化table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: role_id => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: user => (
                    // 参数为当前行的值
                    // 返回需要显示的界面标签
                    <span>
                        <LinkButton
                            onClick={() => {
                                this.showUpdate(user)
                            }}>
                            修改
                        </LinkButton>

                        <LinkButton onClick={() => this.deleteUser(user)}>
                            删除
                        </LinkButton>
                    </span>
                )
            }
        ]
    }

    showUpdate = user => {
        this.user = user
        this.setState({ isShow: true })
    }

    deleteUser = user => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            }
        })
    }
    // 根据roles数组，生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = roles => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    addOrUpdateUser = async () => {
        this.setState({ isShow: false })
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        if (this.user) {
            user._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(user)

        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功！`)
            this.getUsers()
        }
    }

    showAdd = () => {
        this.user = null
        this.setState({ isShow: true })
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({ users, roles })
        }
    }
    // 为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { users, isShow, roles } = this.state
        const user = this.user || {}
        const title = (
            <Button type="primary" onClick={this.showAdd}>
                创建用户
            </Button>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ isShow: false })
                        this.form.resetFields()
                    }}>
                    <UserForm
                        setForm={form => {
                            this.form = form
                        }}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}

export default User
