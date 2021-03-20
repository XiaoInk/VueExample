<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i === 0 ? 'bdtop' : '']" v-for="(role, i) in scope.row.children" :key="role.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag type="primary">{{ role.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二、三级权限 -->
              <el-col :span="19">
                <el-row :class="[i === 0 ? '' : 'bdtop']" v-for="(child, i) in role.children" :key="child.id">
                  <el-col :span="6">
                    <el-tag type="success">{{ child.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item in child.children"
                      :key="item.id"
                      closable
                      @close="deleteRightsById(scope.row, item.id)"
                      >{{ item.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="285px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.axios.get('/mocks/roles.json')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    // 删除角色权限
    deleteRightsById(role, id) {
      console.log(`roleId: ${role.id} rightsId: ${id}`)
      // 发起请求
      // role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.el-row {
  display: flex;
  align-items: center;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
