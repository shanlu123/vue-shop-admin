<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="#">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="always" class="margin-top">
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"></el-col>
        <el-button type="primary" @click="toAddGood">添加商品</el-button>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" style="width: 100%" size="mini" stripe border class="margin-top">
        <el-table-column label="#" type="index" align="center" width="80"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" align="center" width="180"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" align="center" width="180"></el-table-column>
        <el-table-column label="创建时间" align="center" width="180">
            <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary"></el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="delGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[5,10,20,40,80]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="margin-top margin-bottom"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      goodsList: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const res = await this.$http.get('goods', { params: this.queryParams })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取商品列表失败,' + res.data.meta.msg)
      }
      this.goodsList = res.data.data.goods
      this.total = res.data.data.total
    },
    // 监听pagesize
    handleSizeChange(curPageSize) {
      this.queryParams.pagesize = curPageSize
      this.getGoodsList()
    },
    // 监听pagenum
    handleCurrentChange(curPageNum) {
      this.queryParams.pagenum = curPageNum
      this.getGoodsList()
    },
    // 删除商品
    async delGood(goodId) {
      const confirmRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes === 'cancel') return this.$message.info('已取消删除')
      const res = await this.$http.delete(`goods/${goodId}`)
      if (res.data.meta.status === 200) {
        this.$message.success('删除成功')
        this.getGoodsList()
      } else {
        this.$message.error('删除失败,' + res.data.meta.msg)
      }
    },
    // 跳转到添加商品页面
    toAddGood() {
      this.$router.push('/home/goods/add')
    }
  }
}
</script>
