import React, { PureComponent } from 'react'
import { Tree, Input, Form } from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig'
const { TreeNode } = Tree
const { Item } = Form

class AuthForm extends PureComponent {
    static propTypes = {
        role: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)

        // 根据传入角色的menus生成初始状态
        const { menus } = this.props.role
        this.state = { checkedKeys: menus }
    }

    // 为父组件提交获取最近menus数据的方法
    getMenus = () => this.state.checkedKeys
    renderTreeNodes = menuList =>
        menuList.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.key} {...item} />
        })

    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys)
        this.setState({ checkedKeys })
    }
    componentWillMount() {
        this.treeNodes = this.renderTreeNodes(menuList)
    }

    // 根据新传入的role来更新checkedKeys状态
    // 当组件接受到新的props时调用，在render之前执行
    componentWillReceiveProps(nextProps) {
        const { menus } = nextProps.role
        this.setState({ checkedKeys: menus })
    }
    render() {
        const { checkedKeys } = this.state
        const { role } = this.props
        // 指定item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 20 } // 指定右侧包裹的宽度
        }

        return (
            <div>
                <Item label="角色名称" {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}

export default AuthForm
