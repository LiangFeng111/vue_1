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
    </div>

    <!--    表格数据-->
    <div>
      <el-table
          :data="tableData"
          border
          row-style="text-align: center"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
        <el-table-column align="center" type="selection" width="35"/>
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
      <el-button size="medium" style="color: white;background-color: orangered" @click="settleAccount"><Component is="Coin" class="icons"></Component>结算</el-button>
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
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},//用户信息
      form: {},
      value: "",//搜索框的值
      centerDialogVisible: false,//中间弹框
      menuDialogVis: false,//菜单弹框
      input: "",//输入框的值
      loading: true,//加载
      currentPage: 1,//当前页
      pageSize: 10,//每页显示的条数
      total: 0,//总条数
      tableData: [],//表格数据
      title: "", //表单标题
      totalPrice:0,//总价
      multipleSelection:{},//多选
    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    settleAccount(){
      if (!this.multipleSelection.length || !this.multipleSelection) {
        this.$message.error("请选择要结算的商品")
        return
      }
      let data = {name :this.multipleSelection[0].goodsName ,totalPrice : this.totalPrice ,carts:this.multipleSelection,userId:this.user.id}
      // debugger
      request.post("/orders/add",data).then(res =>{
        if (res.code === '200') {
          this.load()
          this.$message.success("结算成功")
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeNum(row){
      request.put("/cart",JSON.parse(JSON.stringify(row))).then(res => {
        if (res.code === '200') {
          //计算总价格
          this.totalPrice=0
          if (this.multipleSelection && this.multipleSelection.length){
            this.multipleSelection.forEach(item =>{
              // item.num = row.num//更新选中数组的数量
              this.totalPrice += item.num * item.price
            })
          }
          this.totalPrice = this.totalPrice.toFixed(2)
          // this.load()//刷新表格数据
        }else {
          this.$message.warning(res.msg)
        }
      })

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