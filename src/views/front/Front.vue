<template>
  <div id="app">
    <!--  头部-->
    <div style="display: flex ;height: 60px;line-height: 60px; border-bottom: 1px solid #dcdfe6">
      <div style="width: 250px ;padding-left: 50px; display: flex" >
        <div>
          <img src="../../assets/logo1.png" style="width: 60px; height: 60px" />
        </div>
        <div style="flex: 1">
          <span>欢迎来到商城</span>
        </div>
      </div>
      <div style="flex: 1">
        <!--      菜单导航-->
        <el-menu
            style="height: 100%"
            :default-active="'1'"
            class="el-menu-demo"
            router
            mode="horizontal">
          <el-menu-item index="/front/home">首页</el-menu-item>
          <el-sub-menu index="2">
            <template #title>选项</template>
            <el-menu-item index="2-2">选项三</el-menu-item>
            <el-menu-item index="2-3">选项四</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>选项四</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" disabled>Info</el-menu-item>
          <el-menu-item index="/front/video">视频播放</el-menu-item>
        </el-menu>


      </div>
      <div style="width: 200px">
        <div v-if="!user.username" style="text-align: right;padding-right: 30px">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>
        <div v-else style="text-align: right;padding-right: 30px">
          <el-image
              style="width: 30px; height: 30px ;margin-top: 10px; margin-right: 1px; border-radius: 30px;"
              :src="user.headImg"
              fit="cover"
              preview-teleported="true"/>
          <el-dropdown style="line-height: 50px;margin-left: 5px">
            <span style="color:#ff0202;">{{ user.nickName }}</span>
            <span class="el-dropdown-link">
                <el-icon class="el-icon--right" style="color: #ff0000"><arrow-down/></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/front/person')">个人信息</el-dropdown-item>
                <el-dropdown-item @click="exit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>

  <div style=" width: 1000px; margin: 0 auto">
    <router-view @refreshUser="getUser"/>
  </div>
</template>


<script setup>

</script>
<script>
import request from "@/utils/request";

export default {
  name: "Front",
  data() {
    return {
      user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
    }
  },
  methods: {
    exit() {
      this.$store.commit("logout")
      this.message("退出成功", 'success')
    },
    // 从后台获取数据
    getUser(){
      request.get('user/'+this.user.id).then(res=>{
        this.user = res.data
      })
    }
  },
}
</script>

<style>


</style>