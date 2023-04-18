<template>
  <div class="input-range">
    <el-input
      v-model.number="min"
      placeholder="最小值"
      :style="{ width: `${inputWidth}px` }"
      :name="`${name}-min`"
      size="medium"
      type="number"
      style="-webkit-appearance: none;"
      @change="handleChangeMin"
    ></el-input>
    <span class="splitter">-</span>
    <el-input
      v-model.number="max"
      placeholder="最大值"
      :style="{ width: `${inputWidth}px` }"
      :name="`${name}-max`"
      size="medium"
      type="number"
      style="-webkit-appearance: none;"
      @change="handleChangeMax"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: 'InputRange',

  props: {
    value: {
      type: Array,
      default: () => [null, null]
    },
    name: String,
    inputWidth: {
      type: Number,
      default: 120
    }
  },

  data() {
    return {
      min: this.value[0] !== null ? this.value[0] : '',
      max: this.value[1] !== null ? this.value[1] : ''
    };
  },

  watch: {
    value(val) {
      this.min = val[0] !== null ? val[0].toString() : '';
      this.max = val[1] !== null ? val[1].toString() : '';
    },
    min(val) {
      if (val === '') {
        return;
      }
      if (this.max !== '' && Number(val) > Number(this.max)) {
        this.min = this.max;
        this.$emit('input', [this.max, this.max]);
      } else {
        this.$emit('input', [Number(val), this.max === '' ? null : Number(this.max)]);
      }
    },
    max(val) {
      if (val === '') {
        return;
      }
      if (this.min !== '' && Number(val) < Number(this.min)) {
        this.max = this.min;
        this.$emit('input', [Number(this.min), Number(this.min)]);
      } else {
        this.$emit('input', [this.min === '' ? null : Number(this.min), Number(val)]);
      }
    }
  },

  methods: {
    handleChangeMin() {
      if (this.min === '') {
        return;
      }
      if (this.max !== '' && Number(this.min) > Number(this.max)) {
        this.min = this.value[0] !== null ? this.value[0].toString() : '';
      }
    },
    handleChangeMax() {
      if (this.max === '') {
        return;
      }
      if (this.min !== '' && Number(this.max) < Number(this.min)) {
        this.max = this.value[1] !== null ? this.value[1].toString() : '';
      }
    }
  },

  // ...
}
</script>

<style scoped>
.input-range {
  display: inline-flex;
  align-items: center;
}

.splitter {
  margin: 0 10px;
}

.el-input-number__decrease,
.el-input-number__increase {
  display: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none  !important;
  margin: 0;
}
</style>
