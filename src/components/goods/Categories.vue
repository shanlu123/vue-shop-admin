<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card" shadow="always">
      <!-- 添加分类 -->
      <el-button class="btn-add" type="primary">添加分类</el-button>
      <!-- 表格 -->
      <tree-table
      index-text="#"
      :data="categoriesList"
      :columns="columns"
      stripe
      border
      show-row-hover
      show-index
      tree-type
      is-fold
      :expand-type="false"
      :selection-type="false"
      class="table"
      >
      <template v-slot:isuse="scope">  <!-- <template #isuse="scope"> 这两种方式都可以将两个属性写一起-->
        <i v-if="!scope.row.cat_deleted" style="color:green"  class="el-icon-success"></i>
        <i v-if="scope.row.cat_deleted"  style="color:red"  class="el-icon-error" ></i>
      </template>
      <template slot="level" scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
      </template>
      <template slot="operate">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
      </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pagenum"
            :page-sizes="[5,10,20,30]"
            :page-size="queryParams.pagesize"
            :total ="total"
            layout="total,sizes, prev, pager, next, jumper"
            >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      categoriesList: [], // 商品分类列表
      queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [{ // 定义属性表格的列
        label: '分类名称',
        prop: 'cat_name',
        width: '280px',
        align: 'left',
        headerAlign: 'center'
      }, {
        label: '是否有效',
        width: '280px',
        align: 'center',
        headerAlign: 'center',
        type: 'template', // 表示将当前列作为模板列
        template: 'isuse' // 表示当前列模板名称
      }, {
        label: '排序',
        prop: 'cat_level',
        width: '280px',
        align: 'center',
        headerAlign: 'center',
        type: 'template',
        template: 'level'
      }, {
        label: '操作',
        align: 'center',
        headerAlign: 'center',
        type: 'template',
        template: 'operate'
      }]
    }
  },
  created() {
    this.getCategoriesList()
  },
  methods: {
    // 获取分类列表
    async getCategoriesList() {
      const res = await this.$http.get('categories', { params: this.queryParams })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取分类列表失败,' + res.data.meta.msg)
      }
      this.categoriesList = res.data.data.result
      this.total = res.data.data.total
    },
    // 监听pagesize改变
    handleSizeChange(curPageSize) {
      this.queryParams.pagesize = curPageSize
      this.getCategoriesList()
    },
    // 监听pagenum 改变
    handleCurrentChange(curPageNum) {
      this.queryParams.pagenum = curPageNum
      this.getCategoriesList()
    }
  }
}
</script>
<style scoped>
.box-card {
  margin-top: 20px;
  padding: 0;
}
.btn-add {
  margin-bottom: 20px;
}
  .table {
    margin-bottom: 20px;
  }
</style>
