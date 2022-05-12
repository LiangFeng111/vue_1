<template>
  <div>
    <el-form :model="form" label-width="100px">
      <el-form-item label="用户名:">
        <el-input v-model="form.username" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="昵称:">
        <el-input v-model="form.nickName" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="头像:">
        <el-upload
            ref="upload"
            :on-success="filesUploadSuccess"
            action="http://localhost:9091/files/upload">
          <el-button type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="年龄:">
        <el-input v-model="form.age" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="性别:">
        <el-radio v-model="form.sex" label="男">男</el-radio>
        <el-radio v-model="form.sex" label="女">女</el-radio>
        <el-radio v-model="form.sex" label="未知">未知</el-radio>
      </el-form-item>
      <el-form-item label="地址:">
        <el-input v-model="form.address" type="textarea" style="width: 80%"/>
      </el-form-item >
      <el-form-item label="管理员:" >
        <el-radio v-model="form.role" :label='1'>管理员</el-radio>
        <el-radio v-model="form.role" :label="2">普通用户</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button :plain="true" type="primary" @click="save">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Person",
  data(){
    return{
      form:{},
    }
  },
  methods:{
    save(){
      request.put("/user",this.form).then(res=>{
        if (res.code === '200') {
          this.message("修改成功",'success')
        }else {
          this.message(res.msg,'error')
        }
      })
    },
    //文件上传
    filesUploadSuccess(res){
      this.form.headImg = res.data
      console.log(res)
    },
  }
}
</script>

<style scoped>

</style>