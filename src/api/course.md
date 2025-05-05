以下是将PDF文档内容转换为Markdown格式后的版本：

# 学员端课程接口文档

## 获取学员端课程列表

### 接口地址
`/admin-api/edu/front/course/list`

### 请求方式
`GET`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| pageNo | 页码，从1开始 | query | true | integer(int32) |  |
| pageSize | 每页条数，最大值为100 | query | true | integer(int32) |  |
| courseName | 课程名称 | query | false | string |  |
| categoryId | 课程分类id | query | false | integer(int64) |  |
| policeClassification | 警种专业 | query | false | integer(int32) |  |

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultListCourseFrontListRespVO |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | array | CourseFrontListRespVO |
| id | 课程主键 | integer(int64) |  |
| cover | 课程封面 | string |  |
| courseName | 课程名称 | string |  |
| categoryId | 课程分类id | integer(int64) |  |
| categoryName | 课程分类名称 | string |  |
| hasCollection | 是否收藏 | boolean |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": [
    {
      "id": 123456,
      "cover": "https://exam.yfhl.net",
      "courseName": "Java课程",
      "categoryId": "123456",
      "categoryName": "射击",
      "hasCollection": false
    }
  ],
  "msg": ""
}
```

## 获取学员端课程信息

### 接口地址
`/admin-api/edu/front/course/get`

### 请求方式
`GET`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| id |  | query | true | integer(int64) |  |

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultCourseFrontDetailRespVO |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | CourseFrontDetailRespVO | CourseFrontDetailRespVO |
| id | 课程主键id | integer(int64) |  |
| courseName | 课程名称 | string |  |
| status | 课程状态 | integer(int32) |  |
| courseType | 课程类型 | integer(int32) |  |
| opentype | 开放类型 | integer(int32) |  |
| categoryId | 关联课程分类id | integer(int64) |  |
| categoryName | 关联课程分类名称 | integer(int64) |  |
| creditHour | 课时 | integer(int32) |  |
| cover | 课程封面 | string |  |
| sectionNum | 课程总节数，包括练习 | integer(int32) |  |
| startTime | 课程有效起始时间 | string(date-time) |  |
| endTime | 课程有效截止时间 | string(date-time) |  |
| content | 课程描述 | string |  |
| examId | 关联课程学习之后的考试id | integer(int64) |  |
| preExamId | 关联考前考试测试id | integer(int64) |  |
| checkOn | 是否开启弹窗防呆校验 | integer(int32) |  |
| checkSeconds | 弹窗间隔时长 | integer(int32) |  |
| stepLock | 是否课程顺序解锁 | integer(int32) |  |
| videoDrag | 是否禁止视频拖动 | integer(int32) |  |
| certificateId | 关联证书id | integer(int64) |  |
| dayRule | 每日可学时段 | string |  |
| dayLimit | 每日可学上限(分钟) | integer(int32) |  |
| score | 学完可获得的积分 | integer(int32) |  |
| publishTimes | 发布次数 | integer(int32) |  |
| publishTime | 最近一次发布的时间 | string(date-time) |  |
| createTime | 创建时间 | string(date-time) |  |
| catalogueList | 章节信息数组 | array | CourseCatalogueDTO |
| id | 章的主键 | string |  |
| catalogueName | 章标题 | string |  |
| courseId | 课程的主键 | string |  |
| sort | 排序字段，用于控制目录的显示顺序 | integer(int32) |  |
| sectionFileList | 章节文件列表，包含该目录下的所有文件 | array | CourseSectionDTO |
| id | 节的主键 | integer(int64) |  |
| catalogueId | 所属目录的主键 | integer(int64) |  |
| fileId | 文件的主键 | integer(int64) |  |
| courseId | 课程的主键 | integer(int64) |  |
| needLearnSeconds | 需要学习的时长（秒） | integer(int32) |  |
| sort | 排序字段，用于控制文件的显示顺序 | integer(int32) |  |
| sectionName | 节标题 | string |  |
| fileType | 文件类型（如2表示PDF格式文件） | string |  |
| fileUrl | 文件URL | string |  |
| learnedSeconds | 资源文件的已学习时长（秒） | integer(int32) |  |
| unlocked | 是否解锁 | boolean |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": {
    "id": 0,
    "courseName": "",
    "status": 0,
    "courseType": 0,
    "opentype": 0,
    "categoryId": 0,
    "categoryName": 0,
    "creditHour": 0,
    "cover": "",
    "sectionNum": 0,
    "startTime": "",
    "endTime": "",
    "content": "",
    "examId": 0,
    "preExamId": 0,
    "checkOn": 0,
    "checkSeconds": 0,
    "stepLock": 0,
    "videoDrag": 0,
    "certificateId": 0,
    "dayRule": "",
    "dayLimit": 0,
    "score": 0,
    "publishTimes": 0,
    "publishTime": "",
    "createTime": "",
    "catalogueList": [
      {
        "id": "1597145938494418946",
        "catalogueName": "【文档学习】",
        "courseId": "1561647177618051074",
        "sort": 1,
        "sectionFileList": [
          {
            "id": 1597145938578305026,
            "catalogueId": 1597145938494418946,
            "fileId": 1509722405452099586,
            "courseId": 1561647177618051074,
            "needLearnSeconds": 60,
            "sort": 1,
            "sectionName": "【云帆演示】模块划分",
            "fileType": "2",
            "fileUrl": "https://files1.yfhl.net/2022/7/19/1658225806100-e692a604.pdf",
            "learnedSeconds": 443,
            "unlocked": true
          }
        ]
      }
    ]
  },
  "msg": ""
}
```

