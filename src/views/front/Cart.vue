<template>
  <div style="padding: 10px;width: 100%" >


    <!--    查询-->
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-input v-model="input"
                size="medium"
                placeholder="查询名称"
                style="width: 400px"
                clearable>
        <template #suffix>
          <el-icon>
            <search/>
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" size="medium" style="margin-left: 10px" @click="load">搜索</el-button>

      <!--      新增修改对话框-->
      <el-dialog  v-model="centerDialogVisible" :title="title" width="30%" center>
        <el-form :model="form"  label-width="100px">
          <el-form-item label="商品名称:">
            <el-input v-model="form.name" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="商品价格:">
            <el-input v-model="form.price" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="商品描述:">
            <el-input v-model="form.description" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="商品单位:">
            <el-input v-model="form.unit" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="商品存库:">
            <el-input v-model="form.store" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="图片:">
            <el-upload
                ref="upload"
                :on-success="filesUploadSuccess"
                action="http://localhost:9091/file">
              <el-button type="primary">点击上传</el-button>
            </el-upload>
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
          :data="tableData"
          border
          row-style="text-align: center"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
        <el-table-column align="center" type="selection" width="40"/>
        <el-table-column align="center" fixed prop="id" label="ID" width="60" sortable/>
        <el-table-column align="center" width="80px" label="商品图片">
          <template #default="scope">
            <el-image
                :src="scope.row.goodsImg"
                :preview-src-list="[scope.row.goodsImg]"
                :initial-index="4"
                fit="cover"
                preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column align="center"  prop="goodsName" label="商品名称"/>
        <el-table-column align="center" prop="num" label="数量">
          <template #default="scope">
            <el-input-number v-model="scope.row.num" :min="1" :max="100" label="数量" @change="changeNum(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="time" label="添加时间"/>
        <el-table-column align="center"  label="价格">
          <template #default="scope">
            <span style="color:red;">￥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" fixed="right" label="操作">
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
      <div >
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="pageSize"
            layout="total, prev, pager, next "
            :total="total">
        </el-pagination>
      </div>
    </div>
    <div style="text-align: right">
      <div>
        当前已选商品总价：<span style="color: orangered">￥{{totalPrice}}</span>
      </div>
      <el-button size="medium" style="color: white;background-color: orangered"><Component is="Coin" class="icons"></Component>结算</el-button>
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
      totalPrice:0,
      multipleSelection:{},
    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    changeNum(row){
      request.put("/cart",JSON.parse(JSON.stringify(row))).then(res => {
        if (res.code === '200') {
          // this.load()//刷新表格数据
        }else {
          this.$message.warning(res.msg)
        }
      })
      //计算总价格
      this.totalPrice=0
      if (this.multipleSelection && this.multipleSelection.length){
        this.multipleSelection.forEach(item =>{
          this.totalPrice += item.num * item.price
        })
      }
      this.totalPrice = this.totalPrice.toFixed(2)
    },
    //全选
    handleSelectionChange(val) {
      //多选存储
      this.multipleSelection = val
      this.totalPrice=0
      //进行计算操作
      if (val && val.length){
        val.forEach(item=>{
          this.totalPrice += item.num * item.price
        })
      }
      this.totalPrice = this.totalPrice.toFixed(2)
    },
    load() {
      request.get("/cart/page", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          name: this.input,
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
            this.load()//刷新表格数据
          } else {
            this.message(res.msg, 'error')
          }
        })
      } else {//新增
        this.form.user=JSON.parse(localStorage.getItem("user")).nickName
        request.post("/cart/add", this.form).then(res => {
          if (res.code === '200') {
            this.message("添加成功！", 'success')
            this.load()//刷新表格数据
          } else {
            this.message(res.msg, 'error')
          }
        })
      }

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