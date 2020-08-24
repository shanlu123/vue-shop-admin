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
                          @expand-change="goodCatChange">
                      </el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!-- 商品参数表单 -->
              <el-form label-position="top" size="small" label-width="80px">
                <el-form-item v-for="item in dynamicParams" :key="item.attr_id" :label="item.attr_name" >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox v-for="(attrVal,index) in item.attr_vals" :key="index" :label="attrVal" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form label-position="top" label-width="80px" size="mini" v-model="staticAttrs">
                <el-form-item v-for="item in staticAttrs" :key="item.attr_id" :label="item.attr_name">
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
                <el-upload
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture"
                    :headers="reqHeader"
                    :on-success="uploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器 -->
              <quill-editor v-model="baseInfoForm.goods_introduce"></quill-editor>
              <el-button type="primary" class="margin-bottom" @click="addGood">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewPicDialog"
      width="30%">
      <img :src="prePicUrl" style="width:100%;"/>
    </el-dialog>
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
        goods_cat: '',
        pics: [], // 上传的图片，对象数组
        goods_introduce: '',
        attrs: [] // 属性，包括静态属性和动态参数
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
      dynamicParams: [], // 商品动态参数列表
      staticAttrs: [], // 商品静态属性列表
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload', // 图片上传地址
      reqHeader: { // 手动设置图片上传请求头
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPicDialog: false, // 图片预览对话框显示与隐藏
      prePicUrl: '' // 当前预览的图片地址
    }
  },
  computed: {
    curSel() {
      if (this.activeProgress === '1') return 'many'
      if (this.activeProgress === '2') return 'only'
      return null
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
    // 获取商品动态参数/静态属性面板信息
    async getParamsList() {
      const selectCatId = this.baseInfoForm.goods_cat[this.baseInfoForm.goods_cat.length - 1]
      const res = await this.$http.get(`categories/${selectCatId}/attributes`, { params: { sel: this.curSel } })
      if (res.data.meta.status === 200) {
        if (this.curSel === 'many') { // 获取的是动态参数列表
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].attr_vals = res.data.data[i].attr_vals ? res.data.data[i].attr_vals.split(',') : []
          }
          this.dynamicParams = res.data.data
        } else { // 获取的是静态属性列表
          this.staticAttrs = res.data.data
        }
      } else {
        this.$message.error('获取动态参数/静态属性失败,' + res.data.meta.msg)
      }
    },
    // tab切换
    tabClick() {
      if (this.activeProgress === '1' || this.activeProgress === '2') {
        this.getParamsList()
      }
    },
    // 图片上传成功
    uploadSuccess(response) {
      const picObj = {
        pic: response.data.tmp_path
      }
      this.baseInfoForm.pics.push(picObj)
      this.$message.success('上传成功')
    },
    // 图片预览
    handlePreview(file) {
      this.prePicUrl = file.response.data.url
      this.previewPicDialog = true
    },
    // 图片删除
    handleRemove(file, fileList) {
      this.baseInfoForm.pics = this.baseInfoForm.pics.filter(item =>
        item.pic !== file.response.data.tmp_path
      )
      this.$message.success('删除成功')
    },
    // 添加商品
    async addGood() {
      // 处理goods_cat
      this.baseInfoForm.goods_cat = this.baseInfoForm.goods_cat.join(',')
      // 组建attrs
      const dynamicObjs = []
      const staticObjs = []
      for (let i = 0; i < this.dynamicParams.length; i++) {
        this.dynamicParams[i].attr_vals = this.dynamicParams[i].attr_vals.join(',')
        const dynamicObj = {
          attr_id: this.dynamicParams[i].attr_id,
          attr_value: this.dynamicParams[i].attr_vals
        }
        dynamicObjs.push(dynamicObj)
      }
      for (let i = 0; i < this.staticAttrs.length; i++) {
        const staticObj = {
          attr_id: this.staticAttrs[i].attr_id,
          attr_value: this.staticAttrs[i].attr_vals
        }
        staticObjs.push(staticObj)
      }
      this.baseInfoForm.attrs = [...dynamicObjs, ...staticObjs]
      // 发起请求
      const res = await this.$http.post('goods', this.baseInfoForm)
      if (res.data.meta.status !== 201) return this.$message.error('创建商品失败,' + res.data.meta.msg)
      this.$message.success('商品创建成功')
      this.$router.push('/home/goods')
    }
  }
}
</script>

<style>
.quill-editor {
  height:280px;
  margin-bottom:60px;
}
</style>
