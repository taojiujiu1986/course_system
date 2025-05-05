import qs from "qs";
import request from "@/lib/request";
import { mockCourseList, mockCourseDetail, mockMyCourseList } from "./mockData";

// 获取学员端课程列表
export function getCourseList(pageNo, pageSize, courseName, categoryId, policeClassification) {
    // 使用模拟数据
    const mockResponse = mockCourseList(pageNo, pageSize, courseName, categoryId);
    return Promise.resolve(mockResponse);
    
    // 真实API调用（后端API可用时取消注释）
    /*
    const query = qs.stringify({
        pageNo,
        pageSize,
        courseName,
        categoryId,
        policeClassification
    });
    return request({
        url: `/admin-api/edu/front/course/list`,
        method: "get",
        params: query
    });
    */
}

// 获取学员端课程信息
export function getCourseDetail(id) {
    // 使用模拟数据
    const mockResponse = mockCourseDetail(id);
    return Promise.resolve(mockResponse);
    
    // 真实API调用（后端API可用时取消注释）
    /*
    return request({
        url: `/admin-api/edu/front/course/get`,
        method: "get",
        params: { id }
    });
    */
}


// 获取我的课程列表
export function getMyCourseList(pageNo, pageSize, courseName, categoryId, status) {
    // 使用模拟数据
    const mockResponse = mockMyCourseList(pageNo, pageSize, courseName, categoryId, status);
    return Promise.resolve(mockResponse);
    
    // 真实API调用（后端API可用时取消注释）
    /*
    const query = qs.stringify({
        pageNo,
        pageSize,
        courseName,
        categoryId,
        status
    });
    return request({
        url: `/admin-api/edu/front/learning-lesson/list`,
        method: "get",
        params: query
    });
    */
}

// 获得文件分类
export function getFileCategory(id) {
    return request({
        url: `/admin-api/edu/file-category/get`,
        method: "get",
        params: { id }
    });
}

// 获得文件分类列表
export function getFileCategoryList(categoryName, parentId, level, sort, status, createTime) {
    const query = qs.stringify({
        categoryName,
        parentId,
        level,
        sort,
        status,
        createTime
    });
    return request({
        url: `/admin-api/edu/file-category/list`,
        method: "get",
        params: query
    });
}

// 保存学习进度
export function saveLearningProgress(courseId, sectionId, learnedSeconds) {
    // 模拟保存进度成功的响应
    return Promise.resolve({
        code: 0,
        data: true,
        msg: ""
    });
    
    // 真实API调用（后端API可用时取消注释）
    /*
    return request({
        url: `/admin-api/edu/front/course/record/save-process`,
        method: "post",
        data: {
            courseId,
            sectionId,
            learnedSeconds
        }
    });
    */
}