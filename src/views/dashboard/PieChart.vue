<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

import {getPieChartRoomType} from '@/api/hotel/roomType'

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
      pieChartData: []
    }
  },
  created() {
    this.getPieChartRoomType()
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
    pieChartData(val,oldVal){
      this.initChart()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          // data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
          data: this.pieChartData.map((item,index) =>{
            return item.name
          })
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            // data: [
            //   { name: 'Industries',value: 320  },
            //   { value: 240, name: 'Technology' },
            //   { value: 149, name: 'Forex' },
            //   { value: 100, name: 'Gold' },
            //   { value: 59, name: 'Forecasts' }
            // ],
            data: this.pieChartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    getPieChartRoomType(){
      this.loading = true;
      getPieChartRoomType().then(
        response => {
          this.pieChartData = response.data
        }
      );
    }
  }
}
</script>
