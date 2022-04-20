<template>
  <div class="pvTimePlot-container">
    <el-container ref="elcontrainer">
      <el-header>
        <el-select v-model="value" filterable placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-header>
      <el-main :style="{'height': setheight, 'width':'100%', 'display':'flex'}">
        <div :id="chartId" style="height: 90%; width:90%; display: inline-table" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import elementResizeDetectorMaker from 'element-resize-detector'

export default {
  name: 'PvTimePlot',
  props: { chartId: { type: String, default: 'mychart' },
    defaultPv: { type: String, default: '' },
    setwidth: { type: String, default: '560px' },
    setheight: { type: String, default: '320px' }},
  data() {
    return {
      value: this.defaultPv,
      options: [
        {
          value: 'Option1',
          label: 'Option1'
        },
        {
          value: 'Option2',
          label: 'Option2'
        },
        {
          value: 'Option3',
          label: 'Option3'
        },
        {
          value: 'Option4',
          label: 'Option4'
        },
        {
          value: 'Option5',
          label: 'Option5'
        }
      ]
    }
  },
  mounted() {
    this.echartsInit()
  },

  methods: {
    echartsInit() {
      const echarts = require('echarts/lib/echarts')
      require('echarts/lib/component/title')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/grid')
      require('echarts/lib/chart/line')

      var chartDom = document.getElementById(this.chartId)
      var myChart = echarts.init(chartDom)
      var option
      function randomData() {
        now = new Date(+now + oneDay)
        value = value + Math.random() * 21 - 10
        return {
          name: now.toString(),
          value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
          ]
        }
      }
      const data = []
      let now = new Date(1997, 9, 3)
      const oneDay = 24 * 3600 * 1000
      let value = Math.random() * 1000
      for (var i = 0; i < 1000; i++) {
        data.push(randomData())
      }
      option = {
        title: {
          text: 'Dynamic Data & Time Axis',
          padding: 0,
          itemGap: 0,
          textStyle: {
            fontSize: 10
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            params = params[0]
            var date = new Date(params.name)
            return (
              date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' : ' +
        params.value[1]
            )
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: 'Fake Data',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        grid: {
          x: 30,
          y: 30,
          x2: 30,
          y2: 30
        }
      }
      setInterval(function() {
        for (var i = 0; i < 5; i++) {
          data.shift()
          data.push(randomData())
        }
        myChart.setOption({
          series: [
            {
              data: data
            }
          ]
        })
      }, 1000)

      option && myChart.setOption(option)

      // const _this = this
      // const erd = elementResizeDetectorMaker()
      // erd.listenTo(this.$refs.elcontrainer, () => {
      //   _this.$nextTick(() => {
      //     myChart.resize()
      //   })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.pvTimePlot {
  &-container {
    margin: 10px;
    padding-top: 10px;
    padding-bottom: 0px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
