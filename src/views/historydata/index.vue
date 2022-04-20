<template>
  <div class="historydata-container">
    <MultilinePlot :chart-id="historyPlot" />
  </div>
</template>

<script>
import MultilinePlot from '@/components/multilinePlot/index.vue'

export default {
  name: 'Historydata',
  components: { MultilinePlot }
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
