import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import http from './http'
import './plugins/element.js'

import VueI18n from 'vue-i18n'
import zh from './i18n/zh'
import en from './i18n/en'

Vue.use(VueI18n)

Vue.prototype.$http = http

Vue.config.productionTip = false

const lang = localStorage.getItem('lang')

const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
