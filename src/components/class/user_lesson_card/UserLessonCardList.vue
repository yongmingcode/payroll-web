<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户课卡管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片试图区域-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加用户课卡</el-button>
        </el-col>
      </el-row>

      <!--用户课卡列表区域-->
      <el-table :data="userLessonCardList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="课卡编号" prop="lessonCardCode" align="center"></el-table-column>
        <el-table-column label="用户名称" prop="userName" align="center"></el-table-column> 
        <el-table-column label="课程类型"  align="center">
           <template slot-scope="scope">
            {{scope.row.lessonType == 1 ? "成人集体课卡" : (scope.row.lessonType == 2 ? "少儿集体课卡" : (scope.row.lessonType == 3 ? "vip小课卡" : ""))}}
          </template>
        </el-table-column> 
        
        <el-table-column label="开始时间" prop="startTime"  align="center"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"  align="center"></el-table-column>
        <el-table-column label="课时总数" prop="lessonsAll" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column> 

        <el-table-column label="操作" width="185px" align="center">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
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
        :page-sizes="[10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--添加用户课卡-->
      <el-dialog
        title="添加用户课卡"
        :visible.sync="addDialogVisible"
        width="50%">
        <!--内容主题区-->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="请选择用户" prop="name" label-width="100px">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="课程类型" prop="gender" label-width="100px">
            <el-select v-model="addForm.gender" placeholder="请选择">
              <el-option v-for="item in user_gender" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="开始时间" prop="wechatCode" label-width="100px">
            <el-input v-model="addForm.wechatCode"></el-input>
          </el-form-item>
          <el-form-item label="结束时间" prop="phone" label-width="100px">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="课时总数" prop="groupLessonAll" label-width="100px">
            <el-input v-model="addForm.groupLessonAll"></el-input>
          </el-form-item> 
        </el-form>
        
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser(addForm)">确 定</el-button>
          </span>
      </el-dialog>

      <!--修改 用户课卡信息对话框-->
      <el-dialog title="修改用户课卡信息" :visible.sync="editDialogVisible" width="40%"
      @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm"  label-width="70px" >
          <el-form-item label="名称" prop="name" label-width="100px">
            <el-input v-model="editForm.name"></el-input>
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
            <el-input v-model="editForm.wechatCode"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" label-width="100px">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="大课课时总数" prop="groupLessonAll" label-width="100px">
            <el-input v-model="editForm.groupLessonAll"></el-input>
          </el-form-item>
          <el-form-item label="vip小课总课数" prop="vipLessonAll" label-width="100px">
            <el-input v-model="editForm.vipLessonAll"></el-input>
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
          // query: '',
          pageId: 1,
          pageSize: 10
        },
        userLessonCardList: [],
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
          groupLessonAll: '',
          vipLessonAll: ''
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
      this.getUserLessonCardList()
    },
    methods: {
      async getUserLessonCardList() {
        const {data: res} = await this.$http.get('yl/lessonCardRecord/getUserLessonCardList', {
          params: this.queryInfo
        })
        if (res.code !== 0) return this.$message.error('获取用户会员卡信息失败！')
        this.userLessonCardList = res.data.data
        this.total = res.data.totalCount
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserLessonCardList()
      },
      // 监听 页码值 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pageId = newPage
        this.getUserLessonCardList()
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
            groupLessonAll: addForm.groupLessonAll,
            vipLessonAll: addForm.vipLessonAll
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.addDialogVisible = false
          this.$message.success('添加成功！')
          // 重新获取课堂记录信息
          this.getUserLessonCardList()
        })
       },

      // 展示编辑课堂记录的对话框
      async showEditDialog(row) {
        console.log(row)
        this.editForm = row
        this.editDialogVisible = true
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        // resetFields()重置表单的函数
        this.$refs.editFormRef.resetFields()
      },

       // 修改用户信息并提交
      editClassRecordInfo(editForm) {
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
            groupLessonAll: editForm.groupLessonAll,
            vipLessonAll: editForm.vipLessonAll
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.editDialogVisible = false
          this.getUserLessonCardList()
          this.$message.success('修改成功！')
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
