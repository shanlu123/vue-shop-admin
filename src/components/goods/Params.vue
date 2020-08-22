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
            <el-button class="margin-bottom" size="mini" type="primary" :disabled="!selectCatId" @click="addClick">添加参数</el-button>
             <!-- 动态参数表格 -->
            <el-table :data="dynamicParams" style="width: 100%" size="mini" stripe border>
               <el-table-column  type="expand" width="100" align="center"></el-table-column>
               <el-table-column label="#" type="index" width="280" align="center"></el-table-column>
               <el-table-column prop="attr_name" label="参数名称" width="280" align="center">
               </el-table-column>
               <el-table-column label="操作" align="center">
                 <template v-slot="scope">
                     <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick(scope.row.attr_id)">修改</el-button>
                     <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                 </template>
               </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
            <!-- 添加属性 -->
            <el-button class="margin-bottom" size="mini" type="primary" :disabled="!selectCatId" @click="addClick">添加属性</el-button>
            <!-- 静态属性表格 -->
            <el-table :data="staticAttrs" style="width: 100%" size="mini" stripe border>
                <el-table-column  type="expand" width="100" align="center"></el-table-column>
                <el-table-column label="#" type="index" width="280" align="center"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="280" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template v-slot="scope">
                      <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick(scope.row.attr_id)">修改</el-button>
                      <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
     </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加'+DialogTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="DialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
       </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改'+DialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="DialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
       </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
      staticAttrs: [], // 静态属性
      addDialogVisible: false, // 添加对话框显示与隐藏
      editDialogVisible: false, // 修改对话框的显示与隐藏
      addForm: { // 添加表单数据
        attr_name: ''
      },
      editForm: {}, // 编辑表单数据
      FormRules: { // 表单验证规则
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      curAttrId: '' // 当前要修改的属性id
    }
  },
  computed: {
    // 选择的分类id
    selectCatId() {
      if (this.selectKeys.length > 0) {
        return this.selectKeys[this.selectKeys.length - 1] // 最后一个分类的id就是所选中的分类id
      }
      return null
    },
    // 对话框标题
    DialogTitle() {
      if (this.curTabName === 'many') return '动态参数'
      if (this.curTabName === 'only') return '静态属性'
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
    },
    // 点击添加按钮
    addClick() {
      this.addDialogVisible = true
    },
    // 点击修改按钮
    async editClick(attrId) {
      this.curAttrId = attrId
      const res = await this.$http.get(`categories/${this.selectCatId}/attributes/${attrId}`, { params: { attr_sel: this.curTabName } })
      if (res.data.meta.status === 200) {
        this.editForm = res.data.data
      } else {
        this.$message.error('查询所要修改的属性信息失败,' + res.data.meta.msg)
      }
      this.editDialogVisible = true
    },
    // 监听添加对话框关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听修改对话框关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加对话框中表单提交
    addDialogSubmit() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const postParams = {
          attr_name: this.addForm.attr_name,
          attr_sel: this.curTabName
        }
        const res = await this.$http.post(`categories/${this.selectCatId}/attributes`, postParams)
        if (res.data.meta.status === 201) {
          this.$message.success('添加成功')
          this.getTableData()
        } else {
          this.$message.error('添加失败,' + res.data.meta.msg)
        }
        this.addDialogVisible = false
      })
    },
    // 修改对话框中表单提交
    editDialogSubmit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const res = await this.$http.put(`categories/${this.selectCatId}/attributes/${this.curAttrId}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.editForm.attr_sel
        })
        if (res.data.meta.status === 200) {
          this.$message.success('修改成功')
          this.getTableData()
        } else {
          this.$message.error('修改失败,' + res.data.meta.msg)
        }
        this.editDialogVisible = false
      })
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
