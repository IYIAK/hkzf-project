import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


// 引入antd的css
import 'antd-mobile/dist/antd-mobile.css'

//引入react-virtualized组件的样式文件
import 'react-virtualized/styles.css'

// 引入字体图标
import './assets/fonts/iconfont.css'

// !!! 自己写的index的样式必须放在最后引入,防止被覆盖,导致奇奇怪怪的样式问题 !!! 
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
