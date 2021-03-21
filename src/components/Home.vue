<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>运维管理系统</span>
      </div>
      <el-button type="info" @click="logout">退 出</el-button>
    </el-header>

    <!-- 中心区域 -->
    <el-container>
      <!-- 左侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i :class="menuIconObj[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="child.path" v-for="child in menu.children" :key="child.id" @click="saveNavState(child.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ child.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 折叠状态
      isCollapse: false,
      // 菜单列表
      menuList: [],
      // 菜单图标
      menuIconObj: {
        1: 'el-icon-discover',
        2: 'el-icon-s-platform',
        3: 'el-icon-folder',
        4: 'el-icon-setting'
      },
      // 激活路径
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.axios.get('/mocks/menus.json')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 左侧边栏折叠事件
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 左侧菜单激活事件
    saveNavState(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    },
    // 退出登录
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    span {
      margin-left: 15px;
    }
  }
}

.toggle-button {
  background-color: #4a5064;
  line-height: 24px;
  font-size: 10px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
