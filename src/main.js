import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/tailwindcss.css'
import router from './router'

// 图标库的使用说明：https://segmentfault.com/a/1190000045193274?decode__1660=YqGx2DnDuDgCG%3DKDseExCw%2BGUA23qD5dx


const app = createApp(App)
app.use(router)
app.mount('#app')
