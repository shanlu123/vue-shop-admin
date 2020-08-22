<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card" shadow="always">
      <!-- 黄色警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 级联选择器 -->
      <div class="margin-top margin-bottom">
        选择商品分类：
        <el-cascader
          v-model="selectKeys"
          :options="categoriesList"
          @change="handleChange"
          :props="cascaderProps"
          clearable
        ></el-cascader>
      </div>
      <!-- tab区 -->
      <el-tabs v-model="curTabName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
            <!-- 添加参数 -->
            <el-button class="margin-bottom" size="mini" type="primary" :disabled="!selectCatId">添加参数</el-button>
             <!-- 动态参数表格 -->
            <el-table :data="dynamicParams" style="width: 100%" size="mini" stripe border>
               <el-table-column  type="expand" width="100" align="center"></el-table-column>
               <el-table-column label="#" type="index" width="280" align="center"></el-table-column>
               <el-table-column prop="attr_name" label="参数名称" width="280" align="center">
               </el-table-column>
               <el-table-column label="操作" align="center">
                 <template>
                     <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
                     <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                 </template>
               </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
            <!-- 添加属性 -->
            <el-button class="margin-bottom" size="mini" type="primary" :disabled="!selectCatId">添加属性</el-button>
            <!-- 静态属性表格 -->
            <el-table :data="staticAttrs" style="width: 100%" size="mini" stripe border>
                <el-table-column  type="expand" width="100" align="center"></el-table-column>
                <el-table-column label="#" type="index" width="280" align="center"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="280" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template>
                      <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
                      <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
     </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      categoriesList: [],
      selectKeys: [],
      cascaderProps: { // 指定级联选择器的具体配置对象
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      curTabName: 'many', // 当前tab名
      dynamicParams: [], // 动态参数
      staticAttrs: [] // 静态属性
    }
  },
  computed: {
    selectCatId() { // 选择的分类id
      if (this.selectKeys.length > 0) {
        return this.selectKeys[this.selectKeys.length - 1] // 最后一个分类的id就是所选中的分类id
      }
      return null
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    // 获取分类列表（级联选择器中）
    async getCategoriesList() {
      const res = await this.$http.get('categories')
      if (res.data.meta.status === 200) {
        this.categoriesList = res.data.data
      } else {
        this.$message.error('获取分类列表失败,' + res.data.meta.msg)
      }
    },
    // 监听级联选项选择
    handleChange() {
      if (this.selectCatId) {
        this.getTableData()
      }
    },
    // Tab切换
    async tabClick(tab) {
      // console.log(tab)
      this.curTabName = tab.name
      if (this.selectCatId) {
        this.getTableData()
      }
    },
    // 获取表格数据
    async getTableData() {
      const res = await this.$http.get(`categories/${this.selectCatId}/attributes`, { params: { sel: this.curTabName } })
      if (this.curTabName === 'many') {
        if (res.data.meta.status !== 200) return this.$message.error('获取动态参数失败,' + res.data.meta.msg)
        this.dynamicParams = res.data.data
      } else if (this.curTabName === 'only') {
        if (res.data.meta.status !== 200) return this.$message.error('获取静态属性失败,' + res.data.meta.msg)
        this.staticAttrs = res.data.data
      }
    }
  }
}
</script>
<style scoped>
.box-card {
  margin-top: 20px;
  padding: 0;
}
.margin-top{
    margin-top:20px;
}
.margin-bottom{
    margin-bottom:20px;
}
</style>
