import { createStore } from 'vuex'
import router, {resetRouter} from "@/router";

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
      sessionStorage.removeItem("user")
      localStorage.removeItem("menus")
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
