<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card" shadow="always">
      <el-button class="btn-add" type="primary">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="rolesList" stripe border style="width:100%" size="small">
        <el-table-column width="100" align="center" type="expand">
          <template v-slot="scope">
            <el-row v-for="firstItem in scope.row.children" :key="firstItem.id" class="border-bottom center-in-col">
                <!-- 一级权限 -->
                <el-col :span="6">
                   <el-tag closable type="primary">{{firstItem.authName}}</el-tag>
                </el-col>
                <!-- 二级和三级权限 -->
                <el-col :span="18">
                   <el-row v-for="secondItem in firstItem.children" :key="secondItem.id" class="center-in-col">
                       <!-- 二级权限 -->
                       <el-col :span="6">
                          <el-tag type="success" closable>{{ secondItem.authName}}</el-tag>
                       </el-col>
                       <!-- 三级权限 -->
                       <el-col :span="18">
                           <el-tag  type="warning" v-for="thirdItem in secondItem.children" :key="thirdItem.id" closable>
                               {{thirdItem.authName}}
                           </el-tag>
                       </el-col>
                   </el-row>
                </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="300"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button type="warning" size="mini" icon="el-icon-setting"
              >分配角色</el-button
            >
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
      rolesList: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const res = await this.$http.get('roles')
      if (res.data.meta.status !== 200) return this.$message.error('获取权限列表失败:', +res.data.meta.msg)
      this.rolesList = res.data.data
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
.el-tag{
    margin:5px;
}
.border-bottom{
    padding:20px 0;
    border-bottom:1px solid #eee;
}
.center-in-col{
    display: flex;
    align-items: center;
}
</style>
