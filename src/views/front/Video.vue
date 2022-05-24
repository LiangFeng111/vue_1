<template>
  <div style="padding: 10px">
    <el-card>
        <div v-for="item in video" :key="item.id"  style="margin: 10px 0; padding: 10px 0;color: #000000;border-bottom: 1px dashed #808080">
          <span class="item" @click="detail(item.id)">{{item.name}}</span>
          <span style="float:right;font-size: 10px;margin-top: 10px">文件大小{{item.size}}kb</span>
        </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Video",
  data(){
    return{
      video :[],
    }
  },
  created() {
    request.get('file/front/all').then(res=>{
      console.log(res.data)
      this.video= res.data.filter(v => v.type ==='flv' || v.type ==='mp4')
    })
  },
  methods:{
    detail(id){
      this.$router.push({path:"/front/videoDetail" ,query:{id:id}})
    }
  }
}
</script>

<style scoped>
.item{
  font-size: 18px;
}
.item:hover{
  color: #00cdff;

  cursor: pointer
}
</style>