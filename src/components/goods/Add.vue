<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="margin-top" shadow="always">
        <!-- 提示文本 -->
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
        <!-- 步骤条 -->
        <el-steps :active="activeProgress*1" align-center finish-status="success" class="margin-top margin-bottom">
             <el-step title="基本信息"></el-step>
             <el-step title="商品参数"></el-step>
             <el-step title="商品属性"></el-step>
             <el-step title="商品图片"></el-step>
             <el-step title="商品内容"></el-step>
             <el-step title="完成"></el-step>
        </el-steps>
        <!-- tab区域 -->
        <el-tabs tab-position="left" v-model="activeProgress"  :before-leave="beforeTabLeave" @tab-click="tabClick">
            <el-tab-pane label="基本信息" name="0">
                <!-- 基本信息表单 -->
                <el-form label-position="top" size="small" label-width="80px"
                  :model="baseInfoForm" :rules="baseInfoFormRules" ref="addFormRef">
                    <el-form-item label="商品名称" prop="goods_name">
                      <el-input v-model="baseInfoForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                      <el-input v-model="baseInfoForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                      <el-input v-model="baseInfoForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                      <el-input v-model="baseInfoForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                      <el-cascader
                          v-model="baseInfoForm.goods_cat"
                          :options="goodCatList"
                          :props="cascaderProps"
                          @change="goodCatChange">
                      </el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!-- 商品参数表单 -->
              <el-form label-position="top" size="small" label-width="80px">
                <el-form-item v-for="item in paramsList" :key="item.attr_id" :label="item.attr_name" >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox v-for="(attrVal,index) in item.attr_vals" :key="index" :label="attrVal" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
            <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
            <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      activeProgress: 0, // 当前步骤
      baseInfoForm: { // 基本信息表单数据
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: ''
      },
      baseInfoFormRules: { // 基本信息表单验证规则
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      goodCatList: [], // 基本信息中选择添加商品的分类
      cascaderProps: { // 基本信息中级联选择器
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      isValid: false, // 添加表单预校验是否通过
      paramsList: [] // 商品参数列表
    }
  },
  created() {
    this.getGoodCatList()
  },
  methods: {
    // 获取分类数据列表
    async getGoodCatList() {
      const res = await this.$http.get('categories')
      if (res.data.meta.status === 200) {
        this.goodCatList = res.data.data
      } else {
        this.$message.error('获取分类列表失败,' + res.data.meta.msg)
      }
    },
    // 监听级联选择器中选择分类
    goodCatChange() {
      // console.log(this.baseInfoForm.goods_cat)
      this.validateForm()
      if (this.isValid) {
        this.activeProgress = '1'
        this.getParamsList()
      } else {
        this.activeProgress = '0'
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0') {
        this.validateForm()
        // console.log(this.isValid)
        if (!this.isValid) {
          this.$message.error('请完善基本信息')
          return false
        }
      }
    },
    // 表单验证
    validateForm() {
      this.$refs.addFormRef.validate(valid => {
        this.isValid = valid
      })
    },
    // 获取商品参数面板信息
    async getParamsList() {
      const selectCatId = this.baseInfoForm.goods_cat[this.baseInfoForm.goods_cat.length - 1]
      const res = await this.$http.get(`categories/${selectCatId}/attributes`, { params: { sel: 'many' } })
      if (res.data.meta.status === 200) {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].attr_vals = res.data.data[i].attr_vals ? res.data.data[i].attr_vals.split(',') : []
        }
        this.paramsList = res.data.data
      } else {
        this.$message.error('获取参数列表失败,' + res.data.meta.msg)
      }
    },
    // tab切换
    tabClick() {
      if (this.activeProgress === '1') {
        this.getParamsList()
      }
    }
  }
}
</script>
