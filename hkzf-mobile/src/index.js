import React from 'react';
import ReactDOM from 'react-dom';

// 引入antd的css
import 'antd-mobile/dist/antd-mobile.css'

//引入react-virtualized组件的样式文件
import 'react-virtualized/styles.css'

// 引入字体图标
import './assets/fonts/iconfont.css'

// !!! 自己写的index的样式必须放在最后引入,防止被覆盖,导致奇奇怪怪的样式问题 !!! 
import './index.css'

// APP组件的导入也要放到最后，否则子组件的css样式还是会被覆盖
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
