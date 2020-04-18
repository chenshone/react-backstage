// 角色管理路由
import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { connect } from 'react-redux'

import AddForm from './add-form'
import AuthForm from './auth-form'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import formateDate from '../../utils/dateUtils'
import { logout } from '../../redux/actions'
class Role extends Component {
    state = {
        roles: [], // 所有角色的列表
        role: {}, // 选择的role
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false // 是否显示设置权限界面
    }
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumns() {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: create_time => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    onRow = role => {
        return {
            onClick: event => {
                // 点击行
                this.setState({ role })
            }
        }
    }

    // 添加角色
    addRole = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                this.setState({ isShowAdd: false })
                const { roleName } = values
                this.form.resetFields()

                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('添加角色成功')
                    const role = result.data
                    // const roles = this.state.roles
                    /* let roles = [...this.state.roles]
                    roles.push(role)
                    this.setState({ roles }) */

                    // 更新roles状态：基于原本状态数据更新
                    this.setState((state, props) => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error('添加角色失败')
                }
            }
        })
    }

    // 更新角色权限
    updateRole = async () => {
        this.setState({ isShowAuth: false })
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = this.props.user.username
        role.auth_time = Date.now()
        const result = await reqUpdateRole(role)

        if (result.status === 0) {
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                message.success('当前用户更新权限成功，请重新登录')
            } else {
                message.success('更新权限成功')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        } else {
            message.error('更新权限失败')
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button
                    type="primary"
                    onClick={() => this.setState({ isShowAdd: true })}>
                    创建角色
                </Button>
                &nbsp;&nbsp;
                <Button
                    type="primary"
                    disabled={!role._id}
                    onClick={() => this.setState({ isShowAuth: true })}>
                    设置用户权限
                </Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    bordered
                    rowKey="_id"
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        // 选择某个radio时回调
                        onSelect: role => {
                            this.setState({ role })
                        }
                    }}
                    onRow={this.onRow}></Table>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({ isShowAdd: false })
                        this.form.resetFields()
                    }}>
                    <AddForm
                        setForm={form => {
                            this.form = form
                        }}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}>
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}

export default connect(state => ({ user: state.user }), { logout })(Role)
