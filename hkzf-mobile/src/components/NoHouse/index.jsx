import React from 'react'
import PropTypes from 'prop-types'
import { BASE_URL } from "../../utils/url";
import './index.scss'


/* 房源列表页无数据时的提示页 */
const NoHouse = ({ children }) => (
    <div>
        <div className="noHouseRoot">
            <img src={BASE_URL + '/img/not-found.png'} alt="暂无数据" className="img" />
            <p className="msg">{children}</p>
        </div>
    </div>
)


NoHouse.protoTypes = {
    children: PropTypes.node.isRequired
}

export default NoHouse