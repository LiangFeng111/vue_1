import { createStore } from 'vuex'
import router, {resetRouter} from "@/router";
import {ElMessage} from "element-plus";

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
    setPath (state) {
      state.currentPathName = localStorage.getItem("currentPathName")
    },
    logout(){
      //清空缓存
      localStorage.removeItem("user")
      localStorage.removeItem("menus")
      router.push("/login")

      //重置路由
      resetRouter()
    },
    //提示信息
    message(msg, type) {
      ElMessage({
        showClose: true,
        message: msg,
        type: type,
        center: true,
      })
    },
  },
  actions: {
  },
  modules: {
  }
})
