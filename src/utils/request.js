import axios from 'axios'
import store from '@/store'
import storage from 'store'
// import Cookies from 'js-cookie'
import notification from 'ant-design-vue/es/notification'
import { Message } from 'ant-design-vue'
// import {
//   ACCESS_TOKEN
// } from '@/store/mutation-types'
import qs from 'qs'
import Vue from 'vue'
import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  // headers: {
  // Authorization: window.localStorage.getItem('access_token'),
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL ? process.env.VUE_APP_API_BASE_URL : '/api',
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get('access_token')
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        localStorage.removeItem('access_token')
        store.commit('setLogout', true)
        router.push({ name: 'login' })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  // console.log('config', config.headers.isLoading)
  if (config.headers.isLoading) {
    Vue.prototype.$loading.show()
  }
  // const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  // if (token) {
  //   config.headers['Access-Token'] = token
  // }
  // 转换参数格式
  if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = qs.stringify(config.data)
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  Vue.prototype.$loading.hide()
  // const token = storage.get('access_token')
  const {
    data,
    config
  } = response
  const {
    code,
    message
  } = data
  if (+code === 401) {
    // if (router.currentRoute.name !== 'login') {
    //   localStorage.removeItem('access_token')
    //   store.commit('setLogout', true)
    //   router.push({ name: 'login' })
    // }
    top.location.href = '/slognin'
  } else if (code != '200') {
    if (!config.headers.noToast) {
      Message.error(message)
    }
    return Promise.reject(data || 'Error')
  }
  return response.data
}, errorHandler)

export default request
