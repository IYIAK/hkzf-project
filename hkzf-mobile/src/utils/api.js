import axios from 'axios'
import { BASE_URL } from './url'
import { getToken, removeToken } from './auth'


//封装了axios，自带了链接的前缀
export const API = axios.create({
    baseURL: BASE_URL
})

API.interceptors.request.use(config => {
    // console.log(config, config.url);
    const { url } = config
    if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
        config.headers.Authorization = getToken()
    }
    return config
})


//请求数据失败就直接移除本地token
API.interceptors.response.use(response => {
    const { status } = response.data
    if (status === 400) {
        removeToken()
    }
    // console.log(status);
    return response
})