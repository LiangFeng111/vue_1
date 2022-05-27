<template>
  <div style="padding: 20px">
    <el-card style="width: 500px;height: 500px">
      <el-form style="padding :20px;" :model="form" label-width="100px">
        <el-form-item label="原密码:">
          <el-input v-model="form.password" disabled style="width: 80%"/>
        </el-form-item>
        <el-form-item label="新密码:">
          <el-input v-model="form.nickName" style="width: 80%"/>
        </el-form-item>

        <el-form-item label="确认新密码:">
          <el-input v-model="form.age" style="width: 80%"/>
        </el-form-item>
        <el-form-item>
          <el-button :plain="true" type="primary" @click="save">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Person",
  data() {
    return {
      form: {},
      user:'',
    }
  },
  created() {//页面加载调用
    this.load()
  },
  methods: {
    load() {
      this.user=JSON.parse(localStorage.getItem("user") || "{}")
      request.get("/user/"+this.user.id).then(res=>{
        this.form =res.data
      })

    },
    save() {
      request.put("/user", this.form).then(res => {
        if (res.code === '200') {
          this.message("修改成功", 'success')
          this.load()
          //触发父级更新user
          this.$emit("refreshUser")
        } else {
          this.message(res.msg, 'error')
        }
      })
    },
    //文件上传
    filesUploadSuccess(res) {
      this.form.headImg = res
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
  }
}
</script>

<style scoped>
  .headImg-upload{
    text-align: center;
  }
  .handImg{
    width: 138px;
    height: 138px;
    margin-bottom: 10px;
  }

</style>