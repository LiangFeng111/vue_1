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
      <el-button type="primary" @click="add" style="margin-left: 10px"> 新增
        <el-icon>
          <circle-plus/>
        </el-icon>
      </el-button>
      <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
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

      <!--      文章公告信息对话框-->
      <el-dialog  v-model="centerDialogVisible" :title="title" width="80%" center>
        <el-form :model="form"  label-width="100px">
          <el-form-item label="名称:">
            <el-input v-model="form.name" style="width: 80%"/>
          </el-form-item>
          <el-form-item label="公告内容:">
            <div style="border: 1px solid #ccc">
              <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
              />
              <Editor
                  style=" overflow-y: hidden;min-height: 210px"
                  v-model="valueHtml"
                  :defaultConfig="editorConfig"
                  :mode="mode"
                  @onCreated="handleCreated"
              />
            </div>
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

    <!--    详情对话框-->
    <el-dialog v-model="vis" title="详情" width="50%" center>
      <!--      卡片-->
      <el-card>
        <div v-html="detail.content" style="min-height: 100px ;"></div>
      </el-card>
    </el-dialog>

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
        <el-table-column align="center" fixed prop="name" label="名称"/>
        <el-table-column align="center"  label="公告内容">
          <template #default="scope">
            <el-button type="primary" @click="details(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="user" label="发布者"/>
        <el-table-column align="center" prop="time" label="发布时间"/>
        <el-table-column align="center" width="150" fixed="right" label="操作">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-button type="success" @click="handleEdit(scope.row)">编辑
                <el-icon>
                  <edit/>
                </el-icon>
              </el-button>
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
import {ElMessage} from "element-plus";
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  name: "Notice",
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('')

    const toolbarConfig = {}
    const editorConfig = { placeholder: '请输入内容...',MENU_CONF: {} }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    //上传图片的配置
    editorConfig.MENU_CONF['uploadImage'] = {
      server: 'http://localhost:9091/file/editorUpload',//上传地址
      fieldName: 'file',//设置上传参数名称
    }
    // 上传视频的配置
    editorConfig.MENU_CONF['uploadVideo'] = {
      server: 'http://localhost:9091/file/editorUpload',//上传地址
      fieldName: 'file',//设置上传参数名称
      // 单个文件的最大体积限制，默认为 10M
      maxFileSize: 1000 * 1024 * 1024, // 1000M
    }


    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated
    };
  },
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
      ids: {},//删除的id
      vis: false,//详情弹窗开/关
      detail: {},//详情的内容

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
      request.post('/notice/deleteBatch', this.ids).then(res => {
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
    add() {
      this.title = '新增文章'
      this.valueHtml=''
      // 显示对话框
      this.centerDialogVisible = true
      //清空表单内容
      this.form = {}

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
        request.put("/notice", this.form).then(res => {
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
        debugger
        request.post("/notice/add", this.form).then(res => {
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
      this.title = "修改文章信息"
      this.form = JSON.parse(JSON.stringify(row))
      this.centerDialogVisible = true
    },
    //删除触发
    handleDelete(id) {
      request.delete("notice/" + id).then(res => {
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