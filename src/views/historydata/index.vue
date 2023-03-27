<template>
  <div class="historydata-container">
    <el-row>
      <el-col :span="18">
        <el-container>
          <el-header>
            <el-row>
              <el-col :span="20" :offset="5">
                <el-date-picker
                  v-model="pickdate_val"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />

                <el-button icon="el-icon-refresh" plain @click="refreshData" />
                <el-button type="primary" plain @click="download_csv">下载为csv文件</el-button>
              </el-col>
              <!-- <el-col :span="3">

              </el-col> -->
            </el-row>
          </el-header>
          <el-main>
            <div :id="chartId" :style="{'height': setheight, 'width':'100%'}" />
          </el-main>
        </el-container>
      </el-col>
      <el-col :span="6">
        <el-container>
          <el-header>
            <el-button type="primary" icon="el-icon-plus" circle @click="add_one_pv()" />
            <el-button type="danger" icon="el-icon-minus" circle @click="remove_one_pv()" />
          </el-header>
          <el-main>
            <div v-for="(cas_id,index) in lst_cas_id" :key="index" style="margin-bottom:20px">
              <component :is="'CascadeSelector'" :id="'cas'+index" ref="selector" />
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import MultilinePlot from '@/components/multilinePlot/index.vue'
import CascadeSelector from '@/components/cascadeSelector/index.vue'
import { getArchiverData, getArchiverDataCSV } from '@/api/flask_api'
import request from '@/utils/request'

export default {
  name: 'Historydata',
  components: { CascadeSelector },
  props: { chartId: { type: String, default: 'mychart' }},
  data() {
    return {
      // 与折线图相关参数
      setheight: '500px',

      // 与时间选择器相关参数
      pickdate_val: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近24小时',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        },
        {
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
        }]
      },

      // 与Pv选择器相关
      lst_pv_select: ['pv1'],

      pvSelected: [],

      line_series: [],

      myChart: null
    }
  },
  computed: {
    lst_cas_id() {
      return this.lst_pv_select
    }
  },
  mounted() {
    this.echartsInit()
  },
  methods: {
    add_one_pv() {
      this.lst_pv_select.push('pv')
    },
    remove_one_pv() {
      this.lst_pv_select.pop()
    },

    download_csv() {
      var start_time = null
      var end_time = null
      var pvName_list = ''
      // this.pvSelected = []
      for (var i = 0; i < this.lst_pv_select.length; i++) {
        // temp_pvname = this.$refs.selector[i].PVSelected
        // this.pvSelected.push(this.$refs.selector[i].PVSelected)
        if (pvName_list === '') {
          pvName_list = this.$refs.selector[i].PVSelected
        } else {
          pvName_list = pvName_list + ',' + this.$refs.selector[i].PVSelected
        }
      }
      if (this.pickdate_val.length >= 2 & pvName_list !== '') {
        start_time = this.pickdate_val[0]
        end_time = this.pickdate_val[1]

        var start_time_str = start_time.getFullYear().toString() + '-' +
                  (start_time.getMonth() + 1).toString() + '-' +
                  start_time.getDate().toString() + 'T' +
                  start_time.getHours().toString() + ':' +
                  start_time.getMinutes().toString() + ':' +
                  start_time.getSeconds().toString() + '.000Z'

        var end_time_str = end_time.getFullYear().toString() + '-' +
                  (end_time.getMonth() + 1).toString() + '-' +
                  end_time.getDate().toString() + 'T' +
                  end_time.getHours().toString() + ':' +
                  end_time.getMinutes().toString() + ':' +
                  end_time.getSeconds().toString() + '.000Z'

        var url = request.defaults.baseURL + '/getArchiverDataCSV?pvName_list=' + pvName_list + '&startTime=' + start_time_str + '&endTime=' + end_time_str
        // console.log(url)
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click()
      } else {
        alert('请选择时间与PV')
      }
    },

    async refreshData() {
      // function randomData(randval) {
      //   randval = randval + Math.random() * 21 - 10
      //   return randval
      // }

      this.pvSelected = []
      this.line_series = []
      for (i = 0; i < 10; i++) {
        this.line_series.push({ data: null })
      }
      this.myChart.setOption({ series: this.line_series })
      var temp_pvname = ''
      var start_time = null
      var end_time = null
      if (this.pickdate_val.length >= 2) {
        start_time = this.pickdate_val[0]
        end_time = this.pickdate_val[1]
        for (var i = 0; i < this.lst_pv_select.length; i++) {
          temp_pvname = this.$refs.selector[i].PVSelected
          // this.pvSelected.push(this.$refs.selector[i].PVSelected)
          // console.log(this.pvSelected)
          if (temp_pvname !== '') {
            await getArchiverData(temp_pvname, start_time, end_time).then(res => {
              if (res['data']) {
                this.line_series[i] = { data: res['data'] }
                // console.log(this.line_series.length)
              }
            })
            this.myChart.setOption({ series: this.line_series })
          }
          // console.log(this.line_series.length)
        }
        // console.log(this.line_series.length)

        // this.myChart.setOption({ series: this.line_series })
      } else {
        alert('请选择时间')
      }
    },

    echartsInit() {
      const echarts = require('echarts/lib/echarts')
      require('echarts/lib/component/dataset')
      require('echarts/lib/component/title')
      require('echarts/lib/component/tooltip')
      require('echarts/lib/component/grid')
      require('echarts/lib/chart/line')

      var chartDom = document.getElementById(this.chartId)
      // var myChart = echarts.init(chartDom)
      this.myChart = echarts.init(chartDom)
      var option

      // function randomData(randval) {
      //   randval = randval + Math.random() * 21 - 10
      //   return randval
      // }

      // var data1 = []
      // var data2 = []
      // var now = new Date(1997, 9, 3)
      // const oneDay = 24 * 3600 * 1000
      // var randval1 = 500
      // var randval2 = 500
      // for (var i = 0; i < 1000; i++) {
      //   now = new Date(+now + oneDay)
      //   randval1 = randval1 + Math.random() * 21 - 10
      //   randval2 = randval2 + Math.random() * 21 - 10
      //   data1.push({ name: now.toString(), value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round(randomData(randval1))] })
      //   data2.push({ name: now.toString(), value: [[now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'), Math.round(randomData(randval2))] })
      // }

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
        series: [{
          type: 'line',
          data: [],
          showSymbol: true,
          encode: {
            x: 'Time',
            y: 'PV值',
            itemName: 'Year',
            tooltip: ['PV值']
          }
        }, {
          type: 'line',
          data: [],
          showSymbol: true,
          encode: {
            x: 'Time',
            y: 'PV值',
            itemName: 'Year',
            tooltip: ['PV值']
          }
        }, {
          type: 'line',
          data: [],
          showSymbol: true,
          encode: {
            x: 'Time',
            y: 'PV值',
            itemName: 'Year',
            tooltip: ['PV值']
          }
        }, {
          type: 'line',
          data: [],
          showSymbol: true,
          encode: {
            x: 'Time',
            y: 'PV值',
            itemName: 'Year',
            tooltip: ['PV值']
          }
        }, {
          type: 'line',
          data: [],
          showSymbol: true,
          encode: {
            x: 'Time',
            y: 'PV值',
            itemName: 'Year',
            tooltip: ['PV值']
          }
        }]
      }

      option && this.myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.historydata {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
