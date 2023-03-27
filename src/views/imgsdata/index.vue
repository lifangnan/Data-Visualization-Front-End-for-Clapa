<template>
  <div class="imgsdataPage">
    <div class="selectdiv">
      <span class="simpletext">日期：</span>
      <!-- <el-date-picker
        v-model="value_dates"
        type="dates"
        placeholder="选择一个或多个日期"
        @change=""
      /> -->
      <el-date-picker
        v-model="value_dates"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="DateChanged"
      />

      <span class="simpletext">相机设备：</span>
      <el-select v-model="camera_value" filterable placeholder="请选择">
        <el-option
          v-for="item in camera_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <span style="margin-left: 10px;">
        <el-button type="primary" plain @click="Download_button1()">下载当前相机图片</el-button>
      </span>

      <!-- <span style="margin-left: 10px;">
        <el-button type="primary" plain>打包下载所有图片</el-button>
      </span> -->
    </div>
    <el-divider />

    <div>
      <el-row>
        <el-col v-for="(o, index) in srcList.length" :key="o" :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <el-image
              :key="fit"
              class="block"
              style="width: 100%; height: 100%; padding:5px"
              :src="srcList[index]"
              :fit="'contain'"
              :preview-src-list="srcList"
              lazy
            />
            <div style="padding: 0px; text-align:center; margin-top:2px; margin-bottom:2px;">
              {{ filenames[index] }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>

</template>

<script>
import { getFilenamesAndUrls } from '@/api/flask_api'
import request from '@/utils/request'

export default {
  name: 'Imgsdata',
  data() {
    return {
      value_dates: [],
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

      value: '',

      camera_options: [{
        value: 'andor1',
        label: 'Andor'
      }],
      camera_value: '',

      // url: require('@/icons/test_jpgs/1.jpg'),
      filenames: [
      ],
      srcList: [
      ]
    }
  },
  watch: {
    camera_value(newval, oldval) {
      this.updateImgsList()
    }
  },
  mounted() {
    // this.updateImgsList()
  },

  methods: {
    updateImgsList() {
      var startTime = null
      var endTime = null
      if (this.value_dates) {
        startTime = this.value_dates[0]
        endTime = this.value_dates[1]
      }

      getFilenamesAndUrls(this.camera_value, startTime, endTime).then(res => {
        if (res['data']) {
          this.filenames = res['data']['filenames']
          var mongnoDB_ids = res['data']['srcList']
          for (var key in mongnoDB_ids) {
            mongnoDB_ids[key] = request.defaults.baseURL + '/getOneImg' + mongnoDB_ids[key]
            // console.log(mongnoDB_ids[key])
          }
          this.srcList = mongnoDB_ids
        }
      })
    },

    DateChanged() {
      if (this.camera_value) {
        this.updateImgsList()
      }
    },

    Download_button1() {
      if (this.camera_value) {
        const a = document.createElement('a')
        a.href = request.defaults.baseURL + '/downloadAllImages?cameraName=' + this.camera_value
        a.target = '_blank'
        a.click()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectdiv {
    padding-top:15px;
    padding-left:15px;
    padding-right:15px;
};

.simpletext {
    margin-left: 15px;
    margin-right: 5px;
}
</style>
