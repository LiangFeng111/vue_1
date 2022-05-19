<template>
  <div id="app">
    <div style="height: 50px;background-color:#545c64; line-height: 50px; display: flex">
      <div style="width: 100px ;padding-left: 30px; font-weight: bold; color: #00cdff">后台管理</div>
      <div style="flex: 1; height: 50px" >
        <div>
          <!--    页签-->
          <el-breadcrumb  separator="/" style="line-height: 50px;margin-left: 50px;">
            <el-breadcrumb-item  :to="{ path: '/' }">主页</el-breadcrumb-item>
            <el-breadcrumb-item  >
              <span style="color: white">{{currentPathName}}</span>
              </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <div style="text-align: center;margin-right: 20px">
        <el-image
            style="width: 30px; height: 30px ;margin-top: 10px; margin-right: 1px; border-radius: 30px;"
            :src="user.headImg"
            :preview-src-list="[user.headImg]"
            :initial-index="4"
            fit="cover"
            preview-teleported="true"
        />
        <el-dropdown style="line-height: 50px;margin-left: 5px">
          <span style="color:#fff;">{{user.nickName}}</span>
        <span class="el-dropdown-link">
          <el-icon style="color: white"><arrow-down /></el-icon>
        </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/person')">个人信息</el-dropdown-item>
              <el-dropdown-item @click="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    </div>
  </div>
</template>

<script>
  import {ElMessage} from "element-plus";

  export default {
    name:"Header",
    props:{
      user: Object
    },
    data(){
      return{
        currentPathName:'',
      }
    },
    watch:{
      '$route':function (){
          this.currentPathName=localStorage.getItem("currentPathName") //取出route里面设置的当前路由信息
      }
    },
    methods:{
      exit(){
        this.$store.commit("logout")
        this.message("退出成功",'success')
      },

      //提示信息
      message(msg,type){
        ElMessage({
          showClose: true,
          message: msg,
          type: type,
          center: true,
        })
      },
    }
  }
</script>

<style scoped>

</style>