<template>
 <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="#">订单管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card  class="margin-top" shadow="always">
        <!-- 搜索 -->
        <el-row>
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getOrderList">
                <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
              </el-input>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table :data="orderList" style="width: 100%" size="mini" class="margin-top margin-bottom" stripe border>
            <el-table-column label="#" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="订单编号" prop="order_number" align="center"></el-table-column>
            <el-table-column label="订单价格" prop="order_price" width="180" align="center"></el-table-column>
            <el-table-column label="是否付款" prop="order_pay" width="180" align="center">
                <template v-slot="scope">
                    <el-tag type="danger"  size="mini" v-if="scope.row.order_pay==='0'">未付款</el-tag>
                    <el-tag type="success" size="mini" v-if="scope.row.order_pay==='1'">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send" width="180" align="center"></el-table-column>
            <el-table-column label="下单时间" width="180" align="center">
                <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
                <template>
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick"></el-button>
                    <el-tooltip effect="dark" content="物流信息" placement="top" :enterable="false">
                        <el-button size="mini" type="warning" icon="el-icon-location"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pagenum"
            :page-sizes="[5,10,20,30]"
            :page-size="queryParams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
        title="修改地址"
        :visible.sync="locaDialogVisible"
        width="50%"
        @close="locaDialogClose">
        <el-form ref="editLocationRef" :model="editLocationForm" label-width="100px" :rules="editLocationRules">
            <el-form-item label="省市区/县" prop="area">
                <el-cascader
                    v-model="editLocationForm.area"
                    :options="cityData"
                    :props="cascaderProps"
                    @change="handleCityChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailArea">
              <el-input v-model="editLocationForm.detailArea"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="locaDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="locaDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
 </div>
</template>

<script>
import cityData from './citydata'
export default {
  data: function() {
    return {
      orderList: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      locaDialogVisible: false, // 修改地址对话框显示与隐藏
      cityData: cityData, // 级联选择器中城市数据
      editLocationForm: { // 修改地址表单
        area: [],
        detailArea: ''
      },
      cascaderProps: { // 指定级联选择器的具体配置对象
        value: 'value',
        label: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      editLocationRules: { // 编辑表单验证规则
        area: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        detailArea: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const res = await this.$http.get('orders', { params: this.queryParams })
      if (res.data.meta.status === 200) {
        this.orderList = res.data.data.goods
        this.total = res.data.data.total
      } else {
        this.$message.error('获取订单列表失败')
      }
    },
    // 监听pagesize
    handleSizeChange(curPageSize) {
      this.queryParams.pagesize = curPageSize
      this.getOrderList()
    },
    // 监听pagenum
    handleCurrentChange(curPageNum) {
      this.queryParams.pagenum = curPageNum
      this.getOrderList()
    },
    // 点击修改地址
    editClick() {
      this.locaDialogVisible = true
    },
    handleCityChange() {
      console.log(this.editLocationForm.area)
    },
    // 关闭对话框
    locaDialogClose() {
      this.$refs.editLocationRef.resetFields()
    }
  }
}
</script>
