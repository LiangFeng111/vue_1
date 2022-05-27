<template>
  <div>
    <div style="margin: 10px 0">
      <el-carousel height="450px" :interval="10000">
        <el-carousel-item v-for="item in imgs" :key="item">
          <img style="height: 100%;width: 100%" :src="item"  alt="图片已损坏" />{{ item }}
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="margin: 10px 0">
        <el-row :gutter="10">
          <el-col style="padding: 5px;border-radius: 10px; overflow: hidden;border: 1px solid #d4d4d4;" :span="6" v-for="item in tableData" :key="item.id">
            <div style="padding: 10px ;">
              <el-image :src="item.img" @click="$router.push('/front/detail?id=' +item.id)" style="cursor: pointer" />
              <div style="padding-bottom: 5px;font-size: 18px">
                <b style="cursor: pointer" @click="$router.push('/front/detail?id=' +item.id)">{{item.name}}</b>
              </div>
              <div style="padding-bottom: 5px;font-size: 14px">
                {{item.description}}
              </div>
              <div style="padding-bottom: 5px;font-size: 14px;color: orangered">
                ￥{{item.price}}
              </div>
            </div>
          </el-col>
        </el-row>
    </div>
    <!--      分页-->
    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import locale from "element-plus/es/locale/lang/zh-cn";

export default {
  name: "FrontHome",
  data(){
    return{
      imgs:[
          'https://img20.360buyimg.com/babel/s1580x830_jfs/t1/213222/35/8846/99376/61c5b0c2E8e711323/1c9dceee5fa83728.jpg!cc_1580x830.webp',
          'https://img11.360buyimg.com/babel/s1580x830_jfs/t1/48752/1/18172/86780/627d37dfEed18adb9/c8ba882c4572b03c.jpg!cc_1580x830.webp'
          ,'https://img10.360buyimg.com/babel/s1580x830_jfs/t1/181735/29/23750/83430/6284bbd0E8cbbbb17/bda8b25a22ea4de8.jpg!cc_1580x830.webp'
      ],
      input: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    }
  },
  methods:{
    load() {
      request.get('goods/page',{
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.input,
        }
      }).then(res=>{
        this.tableData = res.data.data
        this.total = res.data.total
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
  created() {
    this.load()
  },
}
</script>

<style scoped>

</style>