import React from 'react'
import './index.less'

// 外形像链接的按钮
const LinkButton = props => {
    return (
        <button {...props} className="link-button">
            {props.children}
        </button>
    )
}

export default LinkButton
