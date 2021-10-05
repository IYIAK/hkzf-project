import React, { Component } from 'react'

// 导入样式 
//  ！！！很重要！！！
import './index.scss'

export default class Map extends Component {

    componentDidMount() {
        // 初始化地图实例
        // 注意：在脚手架中全局对象需要使用window来访问，否则会造成ESLint校验错误
        var map = new window.BMapGL.Map("container");
        // 设置中心点坐标
        const point = new window.BMapGL.Point(116.404, 39.915);
        // 初始化地图
        map.centerAndZoom(point, 15);
    }


    render() {
        return (
            <div className="map">
                {/* 地图容器元素 */}
                <div id="container"></div>
            </div>
        )
    }
}
