import qs from "qs";
import request from "@/lib/request";

// 创建学员考试作答结果
export function createRecordAnswer(data) {
    return request({
        url: `/pland/record-answer/create`,
        method: "post",
        data: data
    });
}

// 更新学员考试作答结果
export function updateRecordAnswer(data) {
    return request({
        url: `/pland/record-answer/update`,
        method: "put",
        data: data
    });
}

// 删除学员考试作答结果
export function deleteRecordAnswer(id) {
    return request({
        url: `/pland/record-answer/delete`,
        method: "delete",
        params: { id }
    });
}

// 获取学员考试作答结果详情
export function getRecordAnswerDetail(id) {
    return request({
        url: `/pland/record-answer/get`,
        method: "get",
        params: { id }
    });
}

// 获取学员考试作答结果分页列表
export function getRecordAnswerPageList(query, limit, offset, order) {
    return request({
        url: `/pland/record-answer/page`,
        method: "post",
        data: qs.stringify({
            query,
            limit,
            offset,
            order
        })
    });
}

// 导出学员考试作答结果Excel
export function exportRecordAnswerExcel(query) {
    return request({
        url: `/pland/record-answer/export-excel`,
        method: "get",
        params: query
    });
}


// 创建在线考试
export function createExam(data) {
    return request({
        url: `/pland/info/create`,
        method: "post",
        data: data
    });
}

// 更新在线考试
export function updateExam(data) {
    return request({
        url: `/pland/info/update`,
        method: "put",
        data: data
    });
}

// 删除在线考试
export function deleteExam(id) {
    return request({
        url: `/pland/info/delete`,
        method: "delete",
        params: { id }
    });
}

// 获取在线考试详情
export function getExamDetail(id) {
    return request({
        url: `/pland/info/get`,
        method: "get",
        params: { id }
    });
}

// 获取在线考试分页列表
export function getExamPageList(params) {
    return request({
        url: `/pland/info/page`,
        method: "get",
        params
    });
}

// 导出在线考试Excel
export function exportExamExcel(query) {
    return request({
        url: `/pland/info/export-excel`,
        method: "get",
        params: query
    });
}

// 获取考试信息详情
export function getExamInfo(id) {
    return request({
        url: `/pland/exam/info/${id}`,
        method: "get"
    });
}

// 获取学员考试记录
export function getStudentExamRecords(examId) {
    return request({
        url: `/pland/record/student/${examId}`,
        method: "get"
    });
}


// 创建学员考试记录
export function createStudentRecord(data) {
    return request({
        url: `/pland/student-record/create`,
        method: "post",
        data: data
    });
}

// 更新学员考试记录
export function updateStudentRecord(data) {
    return request({
        url: `/pland/student-record/update`,
        method: "put",
        data: data
    });
}

// 删除学员考试记录
export function deleteStudentRecord(id) {
    return request({
        url: `/pland/student-record/delete`,
        method: "delete",
        params: { id }
    });
}

// 获取学员考试记录详情
export function getStudentRecordDetail(id) {
    return request({
        url: `/pland/student-record/get`,
        method: "get",
        params: { id }
    });
}

// 获取学员考试记录分页列表
export function getStudentRecordPageList(params) {
    return request({
        url: `/pland/student-record/page`,
        method: "get",
        params
    });
}

// 导出学员考试记录Excel
export function exportStudentRecordExcel(query) {
    return request({
        url: `/pland/student-record/export-excel`,
        method: "get",
        params: query
    });
}

export function getPaperGroupQuestionPageList(params) {
    return request({
        url: `/pland/paper-group-question/page`,
        method: "get",
        params
    });
}

export function getQuestionDetail(id) {
    return request({
        url: `/pland/question/get`,
        method: "get",
        params: { id }
    });
}

export function getQuestionAnswer(id) {
    return request({
        url: `/pland/question/getQuestionAnswer`,
        method: "get",
        params: { id }
    });
}

export function getAllInfo(id) {
    return request({
        url: `/pland/info/getAllInfo`,
        method: "get",
        params: { id }

    });
}
