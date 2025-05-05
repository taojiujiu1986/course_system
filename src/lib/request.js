import axios from "axios";
import auth from "@/lib/auth";
import { showToast } from 'vant';

let BASE_API = "http://123.56.152.48:48080/admin-api/";

const request = axios.create({
  baseURL: BASE_API,
  timeout: 2 * 60 * 1000
});

// 从localStorage获取ACCESS_TOKEN
const getAccessToken = () => {
  try {
    const tokenStr = localStorage.getItem('ACCESS_TOKEN');
    if (tokenStr) {
      const tokenObj = JSON.parse(tokenStr);
      // 去除多余的引号，将 "\"token\"" 转换为 token
      const token = JSON.parse(tokenObj.v);
      return token;
    }
  } catch (e) {
    console.error('Failed to parse ACCESS_TOKEN from localStorage', e);
  }
  return null;
};

// 从localStorage获取REFRESH_TOKEN
const getRefreshToken = () => {
  try {
    const tokenStr = localStorage.getItem('REFRESH_TOKEN');
    if (tokenStr) {
      const tokenObj = JSON.parse(tokenStr);
      // 去除多余的引号，将 "\"token\"" 转换为 token
      const token = JSON.parse(tokenObj.v);
      return token;
    }
  } catch (e) {
    console.error('Failed to parse REFRESH_TOKEN from localStorage', e);
  }
  return null;
};

// 存储token到localStorage
const saveToken = (key, token) => {
  try {
    let v = {
      v:JSON.stringify(token)
    }
    localStorage.setItem(key, JSON.stringify(v));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
};

// 刷新token
const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios({
      method: 'post',
      url: `${BASE_API}system/auth/refresh-token?refreshToken=${refreshToken}`,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.code === 0) {
      // 保存新的access token和refresh token
      saveToken('ACCESS_TOKEN', response.data.data.accessToken);
      saveToken('REFRESH_TOKEN', response.data.data.refreshToken);
      return response.data.data.accessToken;
    } else {
      throw new Error(response.data.msg || 'Token refresh failed');
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// 是否正在刷新token
let isRefreshing = false;
// 重试队列
let requests = [];

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    if (
      config.url.indexOf("/login") == -1 &&
      config.url.indexOf("upload") == -1
    ) {
      // 获取token
      const token = getAccessToken();
      
      if (token) {
        // 使用Authorization header和Bearer格式
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      
      //在请求头中修改Content-Type为json,默认为form-data
      config.headers["Content-Type"] = "application/json;charset=UTF-8";
    }
    //记录操作日志

    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    /* 请求之后拦截器 */
    switch (response.data.code) {
      case 0:  // API成功返回码为0
      case 200:
        return Promise.resolve(response.data);
      case 400:
        showToast(response.data.msg);
        return Promise.reject(response.data.msg);
        break;
      case 401:
        // 如果不是刷新token的请求本身，尝试刷新token
        if (!response.config.url.includes('refresh-token')) {
          if (!isRefreshing) {
            isRefreshing = true;
            
            // 尝试刷新token
            return refreshToken()
              .then(newToken => {
                // 更新当前请求的Authorization头
                response.config.headers['Authorization'] = `Bearer ${newToken}`;
                
                // 重新发送所有请求
                requests.forEach(cb => cb(newToken));
                requests = [];
                
                // 重新发送当前请求
                return request(response.config);
              })
              .catch(error => {
                // showToast("登录状态失效,请重新登录");
                // // 跳到登录页
                // sessionStorage.clear();
                // var jump_url = `${window.location.origin}${window.location.pathname}#/login`;
                // var a = document.createElement("a");
                // a.setAttribute("href", jump_url);
                // a.click();
                // document.getElementsByTagName("body")[0].appendChild(a);
                // return Promise.reject(error);
              })
              .finally(() => {
                isRefreshing = false;
              });
          } else {
            // 将请求加入队列
            return new Promise(resolve => {
              requests.push(newToken => {
                response.config.headers['Authorization'] = `Bearer ${newToken}`;
                resolve(request(response.config));
              });
            });
          }
        } else {
          // 如果刷新token的请求也返回401，直接跳转到登录页
          showToast("登录状态失效,请重新登录");
          sessionStorage.clear();
          var jump_url = `${window.location.origin}${window.location.pathname}#/login`;
          var a = document.createElement("a");
          a.setAttribute("href", jump_url);
          a.click();
          document.getElementsByTagName("body")[0].appendChild(a);
          return Promise.reject(response.data.msg);
        }
        break;
      case 404:
        showToast(response.data.msg);
        return Promise.reject(response.data.msg);
        break;
      case 500:
        showToast("服务器打瞌睡了");
        return Promise.reject(response.data.msg);
        break;
      default:
        showToast(response.data.msg);
        return Promise.reject(response.data.msg);
    }
  },
  function(error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    showToast(error);
    return Promise.reject(error);
  }
);

export default request;
