<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入内容" v-model="queryInfo.userName" >
            <template slot="append">
              <el-button  icon="el-icon-search" @click="getUserList()"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <!-- <el-table-column label="#" type="index"></el-table-column> -->
        <el-table-column label="用户编号" prop="userCode" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="名称" prop="name"  align="center"></el-table-column>
        <el-table-column label="性别"  align="center">
           <template slot-scope="scope">
            {{scope.row.gender == 0 ? "女" : "男"}}
          </template>
        </el-table-column> 
        <el-table-column label="来源"  align="center">
          <template slot-scope="scope">
            {{scope.row.source == 1 ? "美团" : (scope.row.source == 2 ? "点评" : (scope.row.source == 3 ? "到店" : (scope.row.source == 4 ? "地推" : "")))}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="微信号" prop="wechatCode"  align="center"></el-table-column> -->
        <el-table-column label="手机号" prop="phone"  align="center"></el-table-column>
        <el-table-column label="成人/少儿/vip课余数" prop="auditGroupLessonNum" align="center">
          <template slot-scope="scope"> 
            {{scope.row.auditGroupLessonNum}}/{{scope.row.childGroupLessonNum}}/{{scope.row.vipLessonNum}}
           </template> 
        </el-table-column>
        <!-- <el-table-column label="少儿集体课数" prop="childGroupLessonNum" align="center"></el-table-column>
        <el-table-column label="vip小课数" prop="vipLessonNum" align="center"></el-table-column>  -->
        <el-table-column label="创建时间" prop="createTime" :formatter="dateTimeFormat" align="center"></el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!--删除按钮-->
            <!-- <el-button type="danger" icon="el-icon-delete" size="mini"></el-button> -->
            <!--分配角色按钮-->
            <!-- <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageId"
        :page-sizes="[10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--添加用户-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%">
        <!--内容主题区-->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="名称" prop="name" label-width="100px">
            <el-col :span="10">
              <el-input v-model="addForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="性别" prop="gender" label-width="100px">
            <el-select v-model="addForm.gender" placeholder="请选择">
              <el-option v-for="item in user_gender" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源" prop="source" label-width="100px" >
            <el-select v-model="addForm.source" placeholder="请选择">
              <el-option v-for="item in user_source" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="微信号" prop="wechatCode" label-width="100px">
            <el-col :span="10">
              <el-input v-model="addForm.wechatCode"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" label-width="100px">
            <el-col :span="10">
              <el-input v-model="addForm.phone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="是否有效" prop="isValid" label-width="100px"> 
              <template>
                <el-switch
                  v-model='addForm.isValid'
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"  
                   >
                </el-switch>
              </template> 
          </el-form-item>
        
          
        </el-form>
        
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser(addForm)">确 定</el-button>
          </span>
      </el-dialog>

      <!--修改 用户信息对话框-->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="40%"
      @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm"  label-width="70px" >
          <el-form-item label="名称" prop="name" label-width="100px">
            <el-col :span="13">
              <el-input v-model="editForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="性别" prop="gender" label-width="100px">
            <el-select v-model="editForm.gender" placeholder="请选择"> 
              <el-option v-for="item in user_gender" :key="item.value" :label="item.label" :value="item.value" ></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item label="来源" prop="source" label-width="100px" >
            <el-select v-model="editForm.source" placeholder="请选择">
              <el-option v-for="item in user_source" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="微信号" prop="wechatCode" label-width="100px">
            <el-col :span="13">
              <el-input v-model="editForm.wechatCode"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" label-width="100px">
            <el-col :span="13">
              <el-input v-model="editForm.phone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="是否有效" prop="isValid" label-width="100px"> 
              <template>
                <el-switch
                  v-model='editForm.isValid'
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0" 
                   >
                </el-switch>
              </template> 
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassRecordInfo(editForm)">确 定</el-button>
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
          userName: '',
          pageId: 1,
          pageSize: 10
        },
        userList: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          name: '',
          gender: 0,
          source: 2,
          wechatCode: '',
          phone: '',
          isValid: 1
        }, 
        // 查询到的课堂记录信息对象
        editForm: {},
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        user_source: [
          {value: 1, label: '美团'},
          {value: 2, label: '点评'},
          {value: 3, label: '到店'},
          {value: 4, label: '地推'}
        ], 
        user_gender: [
          {value: 0, label: '女'},
          {value: 1, label: '男'}
        ]
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        console.log(this.queryInfo)
        const {data: res} = await this.$http.get('yl/user/getUserList', {
          params: this.queryInfo
        })
        if (res.code !== 0) return this.$message.error('获取用户信息失败！')
        this.userList = res.data.data
        this.total = res.data.totalCount
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pageId = newPage
        this.getUserList()
      }, 
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 添加用户
      addUser(addForm) { 
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('yl/user/addUser', qs.stringify({
            name: addForm.name,
            gender: addForm.gender,
            source: addForm.source,
            wechatCode: addForm.wechatCode,
            phone: addForm.phone,
            isValid: addForm.isValid 
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.addDialogVisible = false
          this.$message.success('添加成功！')
          this.$refs.addFormRef.resetFields()
          // 重新获取课堂记录信息
          this.getUserList()
        })
       },
      // 日期时间格式化
      dateTimeFormat: function (row, column) {
        var date = row[column.property] 
        if (date === undefined || date == null) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 日期格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD')
      },
      // 展示编辑课堂记录的对话框
      async showEditDialog(row) { 
        this.editForm = row
        this.editDialogVisible = true
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        // resetFields()重置表单的函数
        // this.$refs.editFormRef.resetFields() // 加上该行，会造成列表数据展示错误
      },

       // 修改用户信息并提交
      editClassRecordInfo(editForm) {
        console.log(editForm)
        // 预校验
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          // 发起修改用户信息的数据请求
          const {data: res} = await this.$http.post('yl/user/updateUser', qs.stringify({
            id: editForm.id,
            name: editForm.name,
            gender: editForm.gender,
            source: editForm.source,
            wechatCode: editForm.wechatCode,
            phone: editForm.phone,
            isValid: editForm.isValid 
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('修改成功！')
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
