<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  import {getOrderBarChartCost} from '@/api/hotel/orders'

  const animationDuration = 6000

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
    created() {
      this.getOrderBarChartCost()
    },
    data() {
      return {
        chart: null,
        monthCost: []
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
    watch:{
      monthCost(val,oldVal){
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
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: '金额',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            // data: [79, 52, 200, 334, 390, 330, 220, 1000, 101, 59, 1000, 2000],
            data: this.monthCost.map((item,index) => {
              return item.value
            }),
            animationDuration
          }]
        })
      },
      getOrderBarChartCost(){
        this.loading = true;
        getOrderBarChartCost().then(
          response => {
            this.monthCost = response.data
            console.log(this.monthCost)
          }
        );
      }
    }
  }
</script>
