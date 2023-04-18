<template>
    <div class="data-input-range">
      <!-- <el-input
        v-model.number="min"
        placeholder="最小值"
        :style="{ width: `${inputWidth}px` }"
        :name="`${name}-min`"
        size="medium"
        ref="minInput"
        @blur="validate"
      ></el-input>
      <span class="splitter">-</span>
      <el-input
        v-model.number="max"
        placeholder="最大值"
        :style="{ width: `${inputWidth}px` }"
        :name="`${name}-max`"
        size="medium"
        ref="maxInput"
        @blur="validate"
      ></el-input> -->
      <el-input
        v-model.number="min"
        placeholder="最小值"
        :style="{ width: `${inputWidth}px` }"
        :name="`${name}-min`"
        size="medium"
        type="number"
      ></el-input>
      <span class="splitter">-</span>
      <el-input
        v-model.number="max"
        placeholder="最大值"
        :style="{ width: `${inputWidth}px` }"
        :name="`${name}-max`"
        size="medium"
        type="number"
      ></el-input>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InputNumberRange',
    props: {
      value: {
        type: Array,
        default: () => [null, null]
      },
      name: String,
      inputWidth: {
        type: Number,
        default: 80
      }
    },
    data() {
      console.log(this.value)
      return {
        min: this.value[0],
        max: this.value[1]
      }
    },
    watch: {
      value(val) {
        // 父组件修改 value 时更新组件内部的 min 和 max
        this.min = val[0];
        this.max = val[1];
        // this.$nextTick(() => {
        //   this.validate();
        // });
      },
      min(val) {
        // 当 min 或 max 改变时触发 input 事件
        this.$emit('input', [parseFloat(val.toFixed(2)), this.max]);
        console.log(val)
        
        if (!isNaN(this.max) && val > this.max) {
          console.log('gr')
          this.min = this.max;
        }
      },
      max(val) {
        // 当 min 或 max 改变时触发 input 事件
        this.$emit('input', [this.min, parseFloat(val.toFixed(2))]);
        if (!isNaN(this.min) && val < this.min) {
          this.max = this.min;
        }
      }
    },
    // methods: {
    //   validate() {
    //     const { minInput, maxInput } = this.$refs;
  
    //     // 如果两个输入框都有值，则进行验证
    //     if (minInput && minInput.value !== '' && maxInput && maxInput.value !== '') {
    //       const minVal = parseFloat(minInput.value);
    //       const maxVal = parseFloat(maxInput.value);
  
    //       // 验证最大值必须大于等于最小值
    //       if (maxVal < minVal) {
    //         maxInput.$refs.input.blur();
    //         maxInput.$refs.input.focus();
    //         maxInput.$refs.input.select();
    //         maxInput.setError('最大值必须大于等于最小值');
    //         return false;
    //       }
  
    //       // 清除错误提示
    //       minInput.clearValidate();
    //       maxInput.clearValidate();
  
    //       return true;
    //     }
    //   }
    // }
  }
  </script>
  
  <style scoped>
  .data-input-range {
    display: inline-flex;
    align-items: center;
  
    /* .splitter {
      margin: 0 10px;
    }
  
    .el-input {
      margin-right: 5px;
    } */
  }
  </style>
  