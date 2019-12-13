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
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pageNum: 1,
          pagesize: 2
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
        const {data: res} = await this.$http.get('yl/manager/getManagerList', {
          params: this.queryInfo
        })
        if (res.code !== 0) return this.$message.error('获取管理员信息失败！')
        this.managerList = res.data.managerList
        this.total = res.data.total
        console.log(res)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
