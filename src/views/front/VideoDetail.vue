<template>
  <div>
    <vue3VideoPlay
        v-bind="options"
        poster="http://localhost:9091/file/b2edb9f50a87462cbe448c4e31321835.jpg"
    />
  </div>
</template>

<script>
import request from "@/utils/request";
import { reactive } from "vue";
export default {
  name: "VideoDetail",
  components:{

  },
  data(){
    return{
      options :reactive({
        width: "100%", //播放器高度
        height: "500px", //播放器高度
        color: "#409eff", //主题色
        title: "", //视频名称
        src: '', //视频源
        muted: false, //静音
        webFullScreen: false,
        speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
        autoPlay: true, //自动播放
        loop: false, //循环播放
        mirror: false, //镜像画面
        ligthOff: false, //关灯模式
        volume: 0.3, //默认音量大小
        control: true, //是否显示控制
        controlBtns: [
          "audioTrack",//音轨
          "quality",//清晰度
          "speedRate",//倍速
          "volume",//音量
          "setting",//设置
          "pip",//画中画
          "pageFullScreen",//全屏
          "fullScreen",//全屏
        ], //显示所有按钮,
      }),

    }
  },
  mounted() {

  },

  created() {
    let id = this.$route.query.id
    request.get("/file/get/"+id).then(res=>{
      this.options.src= res.data.url
    })
  },
  methods:{

  }
}
</script>

<style scoped>

</style>