<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
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
          <el-button type="primary">添加管理员</el-button>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="managerList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="管理员ID" prop="id"></el-table-column>
        <el-table-column label="名称" prop="username"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="上次登陆时间" prop="updateTime"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="状态" prop="state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state === 1 ? true : false" active-color="#13ce66" inactive-color="#ff4949"/>
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
    </el-card>
  </div>
</template>

<script>
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
        total: 0
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
        console.log(this.managerList)
        console.log(this.total)
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
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
