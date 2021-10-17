import axios from 'axios'
import { BASE_URL } from './url'

//封装了axios，自带了链接的前缀
export const API = axios.create({
    baseURL: BASE_URL
})

