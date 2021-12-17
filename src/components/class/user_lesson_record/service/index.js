import Fetch from '../../../../util/Fetch';

export default {
  /**
   * 获取用户上课记录列表
   * @param requestParam
   */
   getUserLessonRecordList(requestParam) { 
    return Fetch({
      url: 'yl/userLessonRecord/getUserLessonRecordList',
      method: 'get',
      params: requestParam
    });
  },
  //添加接口
  addUserClassRecord(params) {
    return Fetch({
      url: 'yl/userLessonRecord/addUserLessonRecord',
      method: 'post',
      data: params
    });
  }, 
  //修改接口
  editClassRecordInfo(params) {
    return Fetch({
      url: 'yl/userLessonRecord/updateUserLessonRecord',
      method: 'post',
      data: params
    });
  }, 
  //内容说明页面
  insertAgentContent(params) {
    return Fetch({
      url: '/agentContent/insertAgentContent',
      method: 'post',
      data: params
    });
  },
  //内容说明页面获取原本内容接口
  getAgentContent(params) {
    return Fetch({
      url: '/agentContent/getAgentContent',
      method: 'get',
      params: params
    });
  },
};
