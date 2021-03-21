<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮件地址" prop="email"></el-table-column>
        <el-table-column label="手机号码" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="updateUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 权限按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlerCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 25, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 添加用户表单 -->
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="登录用户" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮件地址" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 添加用户表单 -->
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="登录用户">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮件地址" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <!-- 分配角色对话框 -->
    <el-dialog title="角色分配" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <p>当前的用户：{{ userInfo.username }}</p>
      <p>当前的角色：{{ userInfo.roleName }}</p>
      <p>
        分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择..." size="mini">
          <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 自定义校验规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮件地址'))
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      // 请求参数
      queryInfo: {
        query: '',
        page: 1,
        pageSize: 5
      },
      total: 0,
      userList: [],
      // 是否弹出添加用户对话框
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
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
        ],
        email: [
          { required: true, message: '请输入邮件地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 是否弹出编辑用户对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮件地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 是否弹出角色分配对话框
      setRoleDialogVisible: false,
      userInfo: {
        username: '',
        roleName: ''
      },
      roleList: [],
      // 选中的角色ID
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 监听 page
    handlerCurrentChange(curPage) {
      this.queryInfo.page = curPage
      console.log(this.queryInfo.page)
      this.getUserList()
    },
    // 监听 pageSize
    handleSizeChange(curPageSize) {
      this.queryInfo.pageSize = curPageSize
      console.log(this.queryInfo.pageSize)
      this.getUserList()
    },
    // 获取用户列表
    async getUserList() {
      console.log(this.queryInfo)
      const { data: res } = await this.axios.get('/mocks/users.json')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.total = res.data.total
      this.userList = res.data.userList
    },
    // 更新用户状态
    updateUserState(user) {
      console.log(user)
      // TODO 发起请求
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return null
        console.log(this.addForm)
        // TODO 发起请求
        // this.addDialogVisible = false
        // await this.getUserList()
      })
    },
    // 编辑用户
    editUser() {
      console.log(this.editForm)
      // TODO 发起请求
      this.editDialogVisible = false
    },
    // 删除用户
    async deleteUser(id) {
      // 弹提示确认框
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      console.log(id, confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('删除操作已取消')
      // TODO 发起请求
    },
    // 监听 addDialog 关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听 editDialog 点击事件
    async editDialog(id) {
      const { data: res } = await this.axios.get(`/mocks/${id}.json`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听 editDialog 关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听 setRoleDialog 点击事件
    async setRoleDialog(user) {
      this.userInfo = user

      const { data: res } = await this.axios.get('/mocks/roles.json')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 分配角色
    setRole() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
      console.log(`userId: ${this.userInfo.id} roleId: ${this.selectedRoleId}`)
      // TODO 发起请求
      // this.getUserList()
      // this.setRoleDialogVisible = false
    },
    // 监听 setRoleDialog 关闭事件
    setRoleDialogClosed() {
      this.userInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped></style>
