<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加管理员</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="managerList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="管理员ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="username"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="上次登陆时间" :formatter="dateFormat" prop="updateTime"></el-table-column>
        <el-table-column label="创建时间" :formatter="dateFormat" prop="createTime"></el-table-column>
        <el-table-column label="状态" prop="state">
          <template slot-scope="scope">
            <el-switch
              v-model='scope.row.state'
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0" @change="managerStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!--分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageId"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--添加管理员消息-->
      <el-dialog
        title="添加管理员"
        :visible.sync="addDialogVisible"
        width="50%">
        <!--内容主题区-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="账号" prop="account" label-width="100px">
            <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="100px">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码" prop="verifyPassword" label-width="100px">
            <el-input v-model="addForm.verifyPassword"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username" label-width="100px">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark" label-width="100px">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="状态(1-有效，0-无效)" prop="state" label-width="100px">
            <el-input v-model="addForm.state"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
          </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import qs from 'qs'

  export default {
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          // query: '',
          pageId: 1,
          pageSize: 1
        },
        managerList: [],
        total: 0,
        // 控制添加管理员对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          account: '',
          password: '',
          verifyPassword: '',
          username: '',
          remark: '',
          state: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 3, max: 15, message: '账号的长度在3~15个字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 3, max: 10, message: '密码的长度在3~10个字符之间', trigger: 'blur'}
          ],
          verifyPassword: [
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {min: 3, max: 10, message: '密码的长度在3~10个字符之间', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 15, message: '用户名的长度在3~10个字符之间', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入备注', trigger: 'blur'},
            {min: 3, max: 25, message: '用户名的长度在3~25个字符之间', trigger: 'blur'}
          ],
          state: [
            {required: true, message: '请输入状态', trigger: 'blur'},
            {min: 1, max: 1, message: '状态必须是1，或者0', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getManagerList()
    },
    methods: {
      async getManagerList() {
        const {data: res} = await this.$http.get('yl/manager/getmalagerlist', {
          params: this.queryInfo
        })
        if (res.code !== 0) return this.$message.error('获取管理员信息失败！')
        this.managerList = res.data.data
        this.total = res.data.totalCount
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getManagerList()
      },
      // 监听 页码值 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pageId = newPage
        this.getManagerList()
      },
      async managerStateChanged(managerInfo) {
        const {data: res} = await this.$http.post('yl/manager/updatemanagersate', qs.stringify({
          id: managerInfo.id,
          state: managerInfo.state
        }))
        if (res.code !== 0) {
          managerInfo.state = !managerInfo.state
          return this.$message.error('更新状态失败！')
        }
        this.$message.success('更新状态成功！')
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
