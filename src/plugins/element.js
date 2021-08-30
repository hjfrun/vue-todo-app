import Vue from 'vue'
import { Alert, Loading, Message } from 'element-ui'

Vue.use(Alert)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
