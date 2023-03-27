<template>
  <div class="pvTimePlot-container">
    <el-container ref="elcontrainer">
      <el-header>
        <el-select v-model="selectPV" filterable placeholder="Select">
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
import { get48HoursData, getOneCurrentData } from '@/api/flask_api'

export default {
  name: 'PvTimePlot',
  props: { chartId: { type: String, default: 'mychart' },
    defaultPv: { type: String, default: 'PV name1' },
    setwidth: { type: String, default: '560px' },
    setheight: { type: String, default: '320px' }},
  data() {
    return {
      selectPV: this.defaultPv,
      selectPV_changed: false,
      test_int: 0,
      plotData: [],
      options: [
        {
          value: 'NULL',
          label: 'NULL'
        },
        {
          value: 'IT:PSQ1:GetCurrent',
          label: 'IT:PSQ1:GetCurrent'
        },
        {
          value: 'IT:PSQ2:GetCurrent',
          label: 'IT:PSQ2:GetCurrent'
        },
        {
          value: 'IT:PSQ3:GetCurrent',
          label: 'IT:PSQ3:GetCurrent'
        },
        {
          value: 'IT:PSQ4:GetCurrent',
          label: 'IT:PSQ4:GetCurrent'
        },
        {
          value: 'IT:PSQ5:GetCurrent',
          label: 'IT:PSQ5:GetCurrent'
        }
      ]
    }
  },

  watch: {
    selectPV(newPV, oldPV) {
      this.getInitData()
    }
  },
  mounted() {
    this.echartsInit()
  },

  methods: {
    getInitData() {
      get48HoursData(this.selectPV).then(res => {
        if (res['data']) {
          this.plotData = res['data']
        }
      })
    },
    echartsInit() {
      const echarts = require('echarts/lib/echarts')
      require('echarts/lib/component/title')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/grid')
      require('echarts/lib/chart/line')

      var chartDom = document.getElementById(this.chartId)
      var myChart = echarts.init(chartDom)
      var option

      this.getInitData()
      var accessable = true

      // for test
      option = {
        title: {
          text: 'PV实时值',
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
            return (
              params.name + ' : ' + params.value[1]
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
            data: this.plotData
          }
        ],
        grid: {
          x: 30,
          y: 30,
          x2: 30,
          y2: 30
        }
      }
      setInterval(() => {
        if (accessable) {
          getOneCurrentData(this.selectPV).then(res => {
            // console.log(res.status)
            // if (res['code'] !== 20000) {
            //   accessable = false
            //   myChart.setOption({ title: {
            //     text: '连接PV失败',
            //     padding: 0,
            //     itemGap: 0,
            //     textStyle: {
            //       fontSize: 10,
            //       color: '#FF0000'
            //     }
            //   }})
            // }
            const point = res['data']
            if (point) {
              if (this.plotData.length >= 60) {
                this.plotData.shift()
              }
              this.plotData.push(point)
            }
          }).catch(e => {
            console.log(e)
          })
          myChart.setOption({
            series: [
              {
                data: this.plotData
              }
            ]
          })
        }
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
