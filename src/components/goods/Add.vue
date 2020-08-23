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
        <el-tabs tab-position="left" style="height: 200px;" v-model="activeProgress">
            <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
            <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
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
      activeProgress: 0
    }
  },
  methods: {
  }
}
</script>
