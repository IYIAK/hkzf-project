import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Home from './pages/Home'
// import CityList from './pages/CityList'
// import Map from './pages/Map'
// import HouseDetail from './pages/HouseDetail'
// import Login from './pages/Login'
// import Favourites from './pages/Favourites'
// import Rent from './pages/Rent'
// import RentAdd from './pages/Rent/Add'
// import RentSearch from './pages/Rent/Search'

import AuthRoute from './components/AuthRoute'

// 使用动态组件的方式导入组件
const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Favourites = lazy(() => import('./pages/Favourites'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/CityList'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading">loading...</div>}>
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

            <Route path="/detail/:id" component={HouseDetail}></Route>
            <Route path="/login" component={Login}></Route>
            <AuthRoute path="/favourites" component={Favourites}></AuthRoute>

            {/* 由于路由默认是模糊匹配，所以add必须放在前面，否则/rent/add匹配到rent页就不会往后匹配了 */}
            {/* 当然，给rent路由添加exact也是可以的 */}
            <AuthRoute path="/rent/add" component={RentAdd}></AuthRoute>
            <AuthRoute path="/rent/search" component={RentSearch}></AuthRoute>
            <AuthRoute path="/rent" component={Rent}></AuthRoute>

          </Switch>

        </div>
      </Suspense>
    </BrowserRouter>

  );
}

export default App;
