// 柱状图路由
import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

// 后台管理的柱状图路由组件
class Bar extends Component {
    state = {
        sales: [5, 20, 36, 10, 10, 20], // 效率数组
        stores: [6, 21, 3, 20, 39, 23] // 库存数组
    }

    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.reduce((pre, store) => {
                pre.push(store - 1)
                return pre
            }, [])
        }))
    }

    // 返回柱状图的对象配置
    getOption = (sales, stores) => ({
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量', '库存']
        },
        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
            {
                name: '销量',
                type: 'bar',
                data: sales
            },
            {
                name: '库存',
                type: 'bar',
                data: stores
            }
        ]
    })
    render() {
        const { sales, stores } = this.state
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.update}>
                        更新
                    </Button>
                </Card>
                <Card title="柱状图一">
                    <ReactEcharts option={this.getOption(sales, stores)} />
                </Card>
            </div>
        )
    }
}

export default Bar
