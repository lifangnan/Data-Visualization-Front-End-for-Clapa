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

      <span style="margin-left: 10px;">
        <el-button type="primary" plain>导出为CSV</el-button>
      </span>

    </div>
    <el-divider />

    <div style="margin-left:5px;">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="date"
          label="时间戳"
          width="150"
          sortable
        />
        <el-table-column
          prop="name"
          label="列1"
        />
        <el-table-column
          prop="address"
          label="列2"
          show-overflow-tooltip
        />
      </el-table>
    </div>

  </div>

</template>

<script>
export default {
  name: 'Tabledata',
  data() {
    return {
      // 与选择器相关
      value_dates: [],
      options: [{
        value: '选项1',
        label: 'No.1'
      }, {
        value: '选项2',
        label: 'No.2'
      }, {
        value: '选项3',
        label: 'No.3'
      }, {
        value: '选项4',
        label: 'No.4'
      }, {
        value: '选项5',
        label: 'No.5'
      }],

      // 与表格相关
      tableData: [{
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }, {
        date: '2022-04-01 13:00',
        name: '数据1',
        address: '数据2'
      }],
      multipleSelection: []

    }
  },

  methods: {
    // 表格选择改变后，相关方法
    handleSelectionChange(val) {
      this.multipleSelection = val
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
