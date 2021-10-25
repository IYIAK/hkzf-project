import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile';

import PropTypes from 'prop-types'

import './index.scss'

class NavHeader extends Component {
    render() {
        return (
            <NavBar
                mode="light"
                icon={< i className="iconfont icon-back" />}
                onLeftClick={this.props.onLeftClick === undefined ? () => this.props.history.goBack() : this.props.onLeftClick}
            >
                {this.props.children}
            </NavBar >

        )
    }
}

// 添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}


// withRouter是高阶组件，返回值也是组件，能够给没有history的组件提供history
export default withRouter(NavHeader)
