<template>
  <div class="multilinePlot-container">
    <el-row :gutter="0">
      <el-col :span="14">
        <el-container>
          <el-header>
            <div class="block">
              <el-date-picker
                v-model="value_dates"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              />
            </div>
          </el-header>
          <el-main :style="{'height': setheight, 'width':'120%', 'display':'flex'}">
            <div :id="chartId" style="height: 90%; width:100%; display: inline-table" />
          </el-main>
        </el-container>
      </el-col>

      <el-col :span="10" style="padding-top: 100px">
        <!-- <span> 选择需要展示的PV记录 </span> -->
        <div id="pv-select-col">
          <CascadeSelector v-show="cas0_visible" :id="Cas0" ref="selector0" @PVChanged="pv0changed" />
          <CascadeSelector v-show="cas1_visible" :id="Cas1" ref="selector1" @PVChanged="pv1changed" />
          <CascadeSelector v-show="cas2_visible" :id="Cas2" ref="selector2" @PVChanged="pv2changed" />
          <CascadeSelector v-show="cas3_visible" :id="Cas3" ref="selector3" @PVChanged="pv3changed" />
        </div>
      </el-col>
    </el-row>
    <div id="plusbutton">
      <el-button type="primary" icon="el-icon-plus" circle style="margin-left:260px; margin-top: 30px" @click="clickPlus()" />
    </div>
    <div id="minusbutton">
      <el-button type="danger" icon="el-icon-minus" circle style="margin-left:260px; margin-top: 30px" @click="clickMinus()" />
    </div>

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import $ from 'jquery'
import CascadeSelector from '@/components/cascadeSelector/index.vue'
import { getArchiverData } from '@/api/flask_api'

export default {
  name: 'MultilinePlot',
  components: { CascadeSelector },
  props: { chartId: { type: String, default: 'mychart' }},
  data() {
    return {
      value: '',
      setwidth: '800px',
      setheight: '600px',

      PVNames: [null, null, null, null],

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value_dates: [],

      cas0_visible: true,
      cas1_visible: false,
      cas2_visible: false,
      cas3_visible: false
    }
  },
  mounted() {
    this.echartsInit()
  },

  methods: {
    echartsInit() {
      const echarts = require('echarts/lib/echarts')
      require('echarts/lib/component/dataset')
      require('echarts/lib/component/title')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/grid')
      require('echarts/lib/chart/line')

      var chartDom = document.getElementById(this.chartId)
      var myChart = echarts.init(chartDom)
      var option

      function randomData(randval) {
        randval = randval + Math.random() * 21 - 10
        return randval
      }

      var data1 = []
      var data2 = []
      var now = new Date(1997, 9, 3)
      const oneDay = 24 * 3600 * 1000
      var randval1 = 500
      for (var i = 0; i < 1000; i++) {
        now = new Date(+now + oneDay)
        randval1 = randval1 + Math.random() * 21 - 10
        // randval2 = randval2 + Math.random() * 21 - 10
        data1.push({ name: now.toString(), value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round(randomData(randval1))] })
        // data2.push({ name: now.toString(), value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round(randomData(randval2))] })
      }

      option = {
        // title: {
        //   text: 'Achiver记录的PV数据'
        // },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          name: 'Time',
          type: 'time',
          nameLocation: 'center',
          nameTextStyle: {
            padding: [10, 0]
          }
        },
        yAxis: {
          name: 'PV Value',
          scale: true
        },
        series: [
          {
            type: 'line',
            data: data1,
            showSymbol: false,
            encode: {
              x: 'Time',
              y: 'PV值',
              itemName: 'Year',
              tooltip: ['PV值']
            }
          },

          {
            type: 'line',
            data: data2,
            showSymbol: false,
            encode: {
              x: 'Time',
              y: 'PV值',
              itemName: 'Year',
              tooltip: ['PV值']
            }
          }

        ]
      }
      // myChart.setOption(option)

      option && myChart.setOption(option)
    },

    clickPlus() {
      if (!this.cas0_visible) {
        this.cas0_visible = true
      } else if (!this.cas1_visible) {
        this.cas1_visible = true
      } else if (!this.cas2_visible) {
        this.cas2_visible = true
      } else if (!this.cas3_visible) {
        this.cas3_visible = true
      }
    },
    clickMinus() {
      if (this.cas3_visible) {
        this.cas3_visible = false
      } else if (this.cas2_visible) {
        this.cas2_visible = false
      } else if (this.cas1_visible) {
        this.cas1_visible = false
      } else if (this.cas0_visible) {
        this.cas0_visible = false
      }
    },

    pv0changed(value) {
      this.PVNames[0] = value
      console.log(this.PVNames)
    },
    pv1changed(value) {
      this.PVNames[1] = value
      console.log(this.PVNames)
    },
    pv2changed(value) {
      this.PVNames[2] = value
      console.log(this.PVNames)
    },
    pv3changed(value) {
      this.PVNames[3] = value
      console.log(this.PVNames)
    }

  }
}
</script>

<style lang="scss" scoped>
.multilinePlot {
  &-container {
    margin: 0px;
    // padding-top: 15px;
    // padding-bottom: 15px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
};
.block {
  margin-left: 200px;
  margin-bottom: 0px
};
CascadeSelector {
  position: absolute;
  left: 0px;
};

#plusbutton {
  position: absolute;
  right:30px;
  top:100px;
};
#minusbutton {
  position: absolute;
  right:30px;
  top: 160px
};
</style>
