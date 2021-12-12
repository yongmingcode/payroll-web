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
          <el-button type="primary" @click="addDialogClick()">添加用户课卡</el-button>
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
        width="40%">
        <!--内容主题区-->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="请选择用户" prop="addFormUserNameParam" label-width="100px">
            <el-select v-model="addFormUserNameParam" filterable remote reserve-keyword :remote-method="addDialogClick"
             placeholder="请输入关键词" :loading="loading">
              <el-option v-for="item in userinfo_list" :key="item.id" :label="item.name"
              :value="{ value: item.id, label: item.name }" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" prop="lessonType" label-width="100px">
            <el-select v-model="addForm.lessonType" placeholder="请选择">
              <el-option v-for="item in lesson_type" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="开始时间" prop="startTime" label-width="100px">
            <el-date-picker v-model="addForm.startTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" label-width="100px">
            <el-date-picker v-model="addForm.endTime" type="date" placeholder="选择日期"></el-date-picker> 
          </el-form-item>
          <el-form-item label="课时总数" prop="lessonsAll" label-width="100px">
            <el-col :span="4"> 
            <el-input v-model="addForm.lessonsAll" type="number"></el-input>
            </el-col>
          </el-form-item> 
        </el-form> 
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserLessonCard(addForm)">确 定</el-button>
          </span>
      </el-dialog>

      <!--修改 用户课卡信息对话框-->
      <el-dialog title="修改用户课卡信息" :visible.sync="editDialogVisible" width="40%"
      @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm"  label-width="70px" >
          <!-- <el-form-item label="请选择用户" prop="editFormUserNameParam" label-width="100px">
            <el-select v-model="editFormUserNameParam" filterable remote reserve-keyword :remote-method="editDialogClick"
             placeholder="请输入关键词" :loading="loading">
              <el-option v-for="item in userinfo_list" :key="item.id" :label="item.name"
              :value="{ value: item.id, label: item.name }" ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="请选择用户" prop="userName" label-width="100px">
            <el-col :span="13">
              <el-input v-model="editForm.userName" disabled></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="课程类型" prop="lessonType" label-width="100px">
            <el-select v-model="editForm.lessonType" placeholder="请选择">
              <el-option v-for="item in lesson_type" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="开始时间" prop="startTime" label-width="100px">
             <el-date-picker v-model="editForm.startTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" label-width="100px">
            <el-date-picker v-model="editForm.endTime" type="date" placeholder="选择日期"></el-date-picker> 
          </el-form-item>
          <el-form-item label="课时总数" prop="lessonsAll" label-width="100px">
            <el-col :span="6"> 
              <el-input v-model="editForm.lessonsAll" type="number"></el-input>
            </el-col> 
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
          userName: '',
          lessonType: 1,  
          startTime: '',
          endTime: '',
          lessonsAll: '' 
        }, 
        // 查询到的课堂记录信息对象
        editForm: {},
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false, 
        lesson_type: [
          {value: 1, label: '成人集体课'},
          {value: 2, label: '少儿集体课'},
          {value: 3, label: 'vip小课'}
        ],
        userinfo_list: [
          {id: 2, name: '少儿集体课'},
          {id: 3, name: 'vip小课'}
        ],
        loading: false ,
        addFormUserNameParam: [],
        editFormUserNameParam: []
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
      // 日期时间格式化
      dateTimeFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      // 日期格式化
      dateTimeFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD')
      },
      // 添加用户课卡
      addUserLessonCard(addForm) {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const { value, label } = this.addFormUserNameParam
          const {data: res} = await this.$http.post('yl/lessonCardRecord/addUserLessonCard', qs.stringify({
            userId: value,
            userName: label,
            lessonType: addForm.lessonType,
            startTime: this.$moment(addForm.startTime).format('YYYY-MM-DD'),
            endTime: this.$moment(addForm.endTime).format('YYYY-MM-DD'),
            lessonsAll: addForm.lessonsAll 
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.addDialogVisible = false
          this.$message.success('添加成功！')
          // 重新获取课堂记录信息
          this.getUserLessonCardList()
        })
       },

       // 监听添加用户对话框的点击事件
      async addDialogClick(query) {
        this.addDialogVisible = true
        if(query !== ''){
          // 发起获取用户课卡信息的数据请求
          const {data: res} = await this.$http.post('yl/user/getUserListByName', qs.stringify({
            userName: query
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.userinfo_list = res.data 
        }

      },
      // 监听添加用户对话框的点击事件
      async editDialogClick(query) {
        this.editDialogVisible = true
        if(query !== ''){
          // 发起获取用户课卡信息的数据请求
          const {data: res} = await this.$http.post('yl/user/getUserListByName', qs.stringify({
            userName: query
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.userinfo_list = res.data 
        }

      },

      // 展示编辑课堂记录的对话框
      async showEditDialog(row) {
        const {data: res} = await this.$http.post('yl/lessonCardRecord/getUserLessonCard', qs.stringify({
          id: row.id
        }))
        console.log(row)
        if (res.code !== 0) return this.$message.error(res.msg)
        this.editForm = res.data
        console.log(res.data) 
        // var myCar = new Object();
        // myCar.id = res.data.userId;
        // myCar.name = res.data.userName;
        // console.log(this.editFormUserNameParam)
        // this.editFormUserNameParam = myCar;
        // console.log(this.editFormUserNameParam)
        // console.log(myCar) 
        this.editDialogVisible = true
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        // resetFields()重置表单的函数
        this.$refs.editFormRef.resetFields()
      },

       // 修改用户课卡信息并提交
      editClassRecordInfo(editForm) {
        // 预校验
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          // 发起修改用户课卡信息的数据请求
          console.log(editForm)
          const {data: res} = await this.$http.post('yl/lessonCardRecord/updateUserLessonCard', qs.stringify({
            id: editForm.id,
            lessonCardCode: editForm.lessonCardCode,
            userId: editForm.userId,
            userName: editForm.userName,
            lessonType: editForm.lessonType,
            startTime: editForm.startTime,
            endTime: editForm.endTime,
            lessonsAll: editForm.lessonsAll 
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
