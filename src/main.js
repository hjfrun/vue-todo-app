import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import http from './http'
import './plugins/element.js'

import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
