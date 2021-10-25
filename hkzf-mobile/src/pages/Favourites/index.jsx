import React, { Component } from 'react'

import { Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'
import { API, BASE_URL } from '../../utils'

import './index.scss'

export default class Favourites extends Component {
    state = {
        list: [],
        isLoading: false
    }

    getHouses = async () => {

        this.setState({ isLoading: true })

        Toast.loading('加载中...', 0, null, false)

        // api.js里给所有user类的请求都加上了header，这里不能再重复加了
        const res = await API.get('/user/favorites')
        // console.log(res);

        const { body, status } = res.data
        if (status === 200) {
            this.setState({
                list: body,
                isLoading: false
            })

            Toast.hide()
        }
        else {
            const { history, location } = this.props
            history.replace('/login', {
                from: location
            })
        }
    }

    componentDidMount() {
        this.getHouses()
    }

    componentWillUnmount() {
        // 切换页面组件后去掉加载中的toast
        Toast.hide()
    }


    render() {
        const { list } = this.state
        const count = list.length
        return (
            <div className="favouritesRoot">
                <NavHeader>收藏列表</NavHeader>

                {
                    this.state.isLoading ? '' : (
                        <div className="houseItems">
                            {
                                count === 0 ? (
                                    <NoHouse>您还没有收藏房源</NoHouse>
                                ) : list.map(house => (
                                    <HouseItem
                                        key={house.houseCode}
                                        src={BASE_URL + house.houseImg}
                                        title={house.title}
                                        desc={house.desc}
                                        tags={house.tags}
                                        price={house.price}
                                        onClick={() => { this.props.history.push(`/detail/${house.houseCode}`) }} />
                                ))
                            }
                        </div>

                    )
                }

            </div>
        )
    }
}
