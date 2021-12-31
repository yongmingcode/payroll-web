import axios from 'axios'; 
import {env_hostUrl} from './environment';
import { Message } from 'element-ui'; 
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // transformRequest: [function (data) {
  //   return Qs.stringify(data)
  // }],
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  timeout: 50000,
});

// request拦截器
service.interceptors.request.use((config) => {
  // 需要在请求发出前做的全局处理逻辑可以添加在这里
  if(config.rootPath){
    config.url = config.url;
  }else{
    config.url = env_hostUrl + config.url;
    // config.url = "http://47.93.244.206:8089/" + config.url;
    // config.url = __appletPathConfig + config.url;
  }
  return config;
}, (error) => {
  // 可以在这里统一处理请求错误
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use((response) => {
  if (!response.status === 200) {
    // 可以在这里统一处理响应错误
    if ("success" !== response.data.result) {
      // 可以在这里统一处理响应错误
      Message({
        type: 'error',
        message: response.data.message == null?'请求异常':response.data.message
      });
      return Promise.reject(response.data);
    }
    return Promise.reject(response.data);
  }
  return response.data;
}, (error) => {
  // 可以在这里统一处理响应错误
  return Promise.reject(error);
});

service.subPath = process.env.SUB_PATH;

export default service;
