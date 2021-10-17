import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import axios from 'axios'
// 用API封装了axios，设置了baseUrl，不用每次写url前面的重复部分
import { API } from '../../utils/api'
import { Toast } from 'antd-mobile'
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'


// 导入样式 
//  ！！！很重要！！！
import './index.scss'
import { BASE_URL } from '../../utils/url'

// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL

export default class Map extends Component {

    state = {
        housesList: [],
        isShowList: false
    }

    componentDidMount() {
        this.initMap()

    }



    // 与地图有关的所有操作
    initMap = () => {
        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))

        // 初始化地图实例
        // 注意：在脚手架中全局对象需要使用window来访问，否则会造成ESLint校验错误
        const map = new BMapGL.Map("container");

        // 将map变为实例对象，让其他方法也能调用到map
        this.map = map

        // 创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async (point) => {
            if (point) {
                map.centerAndZoom(point, 11);

                // 添加常用控件
                map.addControl(new BMapGL.ZoomControl())
                map.addControl(new BMapGL.ScaleControl())

                map.addEventListener('movestart', () => {
                    if (this.state.isShowList)
                        this.setState({ isShowList: false })
                })

                this.renderOverlays(value)

            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
    }


    /* 
        缩放和清除所有覆盖物由创建圆形的方法createCircle()中，设置每个圆形的点击事件时设置
        这样能方便的获取到调用centerAndZoom()时所需的中心坐标，由点击事件处理放大、清除操作
        这样renderOverlays()就只需要负责获取数据、判断下一次缩放级别以及type类型即可
        关于nextZoom参数,是用确定点击事件时的放大级别的，其他地方用不到(那为什要这么早就获取？最后再获取不行吗？)
    */
    async renderOverlays(id) {
        try {
            Toast.loading('加载中…', 0, null, false)

            const res = await API.get(`/area/map?id=${id}`)

            Toast.hide()
            const data = res.data.body

            // 获取缩放级别和类型
            const { nextZoom, type } = this.getTypeAndZoom()

            data.forEach(item => {
                // 创建覆盖物
                this.createOverlays(item, nextZoom, type)
            })
        } catch (e) {
            Toast.hide()
        }
    }

    getTypeAndZoom() {
        // 调用地图的getZoom()方法获取当前缩放级别
        const zoom = this.map.getZoom()
        let nextZoom, type

        if (zoom >= 10 && zoom < 12) {
            //区
            nextZoom = 13
            type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
            //镇
            nextZoom = 15
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            type = 'rect'
        }

        return {
            nextZoom,
            type
        }
    }

    createOverlays(data, nextZoom, type) {
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value
        } = data

        // 创建坐标对象
        const areaPoint = new BMapGL.Point(longitude, latitude)

        if (type === 'circle') {
            // 区或镇
            this.createCircle(areaPoint, areaName, count, value, nextZoom)
        } else {
            this.createRect(areaPoint, areaName, count, value)
        }
    }

    // 创建圆形
    createCircle(areaPoint, areaName, count, value, nextZoom) {
        const opts = {
            position: areaPoint,
            offset: new BMapGL.Size(-35, -35)
        }

        // 设置setContent后，第一个参数的文本就没用了 
        const label = new BMapGL.Label('', opts)

        label.id = value

        // 设置内容
        label.setContent(`
        <div class='bubble'>
            <p class='name'>${areaName}</p>
            <p>${count}套</p>
        </div>
        `)

        // 设置样式
        label.setStyle({
            cursor: 'pointer',
            border: '0px solid rgba(255,0,0)',
            padding: '0px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: 'rgb(255,255,255)',
            textAlign: 'center'
        })

        label.addEventListener('click', () => {
            // console.log('房源被点击了', label.id);

            //以选中处为中心放大地图
            this.map.centerAndZoom(areaPoint, nextZoom)

            // 清除当前覆盖物信息
            this.map.clearOverlays()

            this.renderOverlays(value)

        })

        this.map.addOverlay(label)
    }

    // 创建小区覆盖物（方形）
    createRect(areaPoint, areaName, count, value) {
        const opts = {
            position: areaPoint,
            offset: new BMapGL.Size(-50, -28)
        }

        // 设置setContent后，第一个参数的文本就没用了 
        const label = new BMapGL.Label('', opts)

        label.id = value

        // 设置内容
        label.setContent(`
        <div class='rect'>
            <span class='houseName'>${areaName}</span>
            <span class='houseNum'>${count}套</span>
            <i class='arrow'></i>
        </div>
        `)

        // 设置样式
        label.setStyle({
            cursor: 'pointer',
            border: '0px solid rgba(255,0,0)',
            padding: '0px',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            color: 'rgb(255,255,255)',
            textAlign: 'center'
        })

        label.addEventListener('click', e => {
            // console.log('小区被点击了', label.id);

            this.getHouseList(value)
            // this.map.centerAndZoom(areaPoint)

            // 获取当前被点击项
            console.log(e);
            const target = e.domEvent.changedTouches[0]
            // console.log();
            // 移动地图，使点击的小区移动到地图中心
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY
            )

        })

        this.map.addOverlay(label)
    }

    //获取小区房源数据
    async getHouseList(value) {
        try {
            Toast.loading('加载中…', 0, null, false)
            const res = await API.get(`/houses?cityId=${value}`)
            Toast.hide()
            // console.log('res', res);
            this.setState({ housesList: res.data.body.list, isShowList: true })
        } catch (e) {
            Toast.hide()
        }


    }


    renderHouseList() {
        return this.state.housesList.map(item => (
            <HouseItem
                key={item.houseCode}
                src={BASE_URL + item.houseImg}
                title={item.title}
                desc={item.desc}
                tags={item.tags}
                price={item.price}
            />
        ))
    }


    render() {
        return (
            <div className="map">
                <NavHeader>地图找房</NavHeader>
                {/* 地图容器元素 */}
                <div id="container"></div>


                {/* 房源列表 */}
                {/* 添加 styles.show 展示房屋列表 */}
                <div
                    className={`houseList  ${this.state.isShowList ? 'show' : ''}`}  /* ${this.state.isShowList ? 'show' : ''} */
                >
                    <div className='titleWrap'>
                        <h1 className='listTitle'>房屋列表</h1>
                        <Link className='titleMore' to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className='houseItems'>
                        {/* 房屋结构 */}
                        {this.renderHouseList()}
                    </div>
                </div>
            </div>
        )
    }
}
