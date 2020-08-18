<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="10">
          <div class="grid-content">
            <el-row>
              <el-col :span="6">
                <div class="grid-content">
                  <img
                    src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                    alt="logo"
                  />
                </div>
              </el-col>
              <el-col :span="18">
                <div class="grid-content">
                  <p class="title">后台管理系统</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content">
            <el-button @click="loginout">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-button" @click="handleCollapse">
          <span :class="isCollapse? 'el-icon-s-unfold' : 'el-icon-s-fold' "></span>
        </div>
        <el-menu background-color="#d3dce6" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="menu.id.toString()" v-for="(menu, index) in menuList" :key="index">
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item-group v-for="(item, index) in menu.children" :key="index">
              <el-menu-item :index="item.path">
                <span>{{ item.authName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('/login') // 跳转到登录页
    },
    // 获取左侧菜单列表
    async getMenuList() {
      const res = await this.$http.get('menus')
      if (res.data.meta.status === 200) {
        this.menuList = res.data.data
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 侧边栏展开或折叠
    handleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style scoped>
.el-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.grid-content {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.title {
  width: 100%;
  height: 100%;
  font-size: 20px;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #8db6cd;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  opacity: 0.2;
  color: black;
  font-size: 28px;
}
</style>
