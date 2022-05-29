<template>
  <div style="padding: 10px;width: calc(100vh - 50px)">
    <!--搜索-->
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-input v-model="inputName"
                placeholder="文件名称"
                style="width: 150px"
                clearable>
        <template #suffix>
          <el-icon>
            <search/>
          </el-icon>
        </template>
      </el-input>
      <el-input v-model="inputType"
                placeholder="文件类型"
                style="width: 150px; margin-left: 5px"
                clearable>
        <template #suffix>
          <el-icon>
            <search/>
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" style="margin-left: 10px" @click="load">搜索</el-button>
      <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="red"
          @confirm="deleteBatch"
          title="你确定要删除吗?"
          style="display: inline">
        <template #reference>
          <el-button type="danger" >批量删除<el-icon><remove /></el-icon></el-button>
        </template>
      </el-popconfirm>
      <el-upload ref="upload"
                 type="primary"
                 method="post"
                 :on-success="filesUploadSuccess"
                 :show-file-list="false"
                 style="display: inline;margin-left: 10px"
                 action="http://localhost:9091/file">
        <el-button type="primary">点击上传
          <el-icon>
            <circle-plus/>
          </el-icon>
        </el-button>
      </el-upload>

    </div>

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
      <el-table-column align="center" type="selection" width="35"/>
      <el-table-column align="center" fixed prop="id" label="ID" width="40" sortable/>
      <el-table-column align="center" fixed prop="name" label="文件名称"/>
      <el-table-column align="center" prop="type" width="80" label="文件类型"/>

      <el-table-column align="center" prop="size" width="90" label="文件大小(kb)"/>

      <el-table-column align="center" width="80" label="下载">
        <template #default="scope">
          <el-button type="primary" @click="download(scope.row.url)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" prop="enable" label="启用">
        <template #default="scope">
          <el-switch v-model="scope.row.enable"  @change="changeEnable(scope.row)"  active-color="#13ce66" inactive-color="#ccc"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" fixed="right" label="操作">
        <template #default="scope">
          <div style="display: flex; ">
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="red"
                @confirm="handleDelete(scope.row.id)"
                title="你确定要删除吗?">
              <template #reference>
                <el-button type="danger">删除
                  <el-icon>
                    <delete/>
                  </el-icon>
                </el-button>
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
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "File",
  components: {},
  data() {
    return {
      tableData: [],
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      inputName:'',
      inputType:'',
      ids:{},

    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    //批量删除
    deleteBatch() {
      if (!this.ids.length) {
        this.message("请选择数据", 'error')
        return
      }
      request.post('/file/del/batch', this.ids).then(res => {
        if (res.code === '200') {
          this.message("删除成功", 'success')
          this.load()//刷新表格数据
        } else {
          this.message(res.msg, 'error')
        }

      })
    },

    //全选
    handleSelectionChange(val) {
      this.ids = val.map(v => v.id)  // map 的作用[{id,name},{id,name}] => [id,name]
      console.log(this.ids)
    },
    //文件上传
    filesUploadSuccess(res) {
      this.message("上传成功",'success')
      this.load()
    },
    //文件下载
    download(url){
      window.open(url)
    },
    //是否启用
    changeEnable(row){
      request.put("/file",row).then(res=>{
        if (res.code ==='200'){
          if (row.enable){
            this.message('开启成功','success')
          }else {
            this.message('已禁用','info')
          }

        }
      })
    },

    load() {
      request.get("/file/page", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          inputName: this.inputName,
          inputType :this.inputType,
        }
      }).then(res => {
        console.log(res)
        if (res.code === '200') {
          this.tableData = res.data.data
          this.total = res.data.total
        } else {
          this.message(res.msg, 'error')
        }

        this.loading = false
      })
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
    handleSizeChange(val) { //改变当前每页的个数触发
      this.pageSize = val
      this.load()
    },
    handleCurrentChange(val) {//改变当前页码触发
      this.currentPage = val
      this.load();
    },
    handleDelete(id) {
      request.delete("file/" + id).then(res => {
        if (res.code === '200') {
          this.message("删除成功！", 'success')
        } else {
          this.message(res.msg, 'error')
        }
        this.load()//删除后从新加载表格数据
      })
    },
  },
}
</script>

<style scoped>

</style>