import React from 'react'
import { Flex } from 'antd-mobile'
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

import './index.scss'

function SearchHeader({ history, cityName, className }) {
    return (
        <Flex className={`search-box ${className ? className : ''}`}>
            <Flex className="search">

                {/* 城市名 */}
                <div
                    className="location"
                    onClick={() => history.push('/citylist')}
                >
                    <span className="name">{cityName}</span>
                    <i className="iconfont icon-arrow"></i>
                </div>

                {/* 搜索框 */}
                <div
                    className="form"
                    onClick={() => history.push('/search')}
                >
                    <i className="iconfont icon-seach"></i>
                    <span className="text">请输入小区或地址</span>
                </div>
            </Flex>
            <i
                className="iconfont icon-map"
                onClick={() => history.push('/map')}
            ></i>
        </Flex>
    )
}

// 添加属性校验
SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired
}


export default withRouter(SearchHeader)