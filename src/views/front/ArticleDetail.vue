<template>
  <div style="padding: 10px;width: 100%">

    <!--    文章内容-->
    <div>
      <div>
        <div style="font-size: 20px; color: #00cdff;">
          <span> {{ article.name }}</span>
        </div>
        <div style="margin: 15px 0;color: #909090">
          <el-icon>
            <User/>
          </el-icon>
          <span>{{ article.user }}</span>
          <el-icon style="margin-left: 10px">
            <Timer/>
          </el-icon>
          <span>{{ article.time }}</span>
        </div>
      </div>
      <div>
        <el-card style="margin-bottom: 10px">
          <div v-html="article.content" style="min-height: 100px ;"></div>
        </el-card>
      </div>
    </div>

    <!--    评论-->
    <div style="margin: 30px 0;">
      <div style="margin: 10px 0">
        <div style="border-bottom: 1px solid orangered;padding: 10px 0; font-size: 20px">评论</div>
        <div style="padding: 10px 0">
          <el-input size="20px" type="textarea" v-model="commentForm.content"></el-input>
        </div>
        <div style="text-align: right">
          <el-button type="primary" size="20px" @click="save">评论</el-button>
        </div>
      </div>

      <!--  评论列表-->
      <div>
        <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc; padding: 5px 0;">
          <div style="display: flex">
            <!--          头像-->
            <div style="width: 100px;text-align: center">
              <el-image :src="item.headImg" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
            </div>
            <!--          内容-->
            <div style="flex: 1; font-size: 14px; padding: 5px 0; line-height: 25px">
              <b>{{ item.nickName }}：</b>
              <span>{{ item.content }}</span>
              <div style="display: flex">
                <div style="width: 200px">
                  <span style="font-size: 10px;color: #909090">时间：{{ item.time }}</span>
                </div>
                <div style="flex: 1;text-align: right">
                  <el-button type="primary" @click="handleReply(item)">回复</el-button>
                  <el-button type="danger" @click="handleDelete(item.id)" v-if="user.id===item.userId">删除</el-button>
                </div>
              </div>
            </div>
          </div>
          <!--   回复内容-->
          <div v-if="item.children.length" v-for="subItem in item.children" :key="subItem.id"
               style="margin-left: 100px;">
            <div style="background-color: #f4f4f4; padding: 5px;border-bottom: 1px solid #d8d7d7">
              <div style="display: flex;">
                <!--          头像-->
                <div style="width: 60px;text-align: center;padding-top: 15px">
                  <el-image :src="subItem.headImg" style="width: 40px;height: 40px;border-radius: 50%"></el-image>
                </div>
                <!--          内容-->
                <div style="flex: 1; font-size: 14px; padding: 5px 0; line-height: 25px">
<!--                  回复@昵称-->
                  <div style="display: flex">
                    <div style="width: 200px">
                      <span style="font-size: 14px;color: #24d0f7" v-if="subItem.puserName">@{{ subItem.puserName }}</span>
                    </div>
                  </div>
                  <b style="margin-left: 5px">{{ subItem.nickName }}：</b>
                  <span>{{ subItem.content }}</span>
                  <div style="display: flex;margin-left: 5px">
                    <div style="width: 200px">
                      <span style="font-size: 10px;color: #a0a0a0">时间：{{ subItem.time }}</span>
                    </div>
                    <div style="flex: 1;text-align: right">
                      <el-button type="primary" @click="handleReply(subItem)">回复</el-button>
                      <el-button type="danger" @click="handleDelete(subItem.id)" v-if="user.id===subItem.userId">删除
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--        回复对话框-->
        <el-dialog v-model="centerDialogVisible" title="回复" width="60%" center>
          <el-form label-width="100px">
            <el-form-item label="回复内容:">
              <el-input type="textarea" v-model="commentForm.contentReply" style="width: 80%"/>
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

    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import '@wangeditor/editor/dist/css/style.css'
import {ElMessage} from "element-plus"; // 引入 css

export default {
  name: "Article",

  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      article: [],
      comments: {},
      commentForm: {},
      id: this.$route.query.id,
      centerDialogVisible: false,
    }
  },
  //created（）页面加载时调用的方法
  created() {
    this.load();
    this.loadComment();
  },
  methods: {
    load() {
      request.get("/article/" + this.id).then(res => {
        this.article = res.data
      })


    },
    loadComment() {
      request.get("/comment/tree/" + this.id).then(res => {
        this.comments = res.data
      })
    },
    save() {
      if (!this.user.id) {
        this.$message.warning("请登录后操作")
        return
      }
      if (this.commentForm.contentReply) {
        this.commentForm.content = this.commentForm.contentReply
      }
      this.commentForm.articleId = this.id
      this.commentForm.userId = this.user.id
      request.post("/comment/add", this.commentForm).then(res => {
        if (res.code === '200') {
          this.$message.success("评论成功")
          this.commentForm = {}
          this.loadComment()
          this.centerDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleReply(subItem) {
      this.centerDialogVisible = true
      let originId =""
      if (subItem.originId){//当前回复的父级有祖宗时，那么就设置相同的祖宗
        originId=subItem.originId
      }else {//否则就设置父级为当前回复的祖宗
        originId=subItem.id
      }
      debugger
      console.log(subItem)
      this.commentForm = {pid: subItem.id ,originId: originId}

    },

    //删除触发
    handleDelete(id) {
      request.delete("comment/" + id).then(res => {
        if (res.code === '200') {
          this.$message.success("删除成功")
          this.loadComment()//删除后从新加载
        } else {
          this.$message.error(res.msg)
        }

      })
    },

  },
}
</script>

<style scoped>

</style>