<template>
  <el-container class="home-container">
    <!--头部区-->
    <el-header>
      <img src="../../assets/img/snow.jpg" alt="">
      <span>管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse"> < > </div>
        <!--侧边栏菜单区域-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
        :collapse="isCollapse" :collapse-transition="false" :router="true">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!--一级菜单的模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="item.icon"></i>
              <!--文本-->
              <span>{{item.name}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.childrenMenu" :key="subItem.id"><!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span>{{subItem.name}}</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!--路由占位符-->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        // 左侧菜单数据
        menulist: [],
        iconsObj: {
          '1': 'iconfont icon-user',
          '2': 'iconfont icon-lock-fill'
        },
        // 是否折叠左侧菜单
        isCollapse: false
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 获得所有的菜单
      async getMenuList() {
        const {data: res} = await this.$http.get('/yl/menu/getmenulist')
        if (res.code !== 0) return this.$message.error(res.code.msg)
        this.menulist = res.data
        console.log(this.menulist)
      },
      // 点击按钮，切换菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: solid 0px
    }
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button{
    background-color: #4A5064;
    font-size: 20px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
