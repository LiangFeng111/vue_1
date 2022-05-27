<template>
  <div style="padding: 10px">
    <el-card>
      <div style="display: flex">
        <div style="width: 300px">
          <el-image :src="goods.img" :preview-src-list="[goods.img]" style="width: 100%"></el-image>
        </div>
        <div style="flex: 1">
          <div class="item1"><h3>{{ goods.name }}</h3></div>
          <div class="item1" style="font-size: 14px;">{{ goods.description }}</div>
          <div class="item1" style="color:#ff0000;"><span style="color: #838383">价格：</span>￥{{ goods.price }}</div>
          <div class="item1" style="font-size: 14px">
            <span style="color: #838383">存库：</span>{{ goods.store }}{{ goods.unit }}
          </div>
          <div class="item1" style="display: flex">
            <el-input-number v-model="form.num" :min="1" :max="100"/>
            <span style="margin-left: 10px;font-size: 18px">{{ goods.unit }}</span>
          </div>
          <div class="item1" style="margin-top: 30px">
            <el-button style="background-color: red; color: white" size="large" @click="addCart">
              <component is="Wallet" style="width: 20px;height: 17px"/>
              直接购买
            </el-button>
            <el-button style="background-color: red; color: white" size="large" @click="addCart">
              <component is="ShoppingCart" style="width: 20px;height: 17px"/>
              加入购物车
            </el-button>

          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Detail",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      id: this.$route.query.id,
      goods: {},
      form: {num: 1}
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get("/goods/" + this.id).then(res => {
        this.goods = res.data
      })
    },
    addCart(){
      if (!this.user.id) {
        this.$message.warning("请登录后操作")
        return
      }
      this.form.userId=this.user.id
      this.form.goodsId = this.goods.id
      request.post("/cart/add",this.form).then(res =>{
        if (res.code === '200') {
          this.$message.success("加入购物车成功")
        } else {
          this.$message.error(res.msg)
        }
      })
    },

  },
}
</script>

<style scoped>
.item1 {
  padding: 10px;
  color: #666;
}
</style>