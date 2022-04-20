<template>
  <div class="block" type="CascadeSelector">
    <el-cascader
      placeholder="选择需要展示的PV记录"
      :options="options"
      :props="{ multiple: false }"
      collapse-tags
      filterable
      size="medium"
    />
  </div>
</template>

<script>
export default {
  name: 'CascadeSelector',
  data() {
    return {
      options: [{
        value: 'vacuum',
        label: '真空系统',
        children: [{
          value: 'vac-child1',
          label: '子系统1',
          children: [{
            value: 'vac-pv1',
            label: '真空PV1'
          },
          {
            value: 'vac-pv2',
            label: '真空PV2'
          }]
        }, {
          value: 'vac-child2',
          label: '子系统2'
        }, {
          value: 'vac-child3',
          label: '子系统3'
        }]
      },
      {
        value: 'beamline',
        label: '束线段',
        children: [{
          value: 'beamline-child1',
          label: '束线段1',
          children: [{
            value: 'beamline-pv1',
            label: '束线PV1'
          },
          {
            value: 'beamline-pv2',
            label: '束线PV2'
          }]
        }, {
          value: 'beamline-child2',
          label: '束线段2'
        }, {
          value: 'beamline-child3',
          label: '束线段3'
        }]
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.block {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
