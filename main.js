// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import {
  $http
} from '@escook/request-miniprogram'
import store from './store/store.js'

uni.$http = $http

// 请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'
// $http.baseUrl = 'https://www.esinsis.tech'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '加载中'
  })
  if (options.url.indexOf('/my/') !== -1) {
    options.header = {
      Authorization: store.state.m_user.token,
    }
  }
}
// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

//封装弹框
uni.$showMsg = function(title = '请求失败', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'

import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
