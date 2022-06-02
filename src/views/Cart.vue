<template>
  <div style="padding: 10px;width: calc(100vh - 50px)">


    <!--    查询-->
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-input v-model="input"
                placeholder="查询名称"
                style="width: 200px"
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
          icon-color="red"
          @confirm="deleteBatch"
          title="你确定要删除吗?">
        <template #reference>
          <el-button type="danger">批量删除
            <el-icon>
              <remove/>
            </el-icon>
          </el-button>
        </template>
      </el-popconfirm>
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
        <el-table-column align="center" type="selection" width="35"/>
        <el-table-column align="center" fixed prop="id" label="ID" width="40" sortable/>
        <el-table-column align="center" prop="goodsName" label="商品名称"/>
        <el-table-column align="center" prop="nickname" label="用户昵称"/>
        <el-table-column align="center" prop="num" label="商品数量"/>
        <el-table-column align="center" prop="time" label="添加时间"/>
        <el-table-column align="center" width="140" fixed="right" label="操作">
          <template #default="scope">
              <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
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
import {ElMessage} from "element-plus";

export default {
  name: "Cart",
  data() {
    return {
      form: {},
      value: "",
      centerDialogVisible: false,
      menuDialogVis: false,
      input: "",
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      title: "", //表单标题
      ids: {},

    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    //详情展示
    details(row) {
      this.detail = row
      this.vis = true
    },
    //批量删除
    deleteBatch() {
      if (!this.ids.length) {
        this.message("请选择数据", 'error')
        return
      }
      request.post('/cart/deleteBatch', this.ids).then(res => {
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
    },
    load() {
      request.get("/cart/page", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.input,
        }
      }).then(res => {
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
    save() {
      this.form.content=this.valueHtml
      //如果form有id就返回ture，没有则反之
      if (this.form.id) {//更新
        request.put("/cart", this.form).then(res => {
          if (res.code === '200') {
            this.message("修改成功", 'success')
          } else {
            this.message(res.msg, 'error')
          }
          this.load()//刷新表格数据
          this.centerDialogVisible = false//关闭弹窗
        })
      } else {//新增
        this.form.user=JSON.parse(localStorage.getItem("user")).nickName
        request.post("/cart/add", this.form).then(res => {
          if (res.code === '200') {
            this.message("添加成功！", 'success')
            this.load()//刷新表格数据
            this.centerDialogVisible = false//关闭弹窗
          } else {
            this.message(res.msg, 'error')
          }
        })
      }

    },
    //文件上传
    filesUploadSuccess(res){
      this.form.img = res
    },

    //改变当前每页的个数触发
    handleSizeChange(val) {
      this.pageSize = val
      this.load()
    },
    //改变当前页码触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.load();
    },
    //编辑触发
    handleEdit(row) {
      //JSON.parse(JSON.stringify(row))表示成为独立对象
      this.valueHtml = row.content
      this.title = "修改商品信息"
      this.form = JSON.parse(JSON.stringify(row))
      this.centerDialogVisible = true
    },
    //删除触发
    handleDelete(id) {
      request.delete("cart/" + id).then(res => {
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