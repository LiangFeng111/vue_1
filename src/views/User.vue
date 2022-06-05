<template>
  <div style="padding: 10px;width: calc(100vh - 50px)" >


    <!--    查询-->
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-select v-model="value" style="width: 100px" placeholder="请选择查询">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-input v-model="input"
                placeholder="默认查询昵称"
                style="width: 200px"
                clearable>
        <template #suffix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" style="margin-left: 10px" @click="load">搜索 </el-button>
      <el-button type="primary" @click="add" style="margin-left: 10px"> 新增 <el-icon><circle-plus /></el-icon></el-button>
      <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon-color="red"
          @confirm="deleteBatch"
          title="你确定要删除吗?">
        <template #reference>
          <el-button type="danger" >批量删除<el-icon><remove /></el-icon></el-button>
        </template>
      </el-popconfirm>
      <el-upload action="http://localhost:9091/user/import"
                 :show-file-list="false"
                 :on-success="handleExcelImportSuccess"
                 accept="xlsx"
                 style="display: inline-block">
        <el-button type="primary" style="margin-left: 10px" >导入 </el-button>
      </el-upload>

      <el-button type="primary" style="margin-left: 10px" @click="exp">导出 </el-button>
      <!--      对话框-->

      <el-dialog v-model="centerDialogVisible" :title="title" width="350px" center>
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户名:">
            <el-input v-model="form.username" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="昵称:">
            <el-input v-model="form.nickName" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="角色:" >
            <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 80%" :disabled=" user.role !== 'SuperAdmin'">
              <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="头像:">
            <el-upload
                ref="upload"
                :on-success="filesUploadSuccess"
                action="http://localhost:9091/file">
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

        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button :plain="true" type="primary" @click="save">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!--    表格数据-->
    <div>
      <el-table
          height="67vh"
          header-cell-class-name="headerBag"
          :data="tableData"
          stripe
          border
          v-loading="loading"
          element-loading-text="正在加载..."
          row-style="text-align: center"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
        <el-table-column align="center" type="selection" width="35" />
        <el-table-column align="center" fixed prop="id" label="ID" width="40" sortable/>
        <el-table-column align="center"  label="头像" width="70">
          <template #default="scope">
              <el-image
                  style="width: 30px; height: 30px;"
                  :src="scope.row.headImg"
                  :preview-src-list="[scope.row.headImg]"
                  :initial-index="4"
                  fit="cover"
                  preview-teleported="true"
              />
          </template>
        </el-table-column>
        <el-table-column align="center" fixed prop="username" width="80" label="用户名"/>
        <el-table-column align="center" width="80" label="角色:">
          <template #default="scope">
            <span v-if="scope.row.role ==='Admin'">管理员</span>
            <span v-if="scope.row.role ==='User'">普通用户</span>
            <span v-if="scope.row.role ==='SuperAdmin'">超级管理员</span>

          </template>
        </el-table-column>
        <el-table-column align="center" prop="nickName" width="80" label="昵称"/>

        <el-table-column align="center" prop="age" width="80" label="年龄"/>
        <el-table-column align="center" prop="sex" width="80" label="性别"/>
        <el-table-column align="center" prop="address"  label="地址"/>

        <el-table-column align="center" width="150" fixed="right" label="操作">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-button type="success" @click="handleEdit(scope.row)">编辑<el-icon><edit /></el-icon></el-button>
              <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :icon="InfoFilled"
                  icon-color="red"
                  @confirm="handleDelete(scope.row.id)"
                  title="你确定要删除吗?">
                <template #reference>
                  <el-button type="danger" >删除 <el-icon><delete /></el-icon></el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>

      </el-table>
      <!--      分页-->
      <div style="margin: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next ,jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from 'element-plus'
import {InfoFilled } from '@element-plus/icons-vue';
const right = require("@element-plus/icons-vue/dist/es/right.mjs");
export default {
  name: "Home",
  components: {
    InfoFilled,
  },
  data() {
    return {
      user:this.user=localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "{}",
      form: {},
      options:[
        {
          value: 'username',
          label: '用户名',
        },
        {
          value: 'nick_name',
          label: '昵称',
        },
        {
          value: 'age',
          label: '年龄',
        },
        {
          value: 'address',
          label: '地址',
        }
      ],
      value: "",
      centerDialogVisible: false,
      input: "",
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      title:"", //表单标题
      ids:{},
      InfoFilled:InfoFilled,
      roles:[],
    }
  },
  //created（）页面加载时调用的方法
  created() {
    console.log(this.user.role)
    this.load();
  },
  methods: {
    //批量删除
    deleteBatch(){
      if (!this.ids.length){
        this.message("请选择数据",'error')
        return
      }
      request.post('/user/deleteBatch',this.ids).then(res=>{
        if (res.code === '0') {
          this.message("删除成功",'success')
          this.load()//刷新表格数据
        }else {
          this.message(res.msg,'error')
        }

      })

    },
    //全选
    handleSelectionChange(val){
      this.ids = val.map(v => v.id)  // map 的作用[{id,name},{id,name}] => [id,name]
    },
    //文件上传
    filesUploadSuccess(res){
      this.form.headImg = res
    },
    load() {
      request.get("/user/page", {
        params:{
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.input,
          option :this.value
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableData=res.data.data
          this.total = res.data.total
        }else {
          this.message(res.msg,'error')
        }
        request.get("/role",).then(res=>{
          this.roles = res.data
        })
        this.loading=false
      })
    },
    add() {
      this.title='新增用户'
      // 显示对话框
      this.centerDialogVisible = true
      //清空表单内容
      this.form = {}//表单元素创建之后加载
      this.$nextTick(()=>{
        this.$refs['upload'].clearFiles() //清除头像文件列表
      })
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
    save() {
      //如果form有id就返回ture，没有则反之
      if (this.form.id){//更新
        request.put("/user", this.form).then(res => {
          if (res.code === '200') {
            this.message("修改成功",'success')
          }else {
            this.message(res.msg,'error')
          }
          this.load()//刷新表格数据
          this.centerDialogVisible = false//关闭弹窗
        })
      }else {//新增
        request.post("/user/register", this.form).then(res => {
          if (res.code === '200') {
            this.message("添加成功！",'success')
            this.load()//刷新表格数据
            this.centerDialogVisible = false//关闭弹窗
          }else {
            this.message(res.msg,'error')
          }
        })
      }

    },
    handleSizeChange(val) { //改变当前每页的个数触发
      this.pageSize=val
      this.load()
    },
    handleCurrentChange(val) {//改变当前页码触发
      this.currentPage = val
      this.load();
    },
    handleEdit(row){
      //JSON.parse(JSON.stringify(row))表示成为独立对象
      this.title="修改用户信息"
      this.form = JSON.parse(JSON.stringify(row))
      this.centerDialogVisible=true
      //表单元素创建之后加载
      this.$nextTick(()=>{
        this.$refs['upload'].clearFiles() //清除头像文件列表
      })

    },
    handleDelete(id){
      request.delete("user/"+id).then(res=>{
        if (res.code === '0') {
          this.message("删除成功！",'success')
        }else {
          this.message(res.msg,'error')
        }
        this.load()//删除后从新加载表格数据
      })
    },
    exp(){
      window.open("http://localhost:9091/user/export")
    },
    handleExcelImportSuccess(){
      this.message("导入成功！",'success')
      this.load()
    },
  },

}
</script>
