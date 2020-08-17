<template>
  <div class="bg-login">
    <div class="login_form">
      <el-form label-width="60px">
        <el-form-item label="用户名">
          <el-input prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" plain>登录</el-button>
          <el-button type="primary" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.bg-login {
  background-image: url("../assets/images/bg.jpg");
  width: 100%;
  height: 100%;
}
.login_form {
  width: 40%;
  position: absolute;
  top: 30%;
  left: 30%;
  padding: 50px 20px;
  background-color: #ccc;
  opacity: 0.5;
}
.btns {
  float:right;
}
</style>
