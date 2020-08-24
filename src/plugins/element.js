import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Header, Container, Main, Aside, Row, Col, Avatar,
  Menu, Submenu, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem, Card, Table, TableColumn,
  Tag, Switch, Pagination, Tooltip, Dialog, MessageBox, Select, Option, Tree, Cascader, Alert,
  Tabs, TabPane, Steps, Step, Checkbox, CheckboxGroup, Upload
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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.prototype.$message = Message // Message需要挂载到原型上使用
Vue.prototype.$confirm = MessageBox.confirm
