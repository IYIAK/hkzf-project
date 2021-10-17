import React, { Component } from 'react'
import { Flex, Toast } from 'antd-mobile'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'

import Filter from "./components/Filter";
import SearchHeader from '../../components/SearchHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'
// 导入吸顶组件
import Sticky from '../../components/Sticky'

import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'
import './index.scss'


// var { label: cityName,value } = JSON.parse(localStorage.getItem('hkzf_city'))
export default class HouseList extends Component {

    state = {
        list: [],
        count: 0,
        nowTop: 20,
        isLoaded: false  //用于判断数据是否加载完成
    }

    cityName = ''
    value = ''


    filters = {}
    // 接受Filter组件的筛选条件数据 
    onFilter = (filters) => {

        // 返回页面顶部
        window.scrollTo(0, 0)

        // console.log(filters);
        this.filters = filters
        this.searchHouseList()
    }

    //获取房屋列表数据
    searchHouseList = async () => {
        this.setState({
            isLoaded: false
        })
        Toast.loading('加载中...', 0, null, false)
        const res = await API.get('/houses', {
            params: {
                cityId: this.value,
                ...this.filters,
                start: 1,
                end: 20
            }
        })
        // console.log(res);
        const { list, count } = res.data.body
        // console.log(list, count);

        Toast.hide()

        //解决了没有房源也弹窗提示的bug
        if (count !== 0)
            Toast.info(`共找到${count}套房源`, 2, null, false)

        this.setState({
            list,
            count,
            isLoaded: true
        })
    }

    componentDidMount() {
        var { label: cityName, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        this.cityName = cityName
        this.value = value
        this.searchHouseList()
    }


    //每一行的内容
    renderHouseList = ({
        key, // Unique key within array of rows
        index, // 每一行的index
        style, // 每一行的style,千万不能去掉
    }) => {

        // console.log('index', index);
        // 根据索引号获得当前行的房屋数据
        const house = this.state.list[index]

        // 判断house是否存在
        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className="loading"></p>
                </div>
            )
        }

        return (
            <HouseItem
                key={key}
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price} />
        );
    }

    //判断列表中每一行是否加载完成
    isRowLoaded = (index) => {
        return !!this.state.list[index]
    }

    //用来获取更多房屋列表数据
    //注意：方法的返回值时一个promise对象，并且，这个对象应该是在数据加载完成时调用resolve让promise的状态变为已完成
    top = 10  //用于解决stopIndex更新太频繁导致发送请求过多的问题
    loadMoreRows = ({ startIndex, stopIndex }) => {
        //视频里的startIndex和stopIndex是步长为10的更新，也就是20-29变成30-39
        //但实际上得到的是0-20变成0-21再变成0-22... 总之完全不一样
        // console.log(startIndex, stopIndex);
        if (stopIndex - this.top >= 10) {  //只有stopIndex增长了10才请求一次数据
            this.top = stopIndex  //记录上一次请求时的stopIndex，也就是当前加载好的列表的最顶端
            // console.log('top', this.top, 'stop', stopIndex);
            return new Promise(async resolve => {
                const res = await API.get('/houses', {
                    params: {
                        cityId: this.value,
                        ...this.filters,
                        start: this.top - 10,
                        end: this.top
                    }
                })

                this.setState({
                    list: [...this.state.list, ...res.data.body.list]
                })
                console.log('**', this.top);
                resolve()
            })
        }


    }


    renderList = () => {
        const { count, isLoaded } = this.state

        if (count === 0 && isLoaded) {
            return (
                <NoHouse>
                    没有找到符合条件的房源
                </NoHouse>
            )
        }

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                                        width={width} // 视口的宽度
                                        height={height} // 视口的高度
                                        rowCount={count} // List列表项的行数
                                        rowHeight={120} // 每一行的高度
                                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        )
    }

    render() {
        return (
            <div>

                {/* 搜索栏 */}
                <Flex className='header'>
                    <i className="iconfont icon-back" onClick={() => this.props.history.goBack()}></i>
                    <SearchHeader cityName={this.cityName} className='searchHeader'></SearchHeader>
                </Flex>

                {/* 条件筛选栏 */}
                <Sticky>
                    <Filter onFilter={this.onFilter} />
                </Sticky>


                {/* 房屋列表 */}
                <div className="houseItems">
                    {this.renderList()}
                </div>

            </div>
        )
    }
}
