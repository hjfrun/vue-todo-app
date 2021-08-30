import Vue from 'vue'
import { Alert, Loading, Message, MessageBox } from 'element-ui'

Vue.use(Message)
Vue.use(Alert)

Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$loading = Loading.service
