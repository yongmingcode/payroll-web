<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>日历</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card class="box-card">
      <el-calendar v-model="value" id="calendar">
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{date, data}">
          <div> {{data.day.split('-').slice(2).join('-')}} </div>
          <!--自定义内容-->
          <div class="calendar-day">
            <div v-for="item in calendarData">
              <div v-if="item.year == parseInt(data.day.split('-')[0])">
                <div v-if="item.month == parseInt(data.day.split('-')[1])">
                  <div v-if="item.day == parseInt(data.day.split('-')[2])">
                    {{item.location}} : {{item.time}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--<div>-->
            <!--<div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>-->
            <!--<div v-for="item in calendarData">-->
              <!--<div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">-->
                <!--<div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">-->
                  <!--<el-tooltip class="item" effect="dark" :content="item.things" placement="right">-->
                    <!--<div class="is-selected">{{item.things}}</div>-->
                  <!--</el-tooltip>-->
                <!--</div>-->
                <!--<div v-else></div>-->
              <!--</div>-->
              <!--<div v-else></div>-->
            <!--</div>-->
          <!--</div>-->
        </template>
      </el-calendar>
    </el-card>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        calendarData: [
          // {year: '2020', month: 1, day: 3, things: '看电影'}
          // {months: ['09', '11'], days: ['15'], things: '看电影'},
          // {months: ['10', '11'], days: ['02'], things: '去公园野炊去公园野炊去公园野炊去公园野炊'},
          // {months: ['11'], days: ['02'], things: '看星星'},
          // {months: ['11'], days: ['02'], things: '看月亮'}
        ],
        value: new Date(),
        queryInfo: {
          locationId: '',
          classTypeId: '',
          keyword: '',
          minDate: '',
          maxDate: '',
          pageId: 1,
          pageSize: 20000
        }
      }
    },
    created() {
      this.getCalendarClassRecordList()
    },
    methods: {
      async getCalendarClassRecordList() {
        const {data: res} = await this.$http.get('yl/classrecords/getcalendarclassrecordlist')
        if (res.code !== 0) return this.$message.error('获取管理员信息失败！')
        this.calendarData = res.data
        console.log(this.calendarData)
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-calendar-table .el-calendar-day{
    height: 120px
  }
  .calendar-day {
    text-align: left;
    color: #55a532;
    line-height: 16px;
    font-size: 15px;
  }

  /*.is-selected {*/
    /*color: #F8A535;*/
    /*font-size: 10px;*/
    /*margin-top: 5px;*/
  /*}*/

  /*#calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {*/
    /*content: '当月';*/
  /*}*/
</style>
