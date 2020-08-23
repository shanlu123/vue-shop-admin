<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="margin-top" shadow="always">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryParams.query"  clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addFormVisible= true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 添加用户弹出框 -->
      <el-dialog title="添加用户" :visible.sync="addFormVisible" width="30%" @close="addFormClose">
        <!-- 添加表单 -->
        <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
             <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
             <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
             <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
             <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户弹出框 -->
      <el-dialog title="编辑用户" :visible.sync="editFormVisible" width="30%" @close="editFormClose">
        <!-- 编辑表单 -->
        <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
          <el-form-item label="用户名" prop="username">
             <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
             <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
             <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="giveRoleVisible"
        width="50%"
        @close="giveRoleDialogClose">
          <el-form  label-width="100px">
             <el-form-item label="当前用户">
               <el-input :value="curUser.username" disabled></el-input>
             </el-form-item>
             <el-form-item label="当前角色">
               <el-input :value="curUser.role_name" disabled></el-input>
             </el-form-item>
             <el-form-item label="分配新角色">
               <el-select v-model="curSelectRoleId" placeholder="请选择">
                 <el-option v-for="role in curUserRoles" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
               </el-select>
             </el-form-item>
          </el-form>
          <span slot="footer">
           <el-button @click="giveRoleVisible = false">取 消</el-button>
           <el-button type="primary" @click="giveRoleSubmit">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 表格 -->
      <el-table :data="userList" stripe  style="width: 100%" border class="margin-top margin-bottom" size="mini" >
        <el-table-column align="center" type="index" label="#" width="50"></el-table-column>
        <el-table-column align="center" prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column align="center" prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column align="center" prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column align="center" prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column align="center" label="状态" width="180">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="mgStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" size="mini" icon="el-icon-setting" @click="giveRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[1, 2, 3, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) { // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      userList: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addFormVisible: false, // 添加用户弹出层是否显示
      addForm: { // 添加用户表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: { // 添加用户表单验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名的长度在2～10个字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 18, message: '用户密码的长度在6～18个字', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormVisible: false, // 编辑用户弹出层是否显示
      editForm: {}, // 编辑用户表单数据
      editFormRules: { // 编辑表单验证规则对象
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      giveRoleVisible: false, // 分配角色对话框的显示与隐藏
      curUser: {}, // 当前要分配角色的用户
      curUserRoles: [], // 当前要分配角色的用户的角色列表
      curSelectRoleId: '' // 当前要分配的新角色id
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const res = await this.$http.get('users', { params: this.queryParams })
      if (res.data.meta.status === 200) {
        this.userList = res.data.data.users
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 监听pageSize改变
    handleSizeChange(curPageSize) {
      // console.log(curPageSize)
      this.queryParams.pagesize = curPageSize
      this.getUserList()
    },
    // 监听当前页数pageNum改变
    handleCurrentChange(curPageNum) {
      // console.log(curPageNum)
      this.queryParams.pagenum = curPageNum
      this.getUserList()
    },
    // 用户状态开关切换
    async mgStateChange(curUserInfo) {
      // console.log(curUserInfo.mg_state)
      const res = await this.$http.put(`users/${curUserInfo.id}/state/${curUserInfo.mg_state}`)
      if (res.data.meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error('修改失败' + res.data.meta.msg)
      }
    },
    // 搜索
    search() {
      this.getUserList()
    },
    // 添加用户提交
    submit() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await this.$http.post('users', this.addForm)
        if (res.data.meta.status === 201) {
          this.$message.success('添加成功')
        } else {
          this.$message.error('添加失败')
        }
        this.addFormVisible = false
        this.getUserList() // 重新刷新用户列表
      })
    },
    // 添加用户对话框关闭
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑用户对话框关闭
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑(展示编辑对话框)
    async edit(id) {
      this.editFormVisible = true
      const res = await this.$http.get(`users/${id}`) // 根据ID获取该用户的信息
      this.editForm = res.data.data
    },
    // 编辑表单提交
    editSubmit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await this.$http.put(`users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        this.editFormVisible = false // 关闭对话框
        if (res.data.meta.status === 200) {
          this.$message.success('修改成功')
          this.getUserList()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 删除用户
    async delUser(id) {
      const delRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 捕获取消的报错
      // 用户点击确定，delRes为字符串"confirm"
      // 用户点击取消，delRes为字符串"cancel"
      if (delRes !== 'confirm') return this.$message.info('已取消删除')
      const res = await this.$http.delete(`users/${id}`)
      if (res.data.meta.status === 200) {
        this.$message.success('删除成功')
        this.getUserList()
      } else {
        this.$message.error('删除失败:' + res.data.meta.msg)
      }
    },
    // 点击分配角色
    async giveRole(curUser) {
      this.curUser = curUser
      const res = await this.$http.get('roles')
      if (res.data.meta.status === 200) {
        this.curUserRoles = res.data.data
      } else {
        this.$message.error('获取角色列表失败,' + res.data.meta.msg)
      }
      this.giveRoleVisible = true
    },
    // 分配角色表单提交
    async giveRoleSubmit() {
      if (this.curSelectRoleId === '') return this.$message.warning('请选择角色')
      const res = await this.$http.put(`users/${this.curUser.id}/role`, {
        rid: this.curSelectRoleId
      })
      if (res.data.meta.status === 200) {
        this.$message.success('分配角色成功')
        this.getUserList()
      } else {
        this.$message.error('分配角色失败,' + res.data.meta.msg)
      }
      this.giveRoleVisible = false
    },
    // 分配角色对话框关闭
    giveRoleDialogClose() {
      this.curSelectRoleId = ''
      this.curUser = ''
    }
  }
}
</script>
