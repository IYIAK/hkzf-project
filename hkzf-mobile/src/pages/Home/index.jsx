import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile';

import './index.css'

import News from '../News'

import Index from '../Index'
import HouseList from '../HouseList'
import Profile from '../Profile'



const tabItems = [
    {
        title: "首页",
        icon: "icon-ind",
        path: "/home"
    },
    {
        title: "找房",
        icon: "icon-findHouse",
        path: "/home/list"
    },
    {
        title: "咨询",
        icon: "icon-infom",
        path: "/home/news"
    },
    {
        title: "我的",
        icon: "icon-my",
        path: "/home/profile"
    }
]


export default class Home extends Component {

    state = {
        // 用于决定选中的菜单，TabItem你们有两处用到了这个state：判断路径是否等于该值以决定是否高亮；点击图标后修改该值为路径以使图标高亮
        selectedTab: this.props.location.pathname

    };

    componentDidUpdate(prevProps) {  /* 进行了路由切换（重新挂载子组件）但没有重新挂载Home组件时会调用 */
        /* 路由切换也要判断下方tab按钮是否需要高亮 */
        if (prevProps.location.pathname !== this.props.location.pathname)  /* 判断路由地址是否切换 */
            this.setState({ selectedTab: this.props.location.pathname })
    }


    // 渲染tab项，逻辑代码最好拎出来，不要放在render里
    renderTabItem() {
        return tabItems.map((item) => {
            return (
                <TabBar.Item
                    title={item.title}
                    key={item.title}
                    icon={<i className={`iconfont ${item.icon}`}></i>
                    }
                    selectedIcon={<i className={`iconfont ${item.icon}`}></i>
                    }
                    selected={this.state.selectedTab === item.path} /* 决定是否高亮 */
                    onPress={() => {
                        this.setState({
                            selectedTab: item.path,
                        });
                        this.props.history.push(item.path)
                    }}
                >
                </TabBar.Item>
            )
        })
    }


    render() {

        return (
            <div className="home">

                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/list" component={HouseList}></Route>
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/profile" component={Profile}></Route>



                <TabBar
                    unselectedTintColor="#949494"
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent={true}
                >

                    {
                        this.renderTabItem()
                    }

                </TabBar>

            </div>
        )
    }
}
