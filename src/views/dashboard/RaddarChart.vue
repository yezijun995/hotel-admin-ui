<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

import {getOrderRadderChart} from "@/api/hotel/orders";

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      orderCount: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  created() {
    this.getOrderRadderChart()
  },
  watch:{
    orderCount(val,oldVal){
      this.initChart()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '已取消', max: eval(this.orderCount.join('+')) },
            { name: '未付款', max: eval(this.orderCount.join('+')) },
            { name: '已付款', max: eval(this.orderCount.join('+')) },
            { name: '已入住', max: eval(this.orderCount.join('+')) },
            { name: '已退宿', max: eval(this.orderCount.join('+'))},
          ]
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['订单状态']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: this.orderCount,
              name: '订单状态'
            },

          ],
          animationDuration: animationDuration
        }]
      })
    },
    /** 查询订单图表数 */
    getOrderRadderChart() {
      this.loading = true;
      getOrderRadderChart().then(
        response => {
          this.orderCount = response.data
        }
      );
    },
  }
}
</script>
