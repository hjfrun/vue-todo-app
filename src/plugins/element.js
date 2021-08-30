import Vue from 'vue'
import { Alert, Message, MessageBox } from 'element-ui'

Vue.use(Message)
Vue.use(Alert)

Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
