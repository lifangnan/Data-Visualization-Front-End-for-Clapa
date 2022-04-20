<template>
  <div class="imgsdataPage">
    <div class="selectdiv">
      <span class="simpletext">日期：</span>
      <el-date-picker
        v-model="value_dates"
        type="dates"
        placeholder="选择一个或多个日期"
      />

      <span class="simpletext">发次：</span>
      <el-select v-model="value" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-divider />

    <div>
      <el-row>
        <el-col v-for="(o, index) in 250" :key="o" :span="6">
          <el-card :body-style="{ padding: '0px' }">
            <el-image
              :key="fit"
              class="block"
              style="width: 100%; height: 100%; padding:5px"
              :src="url"
              :fit="'contain'"
              :preview-src-list="srcList"
              lazy
            />
            <div style="padding: 0px; text-align:center; margin-top:2px; margin-bottom:2px;">
              {{ index }}.jpg
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>

</template>

<script>
export default {
  name: 'Imgsdata',
  data() {
    return {
      value_dates: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',

      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ]
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
