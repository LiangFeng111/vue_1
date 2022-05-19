import { createStore } from 'vuex'
import router, {resetRouter} from "@/router";

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
    logout(){
      //清空缓存
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("menus")
      router.push("/login")

      //重置路由
      resetRouter()
    }
  },
  actions: {
  },
  modules: {
  }
})
