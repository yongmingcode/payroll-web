import Vue from 'vue'
import {Button, Form, FormItem, Input, Message, Container, Header, Aside, Main} from 'element-ui'
import qs from 'qs'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.prototype.$message = Message
Vue.use(qs)
