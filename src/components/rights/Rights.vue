<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card" shadow="always">
      <!-- 表格 -->
      <el-table
        :data="rightsList"
        stripe
        style="width: 100%"
        border
        size="small"
      >
        <el-table-column type="index" label="#" width="100" align="center"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="400" align="center">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="400" align="center">
        </el-table-column>
        <el-table-column label="权限等级" align="center">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const res = await this.$http.get('rights/list')
      if (res.data.meta.status === 200) {
        this.rightsList = res.data.data
        this.total = res.data.data.length
      } else {
        this.$http.error('获取权限列表失败:', res.data.meta.msg)
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
</style>
