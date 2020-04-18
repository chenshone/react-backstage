// 用于图片上传的组件
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'

import { BASE_IMG_URL } from '../../utils/constants'
import { reqDeleteImg } from '../../api'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }

    // state = {
    //     previewVisible: false, // 标识是否显示大图预览Modal
    //     previewImage: '', // 大图的url
    //     fileList: [
    //         /* {
    //             uid: '-1', // 每个file都有自己唯一的id
    //             name: 'image.png',  // 图片文件名
    //             status: 'done',  // 图片状态,done-已上传,uploading-正在上传中,removed-已删除
    //             url:
    //                 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    //         } */
    //     ]
    // }

    constructor(props) {
        super(props)

        let fileList = []
        // 如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id
                name: img, // 图片文件名
                status: 'done', // 图片状态,done-已上传,uploading-正在上传中,removed-已删除
                url: BASE_IMG_URL + img
            }))
        }
        // 初始化状态
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的url
            fileList // 所有已上传图片的数组
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    // 显示大图
    handlePreview = async file => {
        console.log('handlePreview()', file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        })
    }
    /*
        file:当前操作的图片文件(上传/删除)
        fileList:所有已上传图片文件对象的数组
    */
    handleChange = async ({ file, fileList }) => {
        console.log('handleChange()', file.status, file)

        // 一旦上传成功，将当前上传的file的信息修正(缺少name,url)
        if (file.status === 'done') {
            const result = file.response // {status:0,data:{name:'xxx.jpg',url:'xxxx'}}
            if (result.status === 0) {
                message.success('上传图片成功！')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败！')
            }
        } else if (file.status === 'remove') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功！')
            } else {
                message.error('删除图片失败！')
            }
        }

        // 在操作过程中更新fileList状态
        this.setState({ fileList })
    }

    // 获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        )
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload" // 上传图片接口地址
                    accept="image/*" // 只接收图片格式
                    name="image" // 请求参数名
                    listType="picture-card" // 卡片样式
                    fileList={fileList} // 所有已上传的文件的列表数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img
                        alt="example"
                        style={{ width: '100%' }}
                        src={previewImage}
                    />
                </Modal>
            </div>
        )
    }
}

export default PicturesWall
