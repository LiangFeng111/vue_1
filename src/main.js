import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/global.css'
// 导入所有的el-icon图标
import * as ElIconModules from '@element-plus/icons-vue'
//中文
import locale from 'element-plus/es/locale/lang/zh-cn'
//动态拦截器配置
import  '@/utils/request'

//视频播放组件
import vue3videoPlay from "vue3-video-play"; // 引入组件
import "vue3-video-play/dist/style.css"; // 引入css



const app=createApp(App)
    app.use(store)


//  统一注册el-icon图标
for(let iconName in ElIconModules){
    app.component(iconName,ElIconModules[iconName])
}
    app.use(router)
    app.use(ElementPlus,{locale, size:'small'})
    app.use(vue3videoPlay);
    app.mount('#app')

