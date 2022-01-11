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
          <el-input placeholder="请输入内容" v-model="queryInfo.queryParam" >
            <template slot="append">
              <el-button  icon="el-icon-search" @click="getUserLessonCardList()"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加用户课卡</el-button>
        </el-col>
      </el-row>

      <!--用户课卡列表区域-->
      <el-table :data="userLessonCardList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="课卡编号" prop="lessonCardCode" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="用户名称" prop="userName" align="center"></el-table-column> 
        <el-table-column label="课程类型"  align="center">
           <template slot-scope="scope">
            {{scope.row.lessonType == 1 ? "成人集体课卡" : (scope.row.lessonType == 2 ? "少儿集体课卡" : (scope.row.lessonType == 3 ? "vip小课卡" : ""))}}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" :formatter="dateFormat"  align="center"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" :formatter="dateFormat"  align="center"></el-table-column>
        <el-table-column label="课时总数" prop="lessonsAll" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" :formatter="dateTimeFormat"></el-table-column>
        <!-- <el-table-column label="修改时间" prop="updateTime" align="center" :formatter="dateTimeFormat"></el-table-column>  -->

        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!--删除按钮-->
            <!-- <el-button type="danger" icon="el-icon-delete" size="mini"></el-button> -->
            <!--分配角色按钮-->
            <!-- <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false"> -->
              <!-- <el-button type="warning" icon="el-icon-setting" size="mini"></el-button> -->
            <!-- </el-tooltip> -->
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
          <el-form-item label="请选择用户" label-width="100px">
            <el-select v-model="addForm.userName" filterable remote :remote-method="addDialogClick"  @change="addSelectChange"
             placeholder="请输入关键词" :loading="loading">
              <el-option v-for="item in userinfo_list" :key="item.id" :label="item.name"
              :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" prop="lessonType" label-width="100px">
            <el-select v-model="addForm.lessonType" placeholder="请选择">
              <el-option v-for="item in lesson_type" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="开始时间" prop="startTime" label-width="100px">
            <el-date-picker v-model="addForm.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" label-width="100px">
            <el-date-picker v-model="addForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker> 
          </el-form-item>
          <el-form-item label="课时总数" prop="lessonsAll" label-width="100px">
            <el-col :span="6"> 
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
          <el-form-item label="请选择用户" prop="userName" label-width="100px">
            <el-select v-model="editForm.userName" filterable remote :remote-method="editDialogClick" @change="updateSelectChange"
             placeholder="请输入关键词" :loading="loading">
              <el-option v-for="item in userinfo_list" :key="item.id" :label="item.name"
              :value="item.id" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="课程类型" prop="lessonType" label-width="100px">
            <el-select v-model="editForm.lessonType" placeholder="请选择">
              <el-option v-for="item in lesson_type" :key="item.value" :label="item.label" :value="item.value" ></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="开始时间" prop="startTime" label-width="100px">
             <el-date-picker v-model="editForm.startTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" label-width="100px">
            <el-date-picker v-model="editForm.endTime" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker> 
          </el-form-item>
          <el-form-item label="课时总数" prop="lessonsAll" label-width="100px">
            <el-col :span="6"> 
              <el-input v-model="editForm.lessonsAll" type="number"></el-input>
            </el-col> 
          </el-form-item> 
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassCardInfo(editForm)">确 定</el-button>
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
          queryParam: "",
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
        userinfo_list: [],
        loading: false ,
        addFormUserNameParam: [],
        editFormUserNameParam: []
      }
    },
    created() {
      this.getUserLessonCardList()
    },
    methods: {
      // async getUserLessonCardList() {
      //   const {data: res} = await this.$http.get('yl/lessonCardRecord/getUserLessonCardList', {
      //     params: this.queryInfo
      //   })
      //   if (res.code !== 0) return this.$message.error('获取用户会员卡信息失败！')
      //   this.userLessonCardList = res.data.data
      //   this.total = res.data.totalCount
      // },
      // 获取用户课卡列表
      getUserLessonCardList(){ 
        Service.getUserLessonCardList(this.queryInfo).then((res)=>{ 
          if (res.code !== 0) return this.$message.error('获取用户会员卡信息失败!')
          this.userLessonCardList = res.data.data
          this.total = res.data.totalCount
        })
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
        if (date === undefined || date == null) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD HH:mm')
      },
      // 日期格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD')
      },
      // 添加用户课卡
      // async addUserLessonCard(addForm) {
      //   this.$refs.addFormRef.validate(async valid => {
          // if (!valid) return 
          // let userInfo = {}
          // userInfo = this.userinfo_list.find((item) =>
          //   {
          //     return item.id === addForm.userId;
          //   } 
          // ) 
          // // const { value, label } = this.addFormUserNameParam
          // const {data: res} = await this.$http.post('yl/lessonCardRecord/addUserLessonCard', qs.stringify({
          //   userId: addForm.userId,
          //   userName: userInfo.name,
          //   lessonType: addForm.lessonType,
          //   startTime: this.$moment(addForm.startTime).format('YYYY-MM-DD'),
          //   endTime: this.$moment(addForm.endTime).format('YYYY-MM-DD'),
          //   lessonsAll: addForm.lessonsAll 
          // }))
          // if (res.code !== 0) return this.$message.error(res.msg)
          // this.addDialogVisible = false
          // this.$message.success('添加成功！')
          // // 重新获取课堂记录信息
          // this.getUserLessonCardList()
      //   })
      //  },
      // 添加用户课卡
      addUserLessonCard(addForm){  
        console.log(addForm)
        this.$refs.addFormRef.validate(async valid => { 
          if (!valid) return 
          let userInfo = {}
          userInfo = this.userinfo_list.find((item) =>
            {
              return item.id === addForm.userId;
            } 
          )  
          // const { value, label } = this.addFormUserNameParam
          addForm.userName = userInfo.name;
          Service.addUserLessonCard(addForm).then((res)=>{ 
            if (res.code !== 0) return this.$message.error(res.msg)
            this.addDialogVisible = false
            this.$message.success('添加成功!')
            // 重新获取课堂记录信息
            this.getUserLessonCardList()
          }) 
        })
      },
       
       // 添加失焦-查询用户信息
      async addDialogClick(query) { 
        if(query !== ''){
          // 发起获取用户课卡信息的数据请求
          const {data: res} = await this.$http.post('yl/user/getUserListByName', qs.stringify({
            userName: query
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.userinfo_list = res.data 
          // console.log(this.userinfo_list, "this.userinfo_listthis.userinfo_list")
          // console.log(this.editForm.userName ,'res.data res.data ')
          // this.editForm.id= this.userinfo_list[0].id
          // this.editForm.userName = this.userinfo_list[0].name
          // console.log(this.userinfo_list[0],'222222222')
          // console.log(this.userinfo_list[0].name,'111111')
          
          // this.$set(this.addForm,'userId',this.userinfo_list[0].id)
          // this.$set(this.addForm,'userName',this.userinfo_list[0].name)
        }

      },

      // 添加选中事件-参数改变
      addSelectChange(e){ 
        let userInfo = {}
        userInfo = this.userinfo_list.find((item) =>
          {
            return item.id === e;
          } 
        )
        this.addForm.userId = userInfo.id
        this.addForm.userName = userInfo.name 
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
 
          // this.editForm.id= this.userinfo_list[0].id
          // this.editForm.userName = this.userinfo_list[0].name
          // console.log(this.userinfo_list[0],'222222222')
          // console.log(this.userinfo_list[0].name,'111111')
          
          // this.$set(this.editForm,'userId',this.userinfo_list[0].id)
          // this.$set(this.editForm,'userName',this.userinfo_list[0].name) 
        }

      }, 

      // 展示编辑课堂记录的对话框
      async showEditDialog(row) {
        const {data: res} = await this.$http.post('yl/lessonCardRecord/getUserLessonCard', qs.stringify({
          id: row.id
        })) 
        if (res.code !== 0) return this.$message.error(res.msg)
        this.editForm = res.data  
        this.editDialogVisible = true
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        // resetFields()重置表单的函数
        this.$refs.editFormRef.resetFields()
      },

      //  // 修改用户课卡信息并提交
      // editClassCardInfo(editForm) {
      //   console.log(editForm,'editFormeditForm')
       
      //   // 预校验
      //   this.$refs.editFormRef.validate(async valid => {
      //     if (!valid) return
      //     // 发起修改用户课卡信息的数据请求
      //     console.log(editForm,'editFormeditFormeditFormeditForm')
      //     const {data: res} = await this.$http.post('yl/lessonCardRecord/updateUserLessonCard', qs.stringify({
      //       id: editForm.id,
      //       lessonCardCode: editForm.lessonCardCode,
      //       userId: editForm.userId,
      //       userName: editForm.userName,
      //       lessonType: editForm.lessonType,
      //       startTime: editForm.startTime,
      //       endTime: editForm.endTime,
      //       lessonsAll: editForm.lessonsAll 
      //     }))
      //     if (res.code !== 0) return this.$message.error(res.msg)
      //     this.editDialogVisible = false
      //     this.getUserLessonCardList()
      //     this.$message.success('修改成功！')
      //   })
      // },
      editClassCardInfo(editForm){ 
        console.log(editForm)
        this.$refs.editFormRef.validate(async valid => { 
          if (!valid) return   
          Service.editClassCardInfo(editForm).then((res)=>{ 
            if (res.code !== 0) return this.$message.error(res.msg)
            this.editDialogVisible = false
            this.getUserLessonCardList()
            this.$message.success('修改成功!')
          }) 
        })
      },
    }
  }
</script>

<style lang="less" scoped>

</style>
