// import { Button } from 'antd-mobile'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import CityList from './pages/CityList'
import Home from './pages/Home'
import Map from './pages/Map'


function App() {
  return (
    <BrowserRouter>
      <div className="App">


        {/* 配置导航菜单 */}
        {/* <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/citylist">城市选择</Link>
          </li>
        </ul> */}

        {/* 配置路由 */}
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/citylist" component={CityList}></Route>
          {/* <Redirect to="/home"></Redirect> 这种写法除了上述两个path外都会跳转到/home */}
          <Route path='/map' component={Map}></Route>
          <Route exact path='/' render={() => <Redirect to="/home" />}></Route>  {/* 这种写法只有path='/'才会跳转到/home */}
        </Switch>

      </div>
    </BrowserRouter>

  );
}

export default App;
