<template>
  <div class="Operationstatus-container">
    <div class="pagetitle">运行状态</div>
    <el-row :gutter="10">
      <el-col :span="12"><div class="grid-content shadow">
        <PvTimePlot :chart-id="'plot1'" />
      </div></el-col>
      <el-col :span="12"><div class="grid-content shadow">
        <PvTimePlot :chart-id="'plot2'" />
      </div></el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12"><div class="grid-content shadow">
        <PvTimePlot :chart-id="'plot3'" />
      </div></el-col>
      <el-col :span="12"><div class="grid-content shadow">
        <PvTimePlot :chart-id="'plot4'" />
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
import PvTimePlot from '@/components/pvTimePlot/index.vue'

export default {
  name: 'Operationstatus',
  components: { PvTimePlot }
}
</script>

<style lang="scss" scoped>
.Operationstatus {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.pagetitle {
    font-size: 30px;
}

.shadow {
    box-shadow: 0 0 0 red,   /*左边阴影*/

            0 0 0 black,  /*上边阴影*/

            10px 0px 10px gray,  /*右边阴影*/

            0px 10px 10px gray; /*下边阴影*/
            }

.el-row{
   margin-bottom: 20px;
   margin-top: 20px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
