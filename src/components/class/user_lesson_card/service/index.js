import Fetch from '../../../../util/Fetch';

export default {
  /**
   * 获取列表
   * @param requestParam
   */
   getUserLessonCardList(requestParam) { 
    return Fetch({
      url: 'yl/lessonCardRecord/getUserLessonCardList',
      method: 'get',
      params: requestParam
    });
  },
  //添加接口
  addUserLessonCard(params) {
    return Fetch({
      url: 'yl/lessonCardRecord/addUserLessonCard',
      method: 'post',
      data: params
    });
  }, 
  //修改接口
  editClassCardInfo(params) {
    return Fetch({
      url: 'yl/lessonCardRecord/updateUserLessonCard',
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
