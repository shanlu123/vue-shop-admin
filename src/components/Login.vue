<template>
  <div class="bg-login">
    <div class="login_form">
      <el-form label-width="70px" :model="loginInfo" :rules="loginFormRules" ref="loginFormRef" >
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginInfo.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" plain @click="submit">登录</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginInfo: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginFormRef.resetFields()
    },
    submit () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post('login', this.loginInfo)
        if (res.data.meta.status === 200) {
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('登录失败')
        }
      })
    }
  }
}
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
  float: right;
}
</style>
