<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="margin-top" shadow="always">
      <!-- echarts图表 -->
      <!-- 2,为 Echarts 准备一个具备高宽的DOM容器 -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1,引入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data: function() {
    return {
      // 4，指定图表的配置项和数据
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 3,初始化一个 echarts 实例
    var myChart = echarts.init(document.getElementById('main'))
    const res = await this.$http.get('reports/type/1')
    if (res.data.meta.status !== 200) {
      return this.$message.error('获取图表数据失败')
    }
    this.options = _.merge(this.option, res.data.data)
    // 5,显示图表
    myChart.setOption(this.option)
  }
}
</script>
