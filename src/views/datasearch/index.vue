<template>
  <div class="datasearch" v-if="totalColumns">
    <div class="selectdiv">
      <template v-for="(filter, index) in filters">
        <div v-if="visibleFilters.includes(filter.prop)" class="filter-row">
          <template v-if="filter.class === 'date-range'">
            <span class="simpletext">{{ filter.label }}：</span>
            <el-date-picker
              size="medium"
              v-model="filter.value"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
            ></el-date-picker>
          </template>

          <template v-if="filter.class === 'number-range'">
            <span class="simpletext">{{ filter.label }}：</span>
            <input-number-range
              :precision="2"
              v-model="filter.value"
            ></input-number-range>
          </template>

          <template v-if="filter.class === 'select'">
            <span class="simpletext">{{ filter.label }}：</span>
            <el-select
              size="medium"
              v-model="filter.value"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="option in filter.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>

          <template v-if="filter.class === 'text'">
            <span class="simpletext">{{ filter.label }}：</span>
            <el-input
              size="medium"
              class="textInput"
              v-model="filter.value"
            ></el-input>
          </template>
        </div>
      </template>

      <div class="searchGroup" style="margin-left: 10px">
        <el-button type="primary" @click="search(selectedCollection, filters)"
          >检索</el-button
        >
        <el-button type="secondary" @click="dialogFormVisible = true"
          >设置</el-button
        >
      </div>
    </div>

    <el-dialog title="设置" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="选择数据集">
          <el-cascader
            placeholder="键入可搜索collection"
            :options="avaliableCollection"
            v-model="selectedCollection"
            disabled 
            @change="handleCollectionSelect(selectedCollection)"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="表格展示字段">
          <el-checkbox-group v-model="visibleColumns">
            <el-checkbox
              v-for="(column, index) in totalColumns"
              :key="column.prop"
              :label="column.prop"
              v-if="column.type !== 'dict'"
              >{{ column.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="搜索可用字段">
          <el-checkbox-group v-model="visibleFilters">
            <el-checkbox
              v-for="(column, index) in totalColumns"
              :key="column.prop"
              :label="column.prop"
              v-if="column.type !== 'dict'"
              >{{ column.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <div style="margin-left: 5px">
      <el-table
        ref="multipleTable"
        :data="tableResult"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="expand" width="55">
          <template slot-scope="details">
            <!-- 必须用 row -->
            <!-- {{ details.row }} -->
            <el-row class="expand-row">
              <!-- 左侧内容 -->
              <el-col :span="4">
                <p class="p-center">基本信息</p>
                <!-- 循环展示所有字段信息 -->
                <template v-for="(column, index) in totalColumns">
                  <!-- 只展示非字典类型的信息 -->
                  <template v-if="column.type !== 'dict'">
                    <!-- <h3>{{ column.label }}</h3> -->
                    <p>{{ column.label }}: {{ details.row[column.prop] }}</p>
                  </template>
                </template>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="8">
                <p class="p-center">实验图片</p>
                <div
                  v-if="details.row.Images"
                  ref="imgContainer"
                  class="imgContainer"
                >
                  <!-- <el-carousel >
                    <el-carousel-item v-for="(image, imageName) in details.row.Images" :key="imageName">
                      <img ref="imgElement" :src="imageUrl(image)" />
                    </el-carousel-item>
                    <img :src="imageUrl( Object.values(details.row.Images)[0])" style="opacity: 0;" alt="">
                  </el-carousel> -->

                  <el-carousel :height="imgheight">
                    <el-carousel-item
                      v-for="(image, imageName) in details.row.Images"
                      :key="imageName"
                    >
                      <img ref="imgElement" :src="imageUrl(image)" />
                    </el-carousel-item>
                    <!-- <img :src="imageUrl( Object.values(details.row.Images)[0])" class="img-wrap" style="opacity: 0;" alt=""> -->
                  </el-carousel>
                </div>
                <div v-else>无图片展示</div>
              </el-col>
              <el-col :span="1"></el-col>
              
              <el-col :span="8">
                <p class="p-center">PV列表</p>
                <el-table
                  size="mini"
                  :height="imgheight"
                  :data="
                    Object.entries(details.row.PVSnapshot).map(
                      ([prop, value]) => ({ prop, value })
                    )
                  "
                  border
                >
                  <el-table-column
                    prop="prop"
                    label="Property"
                  ></el-table-column>
                  <el-table-column prop="value" label="Value"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(column, index) in dynamicColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :sortable="column.sortable"
          :resizable="true"
        ></el-table-column>
      </el-table>
    </div>


    <div class="pagination-container">
    <el-pagination
    v-if="searchData"
      @current-change="handleCurrentChange"
      :current-page="getCurrentPage"
      :page-size="searchData.metadata.limit"
      layout="total, prev, pager, next, jumper"
      :total="searchData.metadata.total_results"
    />
</div>
  
  </div>
</template>

<script>
import InputNumberRange from "@/components/InputNumberRange/index.vue";
import Pagination from '@/components/Pagination/index.vue' 
import {
  getMongoSearch,
  getMongoCollection,
  getMongoFields,
} from "@/api/search_api";
import { getArchiverData, getArchiverDataCSV } from "@/api/flask_api";
export default {
  name: "SearchData",
  components: { InputNumberRange,Pagination },
  data() {
    return {
      selectedCollection: null,
      avaliableCollection: null,
      totalColumns: null,
      visibleFilters: null,
      visibleColumns: null,
      filters: null,
      // filters: null,
      // totalColumns:null,
      dialogFormVisible: false,
      // visibleFilters: ['timestamp', 'energy',],
      // visibleColumns: ['timestamp', 'recordId', 'energy', 'comment', 'pvValues', 'imageFiles'],
      // totalColumns: [
      //   { prop: 'timestamp', label: '时间戳', width: '150px', sortable: true },
      //   { prop: 'recordId', label: '发次' },
      //   { prop: 'energy', label: '能量' },
      //   { prop: 'comment', label: '实验备注or关键词' },
      //   { prop: 'pvValues', label: 'PV值' },
      //   { prop: 'imageFiles', label: '图片文件' }
      // ],
      // filters: [
      //   { prop: 'timestamp', label: '时间戳', type: 'date-range' },
      //   { prop: 'recordId', label: '发次', type: 'select', options: [/* ... */] },
      //   { prop: 'energy', label: '能量', type: 'number-range' },
      //   { prop: 'comment', label: '实验备注or关键词', type: 'text' },
      //   { prop: 'pvValues', label: 'PV值', type: 'text' },
      //   { prop: 'imageFiles', label: '图片文件', type: 'text' }
      // ],
      // 与表格相关
      searchData: null,
      colomnsDisplay: { timestamp: { width: "150px", sortable: true } },
    };
  },
  computed: {
    imgheight() {
      const imgContainer = this.$refs.imgContainer;
      const imgElement = this.$refs.imgElement;
      if (imgElement && imgContainer && imgElement.naturalWidth) {
        const aspectRatio = imgElement.naturalWidth / imgElement.naturalHeight;
        return imgContainer.clientWidth / aspectRatio;
      } else {
        return "300px";
      }
    },
      getCurrentPage(){
        parseInt( this.searchData.metadata.offset/this.searchData.metadata.limit + 1,10)
      },
      tableResult(){
        if(this.searchData){
          return this.searchData.results
        }else{
          return null
        }
      },
    // imgheight() {
    //   return '300px'
    //   const imgElement = this.$refs.imgElement;
    //   if (imgElement && imgElement.clientHeight) {
    //     return imgElement.clientHeight;
    //   } else {
    //     return null; // 如果图片未加载，则返回 null 或其他默认值
    //   }
    // },
    dynamicColumns() {
      // 根据当前选择的列动态生成表格列
      console.log("dynamic", this.visibleColumns);
      return this.totalColumns.filter((column) =>
        this.visibleColumns.includes(column.prop)
      );
    },
  },
  methods: {
    imageUrl(image) {
      // 拼接图片 URL
      return `http://178.239.174.249:9000/${image.BucketName}/${image.Key}`;
    },

    // 表格选择改变后，相关方法
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // handleCollectionSelect(selectedCollection) {
    //   fields = getMongoFields(selectedCollection)
    //   console.log(fields)
    // },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.search(this.selectedCollection, this.filters, this.searchData.metadata.limit*(parseInt(val,10)-1))
      },
    search(selectedCollection, filters, offset) {
      const mongo_query = {}; // 查询对象
      console.log(filters);
      console.log(selectedCollection);
      for (const filter of filters) {
        if (filter.value !== undefined && filter.value !== "") {
          // 如果该字段有值
          console.log(filter.value);
          switch (filter.class) {
            case "date-range": // 日期范围选择器
              const [start, end] = filter.value;
              if (start) {
                mongo_query[filter.prop] = {
                  ...mongo_query[filter.prop],
                  $gte: start.toISOString(),
                };
              }
              if (end) {
                mongo_query[filter.prop] = {
                  ...mongo_query[filter.prop],
                  $lte: end.toISOString(),
                };
              }
              break;
            case "select": // 下拉框
            case "text": // 文本框
              // 用 text 而非 正则
              // mongo_query[filter.prop] = {
              //   $regex: filter.value,
              //   $options: 'i', // 忽略大小写
              // };

              //  $text: { $search: "your search query" }
              mongo_query["$text"] = {
                $search: filter.value,
              };
              break;
            case "number-range": // 数字范围输入框
              const [min, max] = filter.value.map(Number);
              if (!isNaN(min)) {
                mongo_query[filter.prop] = {
                  ...mongo_query[filter.prop],
                  $gte: min,
                };
              }
              if (!isNaN(max)) {
                mongo_query[filter.prop] = {
                  ...mongo_query[filter.prop],
                  $lte: max,
                };
              }
              break;
            default:
              // 未知类型，忽略
              break;
          }
        }
      }
      console.log(mongo_query);
      getMongoSearch(selectedCollection, mongo_query,offset).then((results) => {
        console.log(results);
        this.searchData = results.data;
      });
    },
  },
  created() {
    // 初始化数据库选择
    getMongoCollection().then((results) => {
      const collections = results.data.collections;
      this.avaliableCollection = collections;
      this.selectedCollection = [
        collections[0].value,
        collections[0].children[0].value,
      ];
    });
    getMongoFields().then((results) => {
      const apiFields = results.data.fields;
      // 将API中的属性列表转换为组件的过滤器列表
      const vueFields = apiFields.map((filter) => ({
        prop: filter.prop,
        label: filter.label,
        class: filter.class,
      }));
      this.filters = vueFields;

      // 将API中的属性列表转换为组件的表格列显示列表
      const vueColumnsDisplay = apiFields.map((filter) => ({
        prop: filter.prop,
        label: filter.label,
        type: filter.type,
        width: this.colomnsDisplay[filter.prop]?.width, // 使用可选链运算符获取宽度属性
        sortable: this.colomnsDisplay[filter.prop]?.sortable || false, // 使用逻辑或运算符设置默认值
      }));
      this.totalColumns = vueColumnsDisplay;
      this.visibleFilters = ["Datetime", "Proton_Aimed_Energy", "ShotNumber"];
      this.visibleColumns = [
        "Datetime",
        "Proton_Aimed_Energy",
        "Comment",
        "ShotNumber",
      ];
      console.log(this.totalColumns);
    });
  },
};
</script>

<style lang="scss" scoped>

.pagination-container {
  background: #fff;
  padding: 10px 20px;
}
.pagination-container.hidden {
  display: none;
}

.selectdiv {
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  // float: left;
  // position: relative; /* 子元素基于该元素进行定位 */
  // display: flex
}

.el-col {
  border: 1px solid transparent;
}

.filter-row {
  display: inline-block;
  // align-items: left;
  white-space: nowrap;
  // margin: 5px auto;
  // padding-top: 15px;
  // margin-top: 10px; /* 上方间距 */
  margin-bottom: 10px;
  /* 下方间距 */
}

.imgContainer {
  width: 300px;
  margin: 0 auto;
}

img {
  border-style: none;
  width: 100% !important;
  height: 100%;
  // aspect-ratio: 1/1;
}

.searchGroup {
  // display: block; /* 将 span 元素设置为块级元素 */
  // position: absolute;
  // bottom: 0; /* 与底部对齐 */
  // right: 0; /* 与右侧对齐 */
  // margin-bottom: 8px; /* 底部偏移量 */
  // margin-right: 10px; /* 右侧偏移量 */
  float: right;
  /* 将 span 元素向右浮动 */
}

.textInput {
  width: auto;
}

.p-center {
  text-align: center;
  font-weight: bold;
}
.simpletext {
  margin-left: 15px;
  margin-right: 5px;
}
</style>
