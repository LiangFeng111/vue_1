<template>
  <div style="padding: 10px">
    <el-row :gutter="10" :span="10" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card style="color:#409EFF;">
          <div ><el-icon><Avatar /></el-icon>用户总数</div>
          <div style="padding: 10px 0 ;text-align: center;font-weight: bold">
            100
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card  style="color:#F56C6C;">
          <div><el-icon><CreditCard /></el-icon>销售总量</div>
          <div style="padding: 10px 0 ;text-align: center;font-weight: bold">100000000￥</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card  style="color:#67C23A;">
          <div><el-icon><Coin /></el-icon>收益总额</div>
          <div style="padding: 10px 0 ;text-align: center;font-weight: bold">3000000￥</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card  style="color:#E6A23C;">
          <div><el-icon><Shop /></el-icon>门店总数</div>
          <div style="padding: 10px 0 ;text-align: center;font-weight: bold">100</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div id="line" style="width: 500px ;height: 400px"/>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 500px ;height: 400px"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import request from "@/utils/request";


export default {
  name: "Home",
  data() {
    return {}
  },
  mounted() {//页面元素渲染之后触发

    var option = {
      title: {
        text: '各季度会员数量统计',
        subtext: '趋势图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} 人'
        }
      },
      series: [
        {
          name:"瑞星咖啡",
          data: [],
          type: 'line'
        },
        {
          name:"瑞星咖啡",
          data: [],
          type: 'bar'
        },
        {
          name:"星巴克",
          data: [],
          type: 'line'
        },
        {
          name:"星巴克",
          data: [],
          type: 'bar'
        }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(53,56,54,0.5)'
        }
      }
    };
    var pieOption = {
      title: {
        text: '各季度会员数量统计',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name:"星巴克",
          type: 'pie',
          radius: '50%',
          label: {   //饼图上的文本标签
            normal: {
              show: true,
              position: "inner", //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 14,   //位置的大小
                color: "#fff"
              },
              formatter: '{d}%'
            }
          },
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    var chartDom = document.getElementById('line');
    var myChart = echarts.init(chartDom);

    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);

    request.get("/echarts/members").then(res => {
      //填空
      option.series[0].data = res.data
      option.series[1].data = res.data
      option.series[2].data = res.data
      option.series[3].data = res.data
      //数据准备完毕之后在填充
      myChart.setOption(option);
      pieOption.series[0].data = [
        {name: '第一季度', value: res.data[0]},
        {name: '第二季度', value: res.data[1]},
        {name: '第三季度', value: res.data[2]},
        {name: '第四季度', value: res.data[3]}
      ]
      pieChart.setOption(pieOption);
    })


  }
}
</script>

<style scoped>

</style>