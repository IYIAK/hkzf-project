import React, { Component } from 'react'
import { NavBar } from 'antd-mobile';
import axios from 'axios'
import { AutoSizer, List } from 'react-virtualized';
// 引入样式文件
import "./index.scss"

// 导入utils从中获取当前城市的函数
import { getCurrentCity } from '../../utils'


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

// List data as an array of strings
const list = Array(100).fill('123456')

function rowRenderer({
    key, // Unique key within array of rows
    index, // 每一行的index
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // 每一行的style,千万不能去掉
}) {
    return (
        <div key={key} style={style}>
            {list[index]} {index}
        </div>
    );
}


export default class CityList extends Component {

    componentDidMount() {
        this.getCityList()
    }


    async getCityList() {
        // 获取所有城市
        const res = await axios.get("http://localhost:8080/area/city?level=1")
        // console.log(res);
        const { cityList, cityIndex } = formatCityList(res.data.body)

        // 获取热门城市
        const hotRes = await axios.get("http://localhost:8080/area/hot")
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')


        // 获取当前城市
        const curCity = await getCurrentCity()
        // console.log(curCity);
        cityList['#'] = [curCity]
        cityIndex.unshift('#')

        console.log(cityList, cityIndex);

    }

    render() {
        return (
            <div className="citylist">

                {/* 顶部导航栏 */}
                <NavBar
                    mode="light"
                    icon={<i className="iconfont icon-back" />}
                    onLeftClick={() => this.props.history.goBack()}
                >城市选择</NavBar>


                {/* 城市列表 */}
                <AutoSizer>
                    {
                        ({ height, width }) => {  //render-props模式,参数大概是解构赋值
                            return (
                                <List
                                    width={width}
                                    height={height}
                                    rowCount={list.length}
                                    rowHeight={20}
                                    rowRenderer={rowRenderer}
                                />
                            )
                        }
                    }
                </AutoSizer>


            </div>
        )
    }
}
