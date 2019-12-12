import Vue from 'vue'
import {Button, Form, FormItem, Input, Message} from 'element-ui'
import qs from 'qs'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(qs)
