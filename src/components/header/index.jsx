import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import { connect } from 'react-redux'

import { logout } from '../../redux/actions'
import { reqWeather } from '../../api/index'
import formateDate from '../../utils/dateUtils'

import LinkButton from '../link-button'
import './index.less'
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }
    getTime = () => {
        // 每隔一秒获取当前世界，并更新状态数据currentTime
        this.timer = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    getWeather = async () => {
        // 调用接口请求函数
        const { dayPictureUrl, weather } = await reqWeather('南京')
        this.setState({ dayPictureUrl, weather })
    }
    /* getTitle = () => {
        const chooseKey = memoryUtils.chooseKey
        let result = ''
        for (let item of menuList) {
            if (item.key === chooseKey) {
                result = item.title
            } else if (item.children) {
                const cItem = item.children.find(
                    cItem => cItem.key === chooseKey
                )
                if (cItem) {
                    result = cItem.title
                }
            }
        }
        return result
    } */

    // 退出登录
    logout = () => {
        // 显示确认框
        Modal.confirm({
            title: '确定退出吗？',
            onOk: () => {
                this.props.logout()
            }
        })
    }

    // 第一次render之后执行一次
    // 一般在此执行异步操作：发ajax/启动定时器
    componentDidMount() {
        // 获取当前的世界
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        const { username } = this.props.user
        const { currentTime, dayPictureUrl, weather } = this.state
        // let chooseTitle = this.getTitle()

        let chooseTitle = this.props.headTitle

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{chooseTitle}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        headTitle: state.headTitle,
        user: state.user
    }),
    { logout }
)(withRouter(Header))
