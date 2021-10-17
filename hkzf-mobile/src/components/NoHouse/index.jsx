import React from 'react'
import PropTypes from 'prop-types'
import { BASE_URL } from "../../utils/url";
import './index.scss'

const NoHouse = ({ children }) => (
    <div>
        <div className="noHouseRoot">
            <img src={BASE_URL + '/img/not-found.png'} alt="暂无数据" className="img" />
            <p className="msg">{children}</p>
        </div>
    </div>
)


NoHouse.protoTypes = {
    children: PropTypes.string.isRequired
}

export default NoHouse