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
      <el-menu-item index="/home">
        <el-icon><home-filled /></el-icon>
        <span>主页</span>
      </el-menu-item>
      <el-sub-menu  >
        <template #title>
          <el-icon><grid /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item-group  title="选项">
          <el-menu-item  index="user" >用户管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Aside",
  data(){
    return{
      user:{},
      path:this.$route.path
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