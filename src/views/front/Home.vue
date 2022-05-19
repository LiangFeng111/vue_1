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
          <el-col :span="6" v-for="item in files" :key="item.id">
            <el-card>
              <el-image :src="item.url"  />
            </el-card>
            <div style="padding: 10px 0">
              <span>{{item.name}}</span>
            </div>
          </el-col>
        </el-row>
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
      files:[],
    }
  },
  created() {
    request.get('file/front/all').then(res=>{
      console.log(res.data.filter(v=> v.type ==='png' || v.type ==='jpg' || v.type === 'webp'))
      this.files= res.data.filter(v=> v.type ==='png' || v.type ==='jpg' || v.type === 'webp')
    })
  }
}
</script>

<style scoped>

</style>