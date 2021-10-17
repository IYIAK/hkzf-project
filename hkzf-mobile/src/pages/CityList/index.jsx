import React, { Component } from 'react'
import { Toast } from 'antd-mobile';
import axios from 'axios'
import { AutoSizer, List } from 'react-virtualized';

import NavHeader from '../../components/NavHeader'

// 引入样式文件
import "./index.scss"

// 导入utils从中获取当前城市的函数
import { getCurrentCity } from '../../utils'


const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

// 格式化城市列表,按首字母分类\排序
function formatCityList(list) {
    let cityList = {}
    let cityIndex = []

    list.forEach(i => {    // 遍历数组最好还是用forEach吧，for（let i in Arr)的i是序号
        let first = i.short.substr(0, 1)
        if (cityList[first]) {
            cityList[first].push(i)
        } else {
            cityList[first] = [i]
        }
    });
    // console.log(cityList);

    cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}

function fromatCityIndex(letter) {
    switch (letter) {
        case '#':
            return "当前定位"
        case '热':
            return "热门城市"
        default:
            return letter.toUpperCase()
    }
}

// List data as an array of strings
// const list = Array(100).fill('123456')


export default class CityList extends Component {

    state = {
        cityIndex: [],
        cityList: {},
        activeIndex: 0
    }

    async componentDidMount() {
        await this.getCityList()  //async函数的返回值就是promise对象


        // this.getCityList()

        //调用measureAllRows，提前计算List中每一行的高度，实现scrollToRow精确跳转
        this.cityListComponent.measureAllRows()
    }


    async getCityList() {
        Toast.loading('加载中...', 0, null, false)

        // 获取所有城市
        const res = await axios.get("http://localhost:8080/area/city?level=1")
        // console.log(res);
        const { cityList, cityIndex } = formatCityList(res.data.body)

        // 获取热门城市
        const hotRes = await axios.get("http://localhost:8080/area/hot")
        cityList['热'] = hotRes.data.body
        cityIndex.unshift('热')


        // 获取当前城市
        const curCity = await getCurrentCity()
        // console.log(curCity);
        cityList['#'] = [curCity]
        cityIndex.unshift('#')

        Toast.hide()

        // console.log(cityList, cityIndex);
        // console.log('this2', this);
        this.setState({ cityIndex, cityList })

    }


    //点击城市后的操作
    changeCity = ({ label, value }) => {
        if (HOUSE_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))  //存入本地缓存
            this.props.history.goBack()  //回到上一页
        } else {
            Toast.info('该城市暂无房源数据', 1, null, false)  //轻提示组件
        }

    }

    //每一行的内容
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // 每一行的index
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // 每一行的style,千万不能去掉
    }) => {

        // console.log('this', this);
        const { cityIndex, cityList } = this.state
        let letter = cityIndex[index]

        return (
            // <div key={key} style={style} >
            //     {list[index]} {index}
            // </div>

            <div key={key} style={style} className="city">
                <div className="title">{fromatCityIndex(letter)}</div>
                {cityList[letter].map((val) => {
                    return <div className="name" key={val.value} onClick={() => {  //这里不能写形参，写了形参下面的val就是形参了，不写的话根据闭包，val就是外部的val
                        this.changeCity(val)
                    }}>{val.label}</div>
                })}
            </div>
        );
    }

    // 计算每一行的高度(一个首字母为一行)
    getRowHeight = ({ index }) => {
        const { cityIndex, cityList } = this.state
        let letter = cityIndex[index]
        return cityList[letter].length * 36 + 40
    }

    // 渲染索引列表
    renderCityIndex() {
        return this.state.cityIndex.map((val, index) => {
            return (
                <li className="city-index-item" key={index}
                    onClick={() => {
                        // console.log("index", index)
                        this.cityListComponent.scrollToRow(index) //调用了list的滚动到指定行的方法
                    }}>
                    <span className={this.state.activeIndex === index ? "index-active" : ""} key={val}>{val.toUpperCase()}</span>
                </li >
            )
        })
    }


    // 用于获取list渲染到了哪一行
    onRowsRendered = ({ startIndex }) => {

        // 设置索引高亮
        if (this.state.activeIndex !== startIndex)
            this.setState({ activeIndex: startIndex })
    }


    render() {
        return (
            <div className="citylist">

                {/* 顶部导航栏 */}
                <NavHeader>城市选择</NavHeader>


                {/* 城市列表 */}
                <AutoSizer>
                    {
                        ({ height, width }) => {  //render-props模式,参数大概是解构赋值
                            return (
                                <List
                                    ref={(c) => this.cityListComponent = c}
                                    width={width}
                                    height={height}
                                    rowCount={this.state.cityIndex.length}
                                    rowHeight={this.getRowHeight}
                                    rowRenderer={this.rowRenderer}
                                    onRowsRendered={this.onRowsRendered}
                                    scrollToAlignment="start"  //控制执行了scrollToRow后对应行出现在页面的位置，start就是出现在顶端
                                />
                            )
                        }
                    }
                </AutoSizer>


                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>

            </div>
        )
    }
}