## 获取后台管理端课程列表

### 接口地址
`/admin-api/edu/back/course/list`

### 请求方式
`GET`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| courseName | 课程名称 | query | false | string |  |
| categoryId | 课程分类id | query | false | integer(int64) |  |
| status | 课程状态 | query | false | integer(int32) |  |
| courseType | 课程类型 | query | false | integer(int32) |  |
| createTime | 创建时间 | query | false | array | string |

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultListCourseSimpleRespVO |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | array | CourseSimpleRespVO |
| id | 课程编号 | integer(int64) |  |
| courseName | 课程名称 | string |  |
| status | 课程状态 | integer(int32) |  |
| openType | 开放类型 | integer(int32) |  |
| categoryId | 课程分类id | integer(int64) |  |
| categoryName | 课程分类名称 | string |  |
| creditHour | 课时 | integer(int32) |  |
| startTime | 课程起始时间 | string(date-time) |  |
| endTime | 课程结束时间 | string(date-time) |  |
| cover | 课程封面 | string |  |
| teacherName | 教官姓名 | string |  |
| createTime | 创建时间 | string(date-time) |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": [
    {
      "id": 1024,
      "courseName": "芋道",
      "status": 1,
      "openType": 1,
      "categoryId": 1,
      "categoryName": "1",
      "creditHour": 1,
      "startTime": "",
      "endTime": "",
      "cover": "url",
      "teacherName": "1",
      "createTime": ""
    }
  ],
  "msg": ""
}
```

## 我的课程列表

### 接口地址
`/admin-api/edu/front/learning-lesson/list`

### 请求方式
`GET`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| pageNo | 页码，从1开始 | query | true | integer(int32) |  |
| pageSize | 每页条数，最大值为100 | query | true | integer(int32) |  |
| courseName | 课程名称 | query | false | string |  |
| categoryId | 课程分类id | query | false | string |  |
| status | 课程学习状态 | query | false | integer(int32) |  |

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultListCourseFrontListRespVO |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | array | CourseFrontListRespVO |
| id | 课程主键 | integer(int64) |  |
| cover | 课程封面 | string |  |
| courseName | 课程名称 | string |  |
| categoryId | 课程分类id | string |  |
| categoryName | 课程分类名称 | string |  |
| hasFavorite | 是否收藏 | boolean |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": [
    {
      "id": 123456,
      "cover": "https://exam.yfhl.net",
      "courseName": "Java课程",
      "categoryId": "123456",
      "categoryName": "射击",
      "hasFavorite": false
    }
  ],
  "msg": ""
}
```

## 获得文件分类

### 接口地址
`/admin-api/edu/file-category/get`

### 请求方式
`GET`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| id | 编号 | query | true | integer(int64) |  |

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultFileCategoryRespVO |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | FileCategoryRespVO | FileCategoryRespVO |
| id | 文件分类主键 | integer(int64) |  |
| categoryName | 分类名称 | string |  |
| parentId | 父级分类id | integer(int64) |  |
| level | 分类级别 | integer(int32) |  |
| sort | 排序 | integer(int32) |  |
| status | 分类状态 | integer(int32) |  |
| createTime | 创建时间 | string(date-time) |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": {
    "id": 3839,
    "categoryName": "王五",
    "parentId": 27135,
    "level": 0,
    "sort": 0,
    "status": 1,
    "createTime": ""
  },
  "msg": ""
}
```

## 获得文件分类列表

### 接口地址
`/admin-api/edu/file-category/list`

### 请求方式
`GET`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| categoryName | 分类名称 | query | false | string |  |
| parentId | 父级分类id | query | false | integer(int64) |  |
| level | 分类级别 | query | false | integer(int32) |  |
| sort | 排序 | query | false | integer(int32) |  |
| status | 分类状态 | query | false | integer(int32) |  |
| createTime | 创建时间 | query | false | array | string |

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultListFileCategoryRespVO |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | array | FileCategoryRespVO |
| id | 文件分类主键 | integer(int64) |  |
| categoryName | 分类名称 | string |  |
| parentId | 父级分类id | integer(int64) |  |
| level | 分类级别 | integer(int32) |  |
| sort | 排序 | integer(int32) |  |
| status | 分类状态 | integer(int32) |  |
| createTime | 创建时间 | string(date-time) |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": [
    {
      "id": 3839,
      "categoryName": "王五",
      "parentId": 27135,
      "level": 0,
      "sort": 0,
      "status": 1,
      "createTime": []
    }
  ],
  "msg": ""
}
```

## 保存学习进度

### 接口地址
`/admin-api/edu/front/course/record/save-process`

### 请求方式
`POST`

### 请求参数
| 参数名称 | 参数说明 | 请求类型 | 是否必须 | 数据类型 | schema |
| --- | --- | --- | --- | --- | --- |
| courseId | 课程id | body | false | integer(int64) |  |
| sectionId | 课程小节id | body | false | integer(int64) |  |
| learnedSeconds | 学习时间点 | body | false | integer(int32) |  |

### 请求示例
```json
{
  "courseId": 123,
  "sectionId": 123,
  "learnedSeconds": 60
}
```

### 响应状态
| 状态码 | 说明 | schema |
| --- | --- | --- |
| 200 | OK | CommonResultBoolean |

### 响应参数
| 参数名称 | 参数说明 | 类型 | schema |
| --- | --- | --- | --- |
| code |  | integer(int32) | integer(int32) |
| data |  | boolean |  |
| msg |  | string |  |

### 响应示例
```json
{
  "code": 0,
  "data": true,
  "msg": ""
}
```