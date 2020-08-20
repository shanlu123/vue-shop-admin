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
        <!-- 展开列开始-->
        <el-table-column width="100" align="center" type="expand">
          <template v-slot="scope">
            <el-row v-for="firstItem in scope.row.children" :key="firstItem.id" class="border-bottom center-in-col">
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable type="primary" @close="delRight(scope.row, firstItem)" >{{ firstItem.authName }}</el-tag>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="18">
                <el-row v-for="secondItem in firstItem.children" :key="secondItem.id" class="center-in-col">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="delRight(scope.row, secondItem)" >{{ secondItem.authName }}</el-tag>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="thirdItem in secondItem.children" :key="thirdItem.id" closable @close="delRight(scope.row, thirdItem)" >
                      {{ thirdItem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 展开列结束-->
        <el-table-column width="100" align="center" type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="giveRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="giveRightVisible" width="40%" @close="rightsDialogClose">
        <el-tree
          :data="rightsList"
          show-checkbox
          default-expand-all
          :props="{ children: 'children', label: 'authName' }"
          node-key="id"
          :default-checked-keys="defaultKeys"
          ref="treeRef"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="giveRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="giveRightSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      rolesList: [],
      giveRightVisible: false, // 分配权限对话框显示与隐藏
      rightsList: [], // 所有权限列表
      defaultKeys: [], // 存储所有已有三级权限的id
      curRoleId: '' // 当前即将分配权限的id
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const res = await this.$http.get('roles')
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取权限列表失败:', +res.data.meta.msg)
      }
      this.rolesList = res.data.data
    },
    // 删除角色指定权限
    async delRight(role, right) {
      const confirmRes = await this.$confirm(
        `此操作将永久删除${role.roleName}的${right.authName}权限, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes === 'cancel') return this.$message.info('取消删除该权限')
      const res = await this.$http.delete(`roles/${role.id}/rights/${right.id}`)
      if (res.data.meta.status === 200) {
        this.$message.success('删除成功')
        // this.getRolesList() 这样会重新完整刷新数据，删除后展开列会自动闭合
        role.children = res.data.data // 文档中注明接口返回的data, 是当前角色下最新的权限数据，所以直接将接口返回的data更新到页面上
      } else {
        this.$message.error('删除失败  ', res.data.meta.msg)
      }
    },
    // 点击分配权限
    async giveRight(role) {
      this.curRoleId = role.id // 保存要分配权限的角色id
      const res = await this.$http.get('rights/tree')
      if (res.data.meta.status === 200) {
        this.rightsList = res.data.data
      } else {
        this.$http.error('获取权限列表失败')
      }
      this.getDefaultKeys(role) // 拿到所有已经拥有的三级权限id数组defautKeys[]
      this.giveRightVisible = true
    },
    // 获取所有需要默认选中的三级权限的递归函数
    getDefaultKeys(role) {
      if (role.children) {
        role.children.forEach(item => {
          this.getDefaultKeys(item)
        })
      } else {
        this.defaultKeys.push(role.id)
      }
    },
    // 分配权限对话框关闭
    rightsDialogClose() {
      this.defaultKeys = [] // 需要重新将默认选中的权限置空，否则defaultKeys[]中的id越来越多
    },
    // 分配权限对话框提交
    async giveRightSubmit() {
      const allSelectKeys = this.$refs.treeRef.getCheckedKeys() // 拿到所有全选的keys
      const halfSelectKeys = this.$refs.treeRef.getHalfCheckedKeys() // 拿到所有半选的keys
      // console.log(allSelectKeys)
      // console.log(halfSelectKeys)
      const allKeys = [...allSelectKeys, ...halfSelectKeys].join(',')
      // console.log(allKeys)
      const res = await this.$http.post(`roles/${this.curRoleId}/rights`, {
        rids: allKeys
      })
      if (res.data.meta.status === 200) {
        this.$message.success('分配权限成功')
        this.getRolesList()
      } else {
        this.$message.error('分配权限失败,' + res.data.meta.msg)
      }
      this.giveRightVisible = false
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
.el-tag {
  margin: 5px;
}
.border-bottom {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}
.center-in-col {
  display: flex;
  align-items: center;
}
</style>
