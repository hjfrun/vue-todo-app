import Vue from 'vue'
import { Alert, Loading, Message } from 'element-ui'

Vue.use(Alert)
Vue.use(Loading.directive)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
