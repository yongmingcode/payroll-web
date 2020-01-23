<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程记录列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="toolbar">
        <div class="controls">
          <span style="font-size: 14px">开始时间</span>
          <el-date-picker v-model="queryInfo.minDate" type="datetime"  placeholder="选择日期时间" default-time="12:00:00" align="right" @change="getClassRecordList"></el-date-picker>

          <span style="font-size: 14px">结束时间</span>
          <el-date-picker v-model="queryInfo.maxDate" type="datetime"  placeholder="选择日期时间" default-time="12:00:00" align="right" @change="getClassRecordList"></el-date-picker>

          <el-select v-model="queryInfo.locationId" placeholder="地点" @change="getClassRecordList">
            <el-option v-for="item in class_location" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <el-select v-model="queryInfo.classTypeId" placeholder="课堂类型" @change="getClassRecordList">
            <el-option v-for="item in class_type" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="Add ">
          <!--<div class="select_keyword">-->
            <!--<el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable @clear="getClassRecordList">-->
              <!--<el-button slot="append" icon="el-icon-search" @click="getClassRecordList"></el-button>-->
            <!--</el-input>-->
          <!--</div>-->
          <div class="add_button">
            <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
          </div>
        </div>
      </div>

      <!--列表区域-->
      <el-table :data="classRecordList" border stripe>
        <el-table-column label="编号" prop="id" align="center"></el-table-column>
        <el-table-column label="地点" align="center">
          <template slot-scope="scope">
            {{scope.row.locationId == 1 ? "望京" : "其它"}}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            {{scope.row.classTypeId == 1 ? "大课" : (scope.row.classTypeId == 2 ? "小课" : "其它")}}
          </template>
        </el-table-column>
        <el-table-column label="上课时间" :formatter="dateFormat" prop="startTime" align="center"></el-table-column>
        <el-table-column label="下课时间" :formatter="dateFormat" prop="endTime" align="center"></el-table-column>
        <el-table-column label="课时费" prop="tuition" align="center" style="width: 50px"></el-table-column>
        <el-table-column label="是否已上" prop="state" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model='scope.row.isAttend'
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0" @change="classRecordStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" :formatter="dateFormat" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" width="185px" align="center">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeClassRecordById(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <!--<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">-->
              <!--<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>-->
            <!--</el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageId"
        :page-sizes="[20, 40, 80]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--添加 上课记录的对话框-->
      <el-dialog title="添加上课记录" :visible.sync="addDialogVisible" width="40%"
       @close="addDialogClosed">
        <!--内容主题区-->
        <el-form :model="addForm" label-width="70px" :rules="addFormRules" ref="addFormRef">
          <el-form-item label="上课地点" prop="locationId" label-width="100px" >
            <el-select v-model="addForm.locationId" placeholder="请选择">
              <el-option v-for="item in class_location" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课堂类型" prop="classTypeId" label-width="100px">
            <el-select v-model="addForm.classTypeId" placeholder="请选择">
              <el-option v-for="item in class_type" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间" prop="startTime" label-width="100px">
            <el-date-picker v-model="addForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="下课时间" prop="endTime" label-width="100px">
            <el-date-picker v-model="addForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="课时费" prop="tuition" label-width="100px">
            <el-input v-model="addForm.tuition"></el-input>
          </el-form-item>
          <el-form-item label="是否已出席" prop="locationId" label-width="100px" >
            <el-select v-model="addForm.isAttend" placeholder="请选择">
              <el-option v-for="item in is_attend" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addClassRecord(addForm)">确 定</el-button>
          </span>
      </el-dialog>

      <!--修改 课堂记录的对话框-->
      <el-dialog title="修改课堂记录" :visible.sync="editDialogVisible" width="40%"
      @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm"  label-width="70px" :rules="editFormRules">
          <el-form-item label="上课地点" prop="locationId" label-width="100px" >
            <el-select v-model="editForm.locationId" placeholder="请选择">
              <el-option v-for="item in class_location" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课堂类型" prop="classTypeId" label-width="100px">
            <el-select v-model="editForm.classTypeId" placeholder="请选择">
              <el-option v-for="item in class_type" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间" prop="startTime" label-width="100px">
            <el-date-picker v-model="editForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="下课时间" prop="endTime" label-width="100px">
            <el-date-picker v-model="editForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="课时费" prop="tuition" label-width="100px">
            <el-input v-model="editForm.tuition"></el-input>
          </el-form-item>
          <el-form-item label="是否已出席" prop="locationId" label-width="100px" >
            <el-select v-model="editForm.isAttend" placeholder="请选择">
              <el-option v-for="item in is_attend" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editClassRecordInfo">确 定</el-button>
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
        queryInfo: {
          locationId: '',
          classTypeId: '',
          keyword: '',
          minDate: '',
          maxDate: '',
          pageId: 1,
          pageSize: 20
        },
        classRecordList: [],
        total: 0,
        // 控制添加上课记录对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          locationId: '',
          classTypeId: '',
          startTime: '',
          endTime: '',
          tuition: '',
          isAttend: ''
        },
        addFormRules: {
          tuition: [
            {required: true, message: '请输入课时费', trigger: 'blur'}
          ]
        },
        class_location: [
          {value: -1, label: '全部'},
          {value: 1, label: '望京'},
          {value: 2, label: '其它'}
        ],
        class_type: [
          {value: -1, label: '全部'},
          {value: 1, label: '大课'},
          {value: 2, label: '小课'}
        ],
        is_attend: [
          {value: 0, label: '未出席'},
          {value: 1, label: '已出席'}
        ],
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的课堂记录信息对象
        editForm: {},
        // 修改表单的验证规则对象
        editFormRules: {
          className: [
            {required: true, message: '请输入课堂名称', trigger: 'blur'},
            {min: 2, max: 50, message: '课堂名称的长度在2-50个字符'}
          ]
        }
      }
    },
    created() {
      this.getClassRecordList()
      // 时间默认一周
      var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
      var start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      start.setHours(0, 0, 0, 0)
      start = this.forDate(start)
      end = this.forDate(end)
      this.queryInfo.minDate = start
      this.queryInfo.maxDate = end
    },
    methods: {
      async getClassRecordList() {
        const {data: res} = await this.$http.get('yl/classrecords/getclassrecordlist', {
          params: this.queryInfo
        })
        if (res.code !== 0) return this.$message.error('获取管理员信息失败！')
        this.classRecordList = res.data.data
        this.total = res.data.totalCount
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
      },

      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getClassRecordList()
      },

      // 监听 页码值 改变
      handleCurrentChange(newPage) {
        this.queryInfo.pageId = newPage
        this.getClassRecordList()
      },

      // 添加上课记录
      addClassRecord(addForm) {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('yl/classrecords/addclassrecord', qs.stringify({
            locationId: addForm.locationId,
            classTypeId: addForm.classTypeId,
            startTime: this.$moment(addForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: this.$moment(addForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
            tuition: addForm.tuition,
            isAttend: addForm.isAttend
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.addDialogVisible = false
          this.$message.success('更新状态成功！')
          // 重新获取课堂记录信息
          this.getClassRecordList()
        })
      },

      // 监听添加课堂记录对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },

      // 展示编辑课堂记录的对话框
      async showEditDialog(id) {
        const {data: res} = await this.$http.post('yl/classrecords/getclassrecord', qs.stringify({
          id: id
        }))
        if (res.code !== 0) return this.$message.error('查询课堂记录信息失败！')
        this.editForm = res.data
        this.editDialogVisible = true
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        // resetFields()重置表单的函数
        this.$refs.editFormRef.resetFields()
      },

      // 修改课堂记录信息并提交
      editClassRecordInfo() {
        // 预校验
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          // 发起修改用户信息的数据请求
          const {data: res} = await this.$http.post('yl/classrecords/updateclassrecord', qs.stringify({
            locationId: this.editForm.locationId,
            classTypeId: this.editForm.classTypeId,
            startTime: this.$moment(this.editForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: this.$moment(this.editForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
            tuition: this.editForm.tuition,
            isAttend: this.editForm.isAttend,
            id: this.editForm.id
          }))
          if (res.code !== 0) return this.$message.error(res.msg)
          this.editDialogVisible = false
          this.getClassRecordList()
          this.$message.success('修改成功！')
        })
      },

      // 根据Id删除对应的课堂记录
      async removeClassRecordById(id) {
        // 询问用户是否删除
        const confireRes = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confireRes !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {data: res} = await this.$http.post('yl/classrecords/deleteclassrecord', qs.stringify({
          id: id
        }))
        if (res.code !== 0) return this.$message.error(res.msg)
        this.getClassRecordList()
      },

      // 更新课堂记录是否已上课
      async classRecordStateChanged(classRecorInfo) {
        const {data: res} = await this.$http.post('yl/classrecords/updateclassrecordisattend', qs.stringify({
          id: classRecorInfo.id,
          isAttend: classRecorInfo.isAttend
        }))
        if (res.code !== 0) {
          classRecorInfo.state = !classRecorInfo.state
          return this.$message.error('更新状态失败！')
        }
        this.$message.success('更新状态成功！')
      },

      forDate(timestamp) {
        var date = new Date(timestamp)
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var mm = date.getMinutes()
        mm = mm < 10 ? ('0' + mm) : mm
        var ss = date.getSeconds()
        ss = ss < 10 ? ('0' + ss) : ss
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss
      }
    }
  }
</script>

<style lang="less" scoped>
  .toolbar{
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: left;
    overflow: hidden;
    background: #fff;
    padding: 1px 2px;
    .controls{
      float: left;
      height: 40px;
      .el-select{
        width: 110px;
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 195px;
      }
    }
    .Add {
      float: right;
      height: 42px;
      .select_keyword{
        float: left;
        width: 200px;
        margin-right: 5px;
      }
      .add_button{
        float: right;
      }
    }
  }
</style>
