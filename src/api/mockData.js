// 生成随机课程封面图片URL
function getRandomCoverImage() {
  const images = [
    require('../assets/1.png'),
    require('../assets/2.png'),
    require('../assets/3.png'),
    require('../assets/4.png'),
    require('../assets/5.png'),
    require('../assets/6.png'),
    require('../assets/7.png'),
    require('../assets/8.png'),
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// 生成随机视频URL
function getRandomVideoUrl() {
  const videos = [
    'https://img.tukuppt.com/video_show/2421007/00/01/76/5b49bcf37ecc3.mp4', // Big Buck Bunny sample
  ];
  return videos[Math.floor(Math.random() * videos.length)];
}

// 生成随机PDF URL
function getRandomPdfUrl() {
  const pdfs = [
    'https://www.africau.edu/images/default/sample.pdf'
  ];
  return pdfs[Math.floor(Math.random() * pdfs.length)];
}

// 课程分类数据
const courseCategories = [
  { id: 1, name: '警务技能' },
  { id: 2, name: '法律法规' },
  { id: 3, name: '刑事侦查' },
  { id: 4, name: '网络安全' },
  { id: 5, name: '交通管理' },
  { id: 6, name: '反恐训练' }
];

// 生成课程基本数据
function generateCourseBase(id) {
  const categoryIndex = Math.floor(Math.random() * courseCategories.length);
  const category = courseCategories[categoryIndex];
  
  return {
    id,
    cover: getRandomCoverImage(),
    courseName: `公安${category.name}培训课程 ${id}`,
    categoryId: category.id,
    categoryName: category.name,
    hasCollection: Math.random() > 0.5
  };
}

// 生成课程详情数据
function generateCourseDetail(id) {
  const categoryIndex = Math.floor(Math.random() * courseCategories.length);
  const category = courseCategories[categoryIndex];
  
  // 生成章节
  const catalogueCount = Math.floor(Math.random() * 3) + 1;
  const catalogueList = [];
  
  for (let i = 1; i <= catalogueCount; i++) {
    const sectionCount = Math.floor(Math.random() * 5) + 1;
    const sectionFileList = [];
    
    for (let j = 1; j <= sectionCount; j++) {
      // 随机生成视频或PDF文件
      const fileType = Math.random() > 0.5 ? '1' : '2'; // 1表示视频，2表示PDF
      const fileUrl = fileType === '1' ? getRandomVideoUrl() : getRandomPdfUrl();
      const needLearnSeconds = 110; // 60-660秒
      const learnedSeconds = Math.floor(Math.random() * needLearnSeconds);
      
      sectionFileList.push({
        id: parseInt(`${id}${i}${j}`),
        catalogueId: parseInt(`${id}${i}`),
        fileId: parseInt(`${id}${i}${j}00`),
        courseId: id,
        needLearnSeconds,
        sort: j,
        sectionName: fileType === '1' 
          ? `第${i}章第${j}节：${category.name}技能视频教程.MP4` 
          : `第${i}章第${j}节：${category.name}技能文档.PDF`,
        fileType,
        fileUrl,
        learnedSeconds,
        unlocked: j === 1 ? true : Math.random() > 0.3
      });
    }
    
    catalogueList.push({
      id: `${id}${i}`,
      catalogueName: `第${i}章：${category.name}核心内容`,
      courseId: `${id}`,
      sort: i,
      sectionFileList
    });
  }
  
  return {
    id,
    courseName: `公安${category.name}培训课程 ${id}`,
    status: 1, // 1表示已发布
    courseType: Math.floor(Math.random() * 3) + 1,
    opentype: 1, // 公开课程
    categoryId: category.id,
    categoryName: category.name,
    creditHour: Math.floor(Math.random() * 10) + 1,
    cover: getRandomCoverImage(),
    sectionNum: catalogueList.reduce((acc, curr) => acc + curr.sectionFileList.length, 0),
    startTime: '2025-01-01 00:00:00',
    endTime: '2025-12-31 23:59:59',
    content: `本课程主要介绍公安${category.name}相关知识，帮助学员掌握相关技能和理论知识，提高业务水平。`,
    examId: Math.floor(Math.random() * 1000) + 1,
    preExamId: Math.floor(Math.random() * 1000) + 1,
    checkOn: 1,
    checkSeconds: 300,
    stepLock: 1,
    videoDrag: 1,
    certificateId: Math.floor(Math.random() * 100) + 1,
    dayRule: '08:00-22:00',
    dayLimit: 120,
    score: 100,
    publishTimes: 1,
    publishTime: '2025-01-01 00:00:00',
    createTime: '2025-01-01 00:00:00',
    catalogueList
  };
}

// 课程列表模拟数据
export function mockCourseList(pageNo, pageSize, courseName, categoryId) {
  // 总数据量
  const total = 36;
  const dataList = [];
  
  // 计算分页
  const start = (pageNo - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  
  // 生成当前页数据
  for (let i = start + 1; i <= end; i++) {
    dataList.push(generateCourseBase(i));
  }
  
  // 如果有搜索条件，进行过滤
  let filteredList = dataList;
  if (courseName) {
    filteredList = filteredList.filter(item => item.courseName.includes(courseName));
  }
  if (categoryId) {
    filteredList = filteredList.filter(item => item.categoryId === parseInt(categoryId));
  }
  
  return {
    code: 0,
    data: filteredList,
    msg: ""
  };
}

// 课程详情模拟数据
export function mockCourseDetail(id) {
  return {
    code: 0,
    data: generateCourseDetail(parseInt(id)),
    msg: ""
  };
}

// 我的课程列表模拟数据
export function mockMyCourseList(pageNo, pageSize, courseName, categoryId, status) {
  // 总数据量
  const total = 20;
  const dataList = [];
  
  // 计算分页
  const start = (pageNo - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  
  // 生成当前页数据
  for (let i = start + 1; i <= end; i++) {
    const course = generateCourseBase(i);
    course.learnProgress = `${Math.floor(Math.random() * 100)}%`; // 添加学习进度字段
    course.lastStudyTime = new Date().toLocaleString('zh-CN');    // 添加最近学习时间
    dataList.push(course);
  }
  
  // 如果有搜索条件，进行过滤
  let filteredList = dataList;
  if (courseName) {
    filteredList = filteredList.filter(item => item.courseName.includes(courseName));
  }
  if (categoryId) {
    filteredList = filteredList.filter(item => item.categoryId === parseInt(categoryId));
  }
  if (status) {
    // 假设1=未学习，2=学习中，3=已完成
    if (status === 1) {
      filteredList = filteredList.filter(item => parseInt(item.learnProgress) === 0);
    } else if (status === 2) {
      filteredList = filteredList.filter(item => parseInt(item.learnProgress) > 0 && parseInt(item.learnProgress) < 100);
    } else if (status === 3) {
      filteredList = filteredList.filter(item => parseInt(item.learnProgress) === 100);
    }
  }
  
  return {
    code: 0,
    data: filteredList,
    msg: ""
  };
} 