import React, { Component, createRef } from 'react'
import './index.scss'

export default class Sticky extends Component {

    // 创建ref对象
    placeholder = createRef()
    content = createRef()

    handleScroll = () => {
        const placeholderEl = this.placeholder.current
        const contentEl = this.content.current

        // 获取元素据顶部高度
        const { top } = placeholderEl.getBoundingClientRect()
        // console.log(top)
        if (top <= 0) {
            // console.log(contentEl.offsetHeight);
            contentEl.classList.add('fixed')
            placeholderEl.style.height = contentEl.offsetHeight + 'px'  //px不要忘记加
        } else {
            contentEl.classList.remove('fixed')
            placeholderEl.style.height = '0'

        }

    }

    // 监听scroll事件
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }


    render() {
        return (
            <div>
                {/* 占位元素 */}
                <div ref={this.placeholder} />
                {/* 内容元素 */}
                <div ref={this.content}>{this.props.children}</div>
            </div>
        )
    }
}
