import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Header, Container, Main, Aside, Row, Col, Avatar,
  Menu, Submenu, MenuItem, MenuItemGroup
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Container)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Row)
Vue.use(Col)
Vue.use(Avatar)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.prototype.$message = Message // Message需要挂载到原型上使用
