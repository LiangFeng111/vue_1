<template>
  <div>
    <el-menu style="width: 150px; height:  calc(100vh - 50px) ;overflow-x: hidden"
             router
             :default-active="path"
             active-text-color="#ffd04b"
             background-color="#545c64"
             text-color="#fff"
             @select="handleSelect"
             class="el-menu-vertical-demo">

      <div v-for="item in menus" :key="item.id">
        <div v-if="item.path">
          <el-menu-item :index="item.path">
            <component :is="item.icon" style="width: 20px;height: 20px"/>
            <span>{{item.name}}</span>
          </el-menu-item>
        </div>
        <div v-else>
          <el-sub-menu :index="item.id + ''" >
            <template #title>
              <component :is="item.icon" style="width: 20px;height: 20px"/>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group  title="选项">
              <div v-for="subItem in item.children" :key="item.id">
                <el-menu-item :index="subItem.path">
                  <component :is="subItem.icon" style="width: 20px;height: 20px"/>
                  <span>{{subItem.name}}</span>
                </el-menu-item>
              </div>

            </el-menu-item-group>
          </el-sub-menu>
        </div>
      </div>
    </el-menu>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Aside",
  props:{
  },
  data(){
    return{
      user:{},
      path:this.$route.path,
      menus: sessionStorage.getItem("menus") ? JSON.parse(sessionStorage.getItem("menus")) :[]
    }
  },
  created() {
    let userStr = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(userStr)

    request.get("/user/"+this.user.id).then(res=>{
      if (res.code ==='0'){
        this.user = res.data
      }
    })
  },
  methods:{
    handleSelect(){
      console.log(this.$route.name)

    },
  }
}

</script>

<style scoped>

</style>