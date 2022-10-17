import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import router from "./router/index"
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import locale from "element-ui/lib/locale/lang/en";
import Alert from "@/components/Alert";

Vue.use(ElementUI,{locale}) //使用elementUI
Vue.use(Alert)
Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')
