import { createApp } from 'vue'
import App from './App.vue'
import router from './route'
import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)

Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})
app.mount('#app')
