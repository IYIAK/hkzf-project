import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
// import axios from 'axios'
import { API } from '../../utils/api'

import { getCurrentCity } from '../../utils'
import { BASE_URL } from "../../utils/url"

// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import SearchHeader from '../../components/SearchHeader'
// 导入样式
import "./index.scss"


// 导航菜单数据
const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/map'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/rent'
    }
]

navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
})



export default class Index extends Component {

    state = {
        swiper: [],
        isSwiperLoaded: false,
        groups: [],
        news: [],
        currentCityName: '上海'
    }

    async getSwiper() {
        const res = await API.get('/home/swiper')
        // console.log(res)
        this.setState({ swiper: res.data.body, isSwiperLoaded: true })
    }

    async getGroups() {
        const res = await API.get('/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        // console.log(res);
        this.setState({ groups: res.data.body })
    }

    async getNews() {
        const res = await API.get('/home/news', {
            params: {
                area: "AREA%7C88cff55c-aaa4-e2e0"
            }
        })
        console.log(res);
        this.setState({ news: res.data.body })
    }

    async componentDidMount() {
        this.getSwiper()
        this.getGroups()
        this.getNews()

        const curCity = await getCurrentCity()
        this.setState({ currentCityName: curCity.label })

    }

    renderSwiper() {
        // console.log('renderSwipeer', this.state.swiper)
        return this.state.swiper.map(val => (
            <a
                key={val.id}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
                <img
                    src={BASE_URL + val.imgSrc}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))
    }

    renderNavs() {
        // console.log('navs', navs);
        return navs.map((val) =>
            /* 这里箭头函数千万要注意，map必须要有返回值，也就是返回DOM节点，否则renderNavs就是return了个寂寞 */
            /* 返回值可以写return，也可以直接去掉花括号写DOM */
            <Flex.Item key={val.id} onClick={() => this.props.history.push(val.path)}>         {/*这里的onclick回调函数也要写成返回值形式，否则的话赋值时就会直接执行push操作*/}
                <img src={val.img} alt="" />
                <h2>{val.title}</h2>
            </Flex.Item>
        )
    }

    renderNews() {
        return this.state.news.map((item) => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img src={BASE_URL + item.imgSrc} alt="" />
                </div>
                <Flex className="content" direction='column' justify="between">  {/* 用 Flex必须在css里设置好宽度或高度 */}
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        )
        )
    }


    render() {
        return (
            <div className="index">
                {/* 搜索框 */}
                <SearchHeader cityName={this.state.currentCityName}></SearchHeader>


                {/* 轮播图 */}
                <div className="swiper">  {/* 轮播图外侧放一个固定高度的盒子，防止图没加载出来前下面的元素位置不对 */}
                    {
                        this.state.isSwiperLoaded ?  /* swiper数据获取完毕后再加载轮播图组件，否则会出现高度不对和不会自动滚动的bug */
                            <Carousel
                                autoplay={true}
                                infinite
                            >
                                {this.renderSwiper() /* 这里必须写()，原先是直接先map的，但是如果放在函数里，map就是作为返回值了，不调用函数的话不会执行map */}
                            </Carousel> : ''
                    }
                </div>

                {/* 菜单项 */}
                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>

                {/* 租房小组 */}
                <div className="group">
                    <h3 className="title">
                        租房小组 <span className="more">更多</span>
                    </h3>
                    <Grid data={this.state.groups} square={false} hasLine={false} columnNum={2} renderItem={(item) => {
                        return (
                            <Flex className="group-item" justify="around" key={item.id}>
                                <div className="desc">
                                    <p className="title">{item.title}</p>
                                    <span className="info">{item.desc}</span>
                                </div>
                                <img src={BASE_URL + item.imgSrc} alt="" />
                            </Flex>
                        )
                    }} />

                </div>

                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="title">最新资讯</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>

            </div>
        )
    }
}
