import React from 'react'
import { Redirect, Route } from 'react-router'
import { isAuth } from '../../utils'

/* 鉴权路由,若登录了,就跳转到目标页面,未登录则重定向至登录页面 */

export default function AuthRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => {
            const isLogin = isAuth()

            if (isLogin) {
                // 如果登录了，直接返回要跳转的页面
                return <Component {...props}></Component>
            } else {
                // 未登录就重定向到登录页面,并且设置返回的页面为原页面
                return <Redirect to={{
                    pathname: '/login',
                    state: {
                        from: props.location
                    }
                }}></Redirect>
            }
        }}></Route>
    )
}
