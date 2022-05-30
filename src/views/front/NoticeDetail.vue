<template>
  <div style="padding: 10px;width: 100%">

    <!--    公告内容-->
    <div>
      <div>
        <div style="font-size: 20px; color: #00cdff;">
          <span> {{ notice.name }}</span>
        </div>
        <div style="margin: 15px 0;color: #909090">
          <el-icon>
            <User/>
          </el-icon>
          <span>{{ notice.user }}</span>
          <el-icon style="margin-left: 10px">
            <Timer/>
          </el-icon>
          <span>{{ notice.time }}</span>
        </div>
      </div>
      <div>
        <el-card style="margin-bottom: 10px">
          <div v-html="notice.content" style="min-height: 100px ;"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import '@wangeditor/editor/dist/css/style.css'
import {ElMessage} from "element-plus"; // 引入 css

export default {
  name: "NoticeDetail",

  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      notice: [],
      id: this.$route.query.id,
    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
    // this.loadComment();
  },
  methods: {
    load() {
      request.get("/notice/" + this.id).then(res => {
        this.notice = res.data
      })
    },
  },
}
</script>

<style scoped>

</style>