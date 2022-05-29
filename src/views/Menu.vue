<template>
  <div style="padding: 10px;width: calc(100vh - 50px)" >

    <!--    查询-->
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-input v-model="input"
                placeholder="查询名称"
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
          :icon="InfoFilled"
          icon-color="red"
          @confirm="deleteBatch"
          title="你确定要删除吗?">
        <template #reference>
          <el-button type="danger" >批量删除<el-icon><remove /></el-icon></el-button>
        </template>
      </el-popconfirm>
      <!--      对话框-->
      <el-dialog v-model="centerDialogVisible" :title="title" width="350px" center>
        <el-form :model="form" label-width="100px">
          <el-form-item label="名称:">
            <el-input v-model="form.name" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="路径:">
            <el-input v-model="form.path" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="页面路径:">
            <el-input v-model="form.pagePath" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="图标:">
            <el-select v-model="form.icon" style="width: 80%" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value">
                  <component :is="item.value" style="width: 20px; height:20px;"/>
                <span>
                  {{item.name}}
                </span>

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input v-model="form.description" style="width: 80%"/>
          </el-form-item>
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
          row-key="id"
          default-expand-all
          style="width: 100%;">
        <el-table-column align="center" type="selection" width="35" />
        <el-table-column fixed prop="id" label="ID" width="40" sortable/>
        <el-table-column align="center" fixed prop="name"  label="名称"/>
        <el-table-column align="center" fixed prop="path"  label="路径"/>
        <el-table-column align="center" fixed prop="pagePath"  label="页面路径"/>
        <el-table-column align="center" fixed prop="icon"  label="图标">
          <template #default="scope">
            <component :is="scope.row.icon" style="width: 20px;height: 20px"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="description" label="描述"/>
        <el-table-column align="center" width="260" fixed="right" label="操作">
          <template #default="scope">
            <div  style="text-align: center">
              <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">新增子菜单<el-icon><edit /></el-icon></el-button>
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
    </div>
  </div>
</template>

<script>
import {InfoFilled} from "@element-plus/icons-vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Role",
  components: {
    InfoFilled,
  },
  data() {
    return {
      form: {},
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
      options:[],
    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    //批量删除
    deleteBatch(){
      if (!this.ids.length){
        this.message("请选择数据",'error')
        return
      }
      request.post('/menu/deleteBatch',this.ids).then(res=>{
        if (res.code === '200') {
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
    load() {
      request.get("/menu", {
        params:{
          search: this.input,
        }
      }).then(res => {
        if (res.code === '200'){
          this.tableData=res.data
        }else {
          this.message(res.msg,'error')
        }

        this.loading=false
      })
    },
    add() {
      this.title='新增菜单'
      // 显示对话框
      this.centerDialogVisible = true
      //清空表单内容
      this.form = {}
      //请求图标的数据
      request.get("/menu/icons").then(res=>{
        this.options= res.data
      })

    },
    handleAdd(pid){
      this.title='新增子菜单'
      this.centerDialogVisible=true
      this.form={}
      if (pid){
        this.form.pid=pid
      }
      //请求图标的数据
      request.get("/menu/icons").then(res=>{
        this.options= res.data
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
        request.put("/menu", this.form).then(res => {
          if (res.code === '200') {
            this.message("修改成功",'success')
          }else {
            this.message(res.msg,'error')
          }
          this.load()//刷新表格数据
          this.centerDialogVisible = false//关闭弹窗
        })
      }else {//新增
        request.post("/menu/add", this.form).then(res => {
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
    handleEdit(row){
      //JSON.parse(JSON.stringify(row))表示成为独立对象
      this.title="修改菜单信息"
      this.form = JSON.parse(JSON.stringify(row))
      this.centerDialogVisible=true
      //请求图标的数据
      request.get("/menu/icons").then(res=>{
        this.options= res.data
      })

    },
    handleDelete(id){
      request.delete("menu/"+id).then(res=>{
        if (res.code === '200') {
          this.message("删除成功！",'success')
        }else {
          this.message(res.msg,'error')
        }
        this.load()//删除后从新加载表格数据
      })
    },
  },
}
</script>

<style scoped>

</style>