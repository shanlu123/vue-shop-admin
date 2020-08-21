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
      <el-button class="btn-add" type="primary" @click="addCate">添加分类</el-button>
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
    <!-- 添加分类对话框 -->
    <el-dialog
        title="添加分类"
        :visible.sync="addCateVisible"
        width="50%"
        @close="addCateClose">
        <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="addCateFormRules">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                 <el-cascader
                    v-model="selectKeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    @change="parentCateChange"
                    clearable>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addCateVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateSubmit">确 定</el-button>
        </span>
    </el-dialog>
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
      }],
      addCateVisible: false, // 添加分离对话框显示与隐藏
      addCateForm: { // 添加分类表单数据
        cat_name: '', // 分类名称
        cat_pid: 0, // 父级分类的id,一级分类的父级id是0
        cat_level: 0 // 分类层级，默认归为一级分类
      },
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: [], // 父级分类列表（级联选择中）
      cascaderProps: { // 指定级联选择器的具体配置对象
        value: 'cat_id', // 真正选中的值
        label: 'cat_name', // 看到的文本选项
        children: 'children', // 渲染子属性
        expandTrigger: 'hover',
        checkStrictly: true // 可以选择任意一级,解除父子节点互相关联
      },
      selectKeys: []// 选中的父级分类的id数组
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
    },
    // 点击添加分类
    async addCate() {
      const res = await this.$http('categories', { params: { type: 2 } })
      if (res.data.meta.status !== 200) return this.$http.error('获取父级分类列表失败,' + res.data.meta.msg)
      this.parentCateList = res.data.data
      this.addCateVisible = true
    },
    // 监听父级分类级联选择,组件添加分类提交参数
    parentCateChange() {
      // console.log(this.selectKeys)
      if (this.selectKeys.length === 0) { // 父级ID没有
        this.addCateForm.cat_level = 0 // 一级分类
        this.addCateForm.cat_pid = 0
      }
      if (this.selectKeys.length === 1) { // 父级ID有一个
        this.addCateForm.cat_level = 1 // 二级分类
        this.addCateForm.cat_pid = this.selectKeys[0]
      }
      if (this.selectKeys.length === 2) { // 父级ID 有两个
        this.addCateForm.cat_level = 2 // 三级分类
        this.addCateForm.cat_pid = this.selectKeys[1]
      }
    },
    // 添加分类提交
    addCateSubmit() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post('categories', this.addCateForm)
        if (res.data.meta.status === 201) {
          this.$message.success('添加分类成功')
          this.getCategoriesList()
        } else {
          this.$message.error('添加分类失败,' + res.data.meta.msg)
        }
        this.addCateVisible = false
      })
    },
    // 监听添加分类对话框关闭
    addCateClose() {
      this.$refs.addCateFormRef.resetFields() // 分类名称可以被清除
      // this.addCateForm = {}
      this.selectKeys = [] // 父级分类选项可以被selectKeys清除
    }
  }
}
</script>
<style>
.box-card {
  margin-top: 20px;
  padding: 0;
}
.btn-add {
  margin-bottom: 20px;
}
.table {
  margin-bottom: 20px;
  margin-top:20px;
}
/* 级联选择的高度 */
.el-cascader-panel {
    height:200px;
}
</style>
