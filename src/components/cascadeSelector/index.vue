<template>
  <el-cascader
    v-model="cascaderSelected"
    placeholder="选择需要展示的PV记录"
    :options="options"
    :props="{ multiple: false }"
    collapse-tags
    filterable
    size="medium"
    @change="PVSelectedChanged"
  />
</template>

<script>
export default {
  name: 'CascadeSelector',
  data() {
    return {
      cascaderSelected: [],
      PVSelected: '',
      options: [{
        value: 'laser',
        label: '激光系统',
        children: [{
          value: 'Mshutterstate',
          label: 'Mshutter'
        }]
      },
      {
        value: 'beamline',
        label: '束线段',
        children: [{
          value: 'IT:PSQ1:GetCurrent',
          label: 'Q1电流'
        },
        {
          value: 'IT:PSQ2:GetCurrent',
          label: 'Q2电流'
        },
        {
          value: 'IT:PSQ3:GetCurrent',
          label: 'Q3电流'
        },
        {
          value: 'IT:PSB1:GetCurrent',
          label: '偏转磁铁电流'
        },
        {
          value: 'IT:PSQ4:GetCurrent',
          label: 'Q4电流'
        },
        {
          value: 'IT:PSQ5:GetCurrent',
          label: 'Q5电流'
        }]
      }]
    }
  },

  watch: {
    cascaderSelected(newval, oldval) {
      this.PVSelected = newval[newval.length - 1]
    }
  },
  methods: {
    PVSelectedChanged() {
      // console.log(this.PVSelected[this.PVSelected.length - 1])
      this.$emit('PVChanged', this.PVSelected[this.PVSelected.length - 1])
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
