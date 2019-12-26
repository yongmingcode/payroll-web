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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="addDialogVisible = true">添加上课记录</el-button>
        </el-col>
      </el-row>

      <!--课程记录列表区域-->
      <el-table :data="classRecordList" border stripe>
        <el-table-column label="记录编号" prop="id" align="center"></el-table-column>
        <el-table-column label="上课地点ID" align="center">
          <template slot-scope="scope">
            {{scope.row.locationId == 1 ? "望京" : "其它"}}
          </template>
        </el-table-column>
        <el-table-column label="课堂名称" prop="className" align="center"></el-table-column>
        <el-table-column label="课堂类型ID" align="center">
          <template slot-scope="scope">
            {{scope.row.classTypeId == 1 ? "大课" : "小课"}}
          </template>
        </el-table-column>
        <el-table-column label="课时" prop="classPeriod" align="center"></el-table-column>
        <el-table-column label="上课具体时间" :formatter="dateFormat" prop="classTime" align="center"></el-table-column>
        <el-table-column label="时长（单位：分钟）" prop="duration" align="center"></el-table-column>

        <el-table-column label="创建时间" :formatter="dateFormat" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作" width="185px" align="center">
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

      <!--添加上课记录-->
      <el-dialog title="添加上课记录" :visible.sync="addDialogVisible" width="40%">
        <!--内容主题区-->
        <el-form :model="addForm" label-width="70px">
          <el-form-item label="上课地点" prop="locationId" label-width="100px" >
            <el-select v-model="addForm.locationId" placeholder="请选择">
              <el-option v-for="item in class_location" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课堂名称" prop="className" label-width="100px">
            <el-input v-model="addForm.className"></el-input>
          </el-form-item>
          <el-form-item label="课堂类型" prop="classTypeId" label-width="100px">
            <el-select v-model="addForm.classTypeId" placeholder="请选择">
              <el-option v-for="item in class_type" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课时" prop="classPeriod" label-width="100px">
            <el-input v-model="addForm.classPeriod"></el-input>
          </el-form-item>
          <el-form-item label="上课具体时间" prop="classTime" label-width="100px">
            <el-date-picker v-model="addForm.classTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="时长" prop="duration" label-width="100px">
            <el-input v-model="addForm.duration" placeholder="单位：分钟"></el-input>
          </el-form-item>
          <el-form-item label="课堂备注" prop="content" label-width="100px" >
            <el-input v-model="addForm.content"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addClassRecord(addForm)">确 定</el-button>
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
          pageId: 1,
          pageSize: 1
        },
        classRecordList: [],
        total: 0,
        // 控制添加上课记录对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          locationId: '',
          className: '',
          classTypeId: '',
          classPeriod: '',
          classTime: '',
          duration: '',
          content: ''
        },
        class_location: [
          {value: '1', label: '望京'},
          {value: '2', label: '其它'}
        ],
        class_type: [
          {value: '1', label: '大课'},
          {value: '2', label: '小课'}
        ]
      }
    },
    created() {
      this.getClassRecordList()
    },
    methods: {
      async getClassRecordList() {
        const {data: res} = await this.$http.get('yl/classrecords/getclassrecordlist', {
          params: this.queryInfo
        })
        if (res.code !== 0) return this.$message.error('获取管理员信息失败！')
        this.classRecordList = res.data.data
        this.total = res.data.totalCount
        console.log(this.classRecordList)
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
      async addClassRecord(addForm) {
        const {data: res} = await this.$http.post('yl/classrecords/addclassrecord', qs.stringify({
          locationId: addForm.locationId,
          className: addForm.className,
          classTypeId: addForm.classTypeId,
          classPeriod: addForm.classPeriod,
          classTime: this.$moment(addForm.classTime).format('YYYY-MM-DD HH:mm:ss'),
          duration: addForm.duration,
          content: addForm.content
        }))
        if (res.code !== 0) return this.$message.error('获取管理员信息失败！')
        this.addDialogVisible = false
        this.$message.success('更新状态成功！')
        console.log(res)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
