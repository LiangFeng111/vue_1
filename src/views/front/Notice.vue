<template>
  <div style="padding: 10px;width: 100%">
    <!--    查询-->
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-input v-model="input"
                placeholder="查询名称"
                style="width: 300px;height: 32px"
                clearable>
        <template #suffix>
          <el-icon>
            <search/>
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" style="margin-left: 10px" @click="load" size="30px">搜索</el-button>
    </div>

    <!--   公告内容 -->
    <div style="margin: 10px 0">
      <div style="padding: 20px 0;border-bottom: 1px dashed #808080;" v-for="item in tableData" :key="item.id">
        <div style="font-size: 20px; color: #00cdff;">
          <span style="cursor: pointer" @click="this.$router.push('/front/noticeDetail?id='+item.id)"> {{item.name}}</span>
        </div>
        <div style="padding-top: 10px;color: #909090">
          <el-icon><User /></el-icon>
            <span>{{item.user}}</span>
          <el-icon style="margin-left: 10px"><Timer /></el-icon>
          <span>{{item.time}}</span>
        </div>
      </div>
    </div>

    <!--      分页-->
    <div>

      <div style="margin: 10px 0">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="pageSize"
            layout="total, prev, pager, next ,jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import '@wangeditor/editor/dist/css/style.css' // 引入 css

export default {
  name: "Notice",
  data() {
    return {
      form: {},
      value: "",
      input: "",
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],

    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
  },
  methods: {
    load() {
      request.get("/notice/page", {
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
  },
}
</script>

<style scoped>

</style>