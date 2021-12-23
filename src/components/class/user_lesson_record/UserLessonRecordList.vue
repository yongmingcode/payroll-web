<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户上课记录</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true">添加上课记录</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="用户名称" prop="userName" align="center"></el-table-column>
        <el-table-column label="上课时间" prop="attendClassStartTime" :formatter="dateTimeFormat"  align="center"></el-table-column>
        <el-table-column label="下课时间" prop="attendClassEndTime" :formatter="dateTimeFormat" align="center"></el-table-column>
        <el-table-column label="课时" prop="usedLessons"  align="center"></el-table-column>
        <el-table-column label="课程类型"  align="center">
          <template slot-scope="scope">
            {{scope.row.lessonType == 1 ? "成人集体" : (scope.row.lessonType == 2 ? "少儿集体" : (scope.row.lessonType == 3 ? "vip小课" : ""))}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" :formatter="dateTimeFormat" prop="createTime" align="center"></el-table-column>
        
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

      <!--添加用户上课记录-->
      <el-dialog
        title="添加上课记录"
        :visible.sync="addDialogVisible"
        width="50%">
        <!--内容主题区-->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="请选择用户" label-width="100px">
            <el-select v-model="addForm.userName" filterable remote :remote-method="addDialogClick"
             placeholder="请输入关键词" :loading="loading">
              <el-option v-for="item in userinfo_list" :key="item.id" :label="item.name"
              :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间" prop="attendClassStartTime" label-width="100px">
           <el-date-picker v-model="addForm.attendClassStartTime" type="datetime" placeholder="选择日期"></el-date-picker> 
          </el-form-item>
          <el-form-item label="下课时间" prop="attendClassEndTime" label-width="100px" >
           <el-date-picker v-model="addForm.attendClassEndTime" type="datetime" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="课时数" prop="usedLessons" label-width="100px">
            <el-col :span="5">
              <el-input v-model="addForm.usedLessons"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="课程类型" prop="lessonType" label-width="100px">
            <el-select v-model="addForm.lessonType" placeholder="请选择">
              <el-option v-for="item in lesson_type" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item>  
        </el-form>
        
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserClassRecord(addForm)">确 定</el-button>
          </span>
      </el-dialog>

      <!--修改 用户信息对话框-->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="40%"
      @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm"  label-width="70px" >
          <el-form-item label="请选择用户" prop="userName" label-width="100px">
            <el-select v-model="editForm.userName" filterable remote :remote-method="editDialogClick" @change="updateSelectChange"
             placeholder="请输入关键词" :loading="loading">
              <el-option v-for="item in userinfo_list" :key="item.id" :label="item.name"
              :value="item.id" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="上课时间" prop="attendClassStartTime" label-width="100px">
           <el-date-picker v-model="editForm.attendClassStartTime" type="datetime" placeholder="选择日期"></el-date-picker> 
          </el-form-item>
          <el-form-item label="下课时间" prop="attendClassEndTime" label-width="100px" >
           <el-date-picker v-model="editForm.attendClassEndTime" type="datetime" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="课时数" prop="usedLessons" label-width="100px">
            <el-col :span="6">
              <el-input v-model="editForm.usedLessons"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="课程类型" prop="lessonType" label-width="100px">
            <el-select v-model="editForm.lessonType" placeholder="请选择">
              <el-option v-for="item in lesson_type" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
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
  import Service from './service/index'

  export default {
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          // query: '',
          pageId: 1,
          pageSize: 10
        },
        userList: [],
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          userId: '',
          userName: '',
          attendClassStartTime: '',
          attendClassEndTime: '',
          usedLessons: '',
          lessonType: '' 
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
        addFormUserNameParam: [],
        userinfo_list: [],
        lesson_type: [
          {value: 1, label: '成人集体课'},
          {value: 2, label: '少儿集体课'},
          {value: 3, label: 'vip小课'}
        ],
        loading : false
      }
    },
    created() {
      // this.getUserLessonRecordList()
      this.getUserLessonRecordList()
    },
    methods: {
      getUserLessonRecordList(queryInfo){ 
        Service.getUserLessonRecordList(queryInfo).then((res)=>{ 
          if (res.code !== 0) return this.$message.error('获取用户信息失败!')
          this.userList = res.data.data
          this.total = res.data.totalCount
        })
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserLessonRecordList()
      },
      // 监听 页码值 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pageId = newPage
        this.getUserLessonRecordList()
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
      // 添加用户上课记录
      // async addUser(addForm) {
      //   this.$refs.addFormRef.validate(async valid => { 
      //     if (!valid) return
      //     const { value, label } = this.addFormUserNameParam
      //     const {data: res} = await this.$http.post('yl/userLessonRecord/addUserLessonRecord', JSON.stringify({
      //       userId: value,
      //       userName: label,
      //       attendClassStartTime: this.$moment(addForm.attendClassStartTime).format('YYYY-MM-DD HH:mm:ss'),
      //       attendClassEndTime: this.$moment(addForm.attendClassEndTime).format('YYYY-MM-DD HH:mm:ss'),
      //       usedLessons: addForm.usedLessons,
      //       lessonType: addForm.lessonType 
      //     }))
      //     if (res.code !== 0) return this.$message.error(res.msg)
      //     this.addDialogVisible = false
      //     this.$message.success('添加成功！')
      //     // 重新获取课堂记录信息
      //     this.getUserLessonRecordList()
      //   })
      //  },
      addUserClassRecord(addForm){
        console.log(addForm)
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return 
          let userInfo = {}
          userInfo = this.userinfo_list.find((item) => {
              return item.id === addForm.userId;
          }) 
          addForm.userName = userInfo.name;
          addForm.attendClassStartTime = this.$moment(addForm.attendClassStartTime).format('YYYY-MM-DD HH:mm:ss');
          addForm.attendClassEndTime = this.$moment(addForm.attendClassEndTime).format('YYYY-MM-DD HH:mm:ss');
          Service.addUserClassRecord(addForm).then((res)=>{
            if (res.code !== 0) return this.$message.error(res.msg)
            this.addDialogVisible = false
            this.$message.success('添加成功!')
            // 重新获取课堂记录信息
            this.getUserLessonRecordList()
          }) 
        })
      }, 

      // 失焦查询用户信息
      async addDialogClick(query) {
        this.addDialogVisible = true
        if(query !== ''){
          // 发起获取用户课卡信息的数据请求
          const {data: res} = await this.$http.post('yl/user/getUserListByName', qs.stringify({
            userName: query
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.userinfo_list = res.data  
          this.$set(this.addForm,'userId',this.userinfo_list[0].id)
          this.$set(this.addForm,'userName',this.userinfo_list[0].name)
        } 
      },

      // 展示编辑课堂记录的对话框
      async showEditDialog(row) {
        const {data: res} = await this.$http.post('yl/userLessonRecord/getUserLessonRecord', qs.stringify({
          id: row.id
        })) 
        if (res.code !== 0) return this.$message.error(res.msg)
        // res.data.attendClassStartTime = this.$moment(res.data.attendClassStartTime).format('YYYY-MM-DD HH:mm:ss');
        // res.data.attendClassEndTime = this.$moment(res.data.attendClassEndTime).format('YYYY-MM-DD HH:mm:ss');
        this.editForm = res.data  
        this.editDialogVisible = true
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        // resetFields()重置表单的函数
        this.$refs.editFormRef.resetFields()
      },
 
      // 修改选中事件-参数改变
      updateSelectChange(e){ 
        let userInfo = {}
        userInfo = this.userinfo_list.find((item) =>
          {
            return item.id === e;
          } 
        )
        this.editForm.userId = userInfo.id
        this.editForm.userName = userInfo.name 
      },

      // 修改失焦事件-查询用户信息，选择不建议放到这里操作，在选中事件@change中操作
      async editDialogClick(query) { 
        if(query !== ''){
          // 发起获取用户课卡信息的数据请求
          const {data: res} = await this.$http.post('yl/user/getUserListByName', qs.stringify({
            userName: query
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.userinfo_list = res.data  
        }
      }, 
      // 修改用户上课记录
      editClassRecordInfo(editForm){ 
        this.$refs.editFormRef.validate(async valid => { 
          if (!valid) return   
          Service.editClassRecordInfo(editForm).then((res)=>{ 
            if (res.code !== 0) return this.$message.error(res.msg)
          this.editDialogVisible = false
          this.getUserLessonRecordList()
          this.$message.success('修改成功!')
          }) 
        })
      },
      
    }
  }
</script>

<style lang="less" scoped>

</style>
