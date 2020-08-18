<template>
  <el-button @click="loginout">退出登录</el-button>
</template>

<script>
export default {
  methods: {
    loginout() {
      window.sessionStorage.clear()
      this.$router.push('/login') // 跳转到登录页
    }
  }
}
</script>
