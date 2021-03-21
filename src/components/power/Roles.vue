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
                <el-tag type="primary" closable @close="deleteRightsById(scope.row, role.id)">{{ role.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二、三级权限 -->
              <el-col :span="19">
                <el-row :class="[i === 0 ? '' : 'bdtop']" v-for="(child, i) in role.children" :key="child.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRightsById(scope.row, child.id)">{{ child.authName }} </el-tag>
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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRightsDialog(scope.row)">分配权限 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限对话框 -->
      <el-dialog title="权限分配" :visible.sync="setRightsDialogVisible" width="50%" @close="setRightsDialogClosed">
        <el-tree
          ref="treeRef"
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      roleList: [],
      setRightsDialogVisible: false,
      rightsList: [],
      // 树形空间绑定属性
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 当前的角色ID
      roleId: 0,
      // 角色已有权限ID列表
      defKeys: [1, 2, 2011, 4021]
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
    async deleteRightsById(role, id) {
      console.log(`roleId: ${role.id} rightsId: ${id}`)
      // 发起请求
      // role.children = res.data
    },
    // 监听分配权限按钮
    async setRightsDialog(role) {
      this.roleId = role.id
      // 获取权限列表
      const { data: res } = await this.axios.get('/mocks/rights_tree.json')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 递归获取角色三级权限ID
    getLeafKeys(node, arr) {
      // 如果是三级权限就保存权限ID, 三级权限中没有 children 字段
      if (!node.children) {
        return arr.push(node.id)
      }
      // 否则继续遍历寻找三级权限
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys)
      console.log(keys.join(','))
      // TODO 发起请求
      // await this.getRoleList()
      // this.setRightsDialogVisible = false
    },
    // 监听 setRightsDialog 关闭事件
    setRightsDialogClosed() {
      this.defKeys = []
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
