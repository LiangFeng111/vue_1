<template>
  <div>
<!--    头部-->
    <Header :user="user"/>
    <!--    主体-->
    <div style="display: flex">
      <!--      侧边栏-->
      <Aside/>
      <!--      内容区域-->
      <router-view @refreshUser="getUser" style="flex: 1 ;"/>
    </div>
  </div>
</template>

<script>

import Header from "@/components/Header";
import Aside from "@/components/Aside";
import request from "@/utils/request";

export default {
  name: "Layout",
  components:{
    Header,
    Aside
  },
  data(){
    return{
      user:this.user=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "{}",
    }
  },
  methods:{
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