<template>
  <el-container>
    <div class="login-box">
      <!-- Logo -->
      <div class="login-logo"><img src="../assets/logo.png" alt="" /></div>

      <!-- 登录表单区域 -->
      <el-form class="login-form" ref="loginRef" :model="loginForm" :rules="loginFormRules">
        <!-- 登录用户 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginFormSubmit">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录用户', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '长度必须在5~20个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 25,
            message: '长度必须在6~25个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 表单提交
    loginFormSubmit() {
      this.$refs.loginRef.validate(async (valid) => {
        if (!valid) return null
        const { data: res } = await this.axios.get('/mocks/login.json')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 存储token
        window.sessionStorage.setItem('token', res.meta.token)
        // 路由跳转
        await this.$router.push('/home')
      })
    },
    // 表单重置
    loginFormReset() {
      this.$refs.loginRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  background-color: cadetblue;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .login-logo {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
