<template>
  <div class="h-[230px] relative overflow-hidden w-full banner">
    <div class="h-full flex items-center justify-center">
      <div class="text"></div>
    </div>
  </div>
  <div class="mx-auto">
    <div class="bg-white w-full px-4 py-6 mb-6">
      <!-- 课程导航和搜索 -->
      <div class="flex justify-between items-center container">
        <div class="flex space-x-2 bg-[#1771FD] p-[5px] mb-4">
          <button
            class="px-4 py-1 rounded-md"
            :class="{
              'bg-white text-[#1771FD]': activeTab === 'center',
              'text-white': activeTab !== 'center',
            }"
            @click="handleTabChange('center')"
          >
            课程中心
          </button>
          <button
            class="px-4 py-1 rounded-md"
            :class="{
              'bg-white text-[#1771FD]': activeTab === 'my',
              'text-white': activeTab !== 'my',
            }"
            @click="handleTabChange('my')"
          >
            我的课程
          </button>
        </div>

        <div class="relative">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="请输入课程名称"
            class="border border-gray-300 rounded-md pl-3 pr-10 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @keyup.enter="searchCourse"
          />
          <button
            class="absolute right-0 top-0 h-full w-10 bg-blue-500 rounded-r-md flex items-center justify-center"
            @click="searchCourse"
          >
            <CgSearch class="text-white w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div class="mb-6 container mt-6" v-if="activeTab === 'center'">
        <div class="flex items-center py-2">
          <span class="w-16 text-black">警种：</span>
          <div class="flex flex-1 flex-wrap">
            <button
              v-for="(item, index) in policeTypes"
              :key="index"
              class="px-4 py-1 mr-2 mb-1 rounded-full"
              :class="item.active ? 'bg-blue-100 text-[#1771FD]' : 'text-black'"
              @click="toggleFilter('policeTypes', index)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <div class="flex items-center py-2">
          <span class="w-16 text-black">地区：</span>
          <div class="flex flex-1 flex-wrap">
            <button
              v-for="(item, index) in regions"
              :key="index"
              class="px-4 py-1 mr-2 mb-1 rounded-full"
              :class="item.active ? 'bg-blue-100 text-[#1771FD]' : 'text-black'"
              @click="toggleFilter('regions', index)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <div class="flex items-center py-2">
          <span class="w-16 text-black">分类：</span>
          <div class="flex flex-1 flex-wrap">
            <button
              v-for="(item, index) in categories"
              :key="index"
              class="px-4 py-1 mr-2 mb-1 rounded-full"
              :class="item.active ? 'bg-blue-100 text-[#1771FD]' : 'text-black'"
              @click="toggleFilter('categories', index)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
      <!-- 筛选条件 -->
      <div class="mb-6 container mt-6" v-else-if="activeTab === 'my'">
        <div class="flex items-center py-2">
          <span class="w-24 text-gray-600">学习状态：</span>
          <div class="flex flex-1 flex-wrap">
            <button
              v-for="(item, index) in learningStatus"
              :key="index"
              class="px-4 py-1 mr-2 mb-1 rounded-full"
              :class="item.active ? 'bg-blue-100 text-blue-500' : 'text-gray-600'"
              @click="toggleFilter('learningStatus', index)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <div class="flex items-center py-2">
          <span class="w-24 text-gray-600">课程分类：</span>
          <div class="flex flex-1 flex-wrap">
            <button
              v-for="(item, index) in courseCategories"
              :key="index"
              class="px-4 py-1 mr-2 mb-1 rounded-full"
              :class="item.active ? 'bg-blue-100 text-blue-500' : 'text-gray-600'"
              @click="toggleFilter('courseCategories', index)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程中心模块 -->
    <template v-if="activeTab === 'center'">
      <!-- 课程列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container">
        <div
          v-for="course in courses"
          :key="course.id"
          class="bg-white rounded-md shadow-md overflow-hidden"
        >
          <div class="relative">
            <img :src="course.cover" alt="课程图片" class="w-full h-48 object-cover" />
          </div>
          <div class="p-4">
            <h3 class="text-[#333333] font-bold mb-2 overflow-hidden">
              {{ course.courseName }}
            </h3>
            <div class="text-black mb-1">课程分类：{{ course.categoryName }}</div>
            <router-link :to="'/course/view/' + course.id">
              <div
                class="w-full bg-blue-500 text-white py-1 rounded-full hover:bg-blue-600 transition text-center"
              >
                立即学习
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center items-center mt-8 space-x-2 mb-8">
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD]"
          @click="handlePageChange(1)"
        >
          首页
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center"
          @click="handlePageChange(Math.max(1, pageNo - 1))"
        >
          <CgChevronLeft class="w-4 h-4 mr-1" />上一页
        </button>
        <button
          v-for="page in 6"
          :key="page"
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="
            page === pageNo ? 'bg-blue-500 text-white' : 'text-black hover:text-[#1771FD]'
          "
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center"
          @click="handlePageChange(pageNo + 1)"
        >
          下一页<CgChevronRight class="w-4 h-4 ml-1" />
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD]"
          @click="handlePageChange(6)"
        >
          尾页
        </button>
      </div>
    </template>

    <!-- 我的课程模块 -->
    <template v-else-if="activeTab === 'my'">
      <!-- 课程列表 -->
      <div class="space-y-4 container">
        <div
          v-for="course in myCourses"
          :key="course.id"
          class="bg-white rounded-md overflow-hidden border border-gray-200"
        >
          <div class="p-4 flex flex-col md:flex-row">
            <!-- 课程图片 -->
            <div class="w-full md:w-48 lg:w-64 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div class="relative rounded-md overflow-hidden">
                <img :src="course.cover" alt="课程图片" class="w-full h-auto" />
              </div>
            </div>

            <!-- 课程信息 -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">
                    {{ course.courseName }}
                  </h3>
                  <div class="flex items-center text-blue-500">
                    <EpChatDotSquare class="w-4 h-4 mr-1" />
                    <span class="">课程回答 (10)</span>
                  </div>
                </div>

                <div class="flex flex-col text-gray-600 mb-3">
                  <div class="flex items-center">
                    <span class="mr-1">学习时间：</span>
                    <span>2025-01-01 ~ 2025-12-31</span>
                  </div>
                  <div class="flex items-center">
                    <span class="mr-1">课程来源：</span>
                    <span>课程中心</span>
                  </div>
                  <div class="flex items-center col-span-1 md:col-span-2">
                    <span class="mr-1">总体进度：</span>
                    <span>{{ course.learnProgress }}</span>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center mt-2"
              >
                <router-link :to="'/course/view/' + course.id" class="text-blue-500">
                  继续学习
                </router-link>
                <div class="text-blue-500">
                  <span>最近学习：{{ course.lastStudyTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center items-center mt-8 space-x-2 mb-8">
        <button
          class="px-3 py-1 text-gray-600 hover:text-blue-500"
          @click="handlePageChange(1)"
        >
          首页
        </button>
        <button
          class="px-3 py-1 text-gray-600 hover:text-blue-500 flex items-center"
          @click="handlePageChange(Math.max(1, pageNo - 1))"
        >
          <CgChevronLeft class="w-4 h-4 mr-1" />上一页
        </button>
        <button
          v-for="page in 6"
          :key="page"
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="
            page === pageNo
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-blue-500'
          "
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 text-gray-600 hover:text-blue-500 flex items-center"
          @click="handlePageChange(pageNo + 1)"
        >
          下一页<CgChevronRight class="w-4 h-4 ml-1" />
        </button>
        <button
          class="px-3 py-1 text-gray-600 hover:text-blue-500"
          @click="handlePageChange(6)"
        >
          尾页
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { EpChatDotSquare } from "vue-icons-plus/ep";
import { CgSearch, CgChevronLeft, CgChevronRight } from "vue-icons-plus/cg";
import { getCourseList, getMyCourseList } from "@/api/course";

// 分页信息
const pageNo = ref(1);
const pageSize = ref(12);
const searchKeyword = ref("");
const selectedCategoryId = ref("");

// 课程数据
const courses = ref([]);
const myCourses = ref([]);
const loading = ref(false);

// 学习状态筛选
const learningStatus = ref([
  { name: "全部", active: true, value: null },
  { name: "未学习", active: false, value: 1 },
  { name: "学习中", active: false, value: 2 },
  { name: "已完成", active: false, value: 3 },
]);

// 课程分类筛选
const courseCategories = ref([
  { name: "全部", active: true, value: null },
  { name: "警务技能", active: false, value: 1 },
  { name: "法律法规", active: false, value: 2 },
  { name: "刑事侦查", active: false, value: 3 },
  { name: "网络安全", active: false, value: 4 },
  { name: "交通管理", active: false, value: 5 },
  { name: "反恐训练", active: false, value: 6 },
]);

const activeTab = ref("center");

const policeTypes = ref([
  { name: "全部", active: true },
  { name: "刑侦", active: false },
  { name: "网安", active: false },
  { name: "科信", active: false },
]);

const regions = ref([
  { name: "全部", active: true },
  { name: "省厅", active: false },
  { name: "贵阳市", active: false },
  { name: "黔南市", active: false },
]);

const categories = ref([
  { name: "全部", active: true, value: null },
  { name: "警务技能", active: false, value: 1 },
  { name: "法律法规", active: false, value: 2 },
  { name: "刑事侦查", active: false, value: 3 },
  { name: "网络安全", active: false, value: 4 },
  { name: "交通管理", active: false, value: 5 },
  { name: "反恐训练", active: false, value: 6 },
]);

// 获取选中的分类ID
const getSelectedCategoryId = () => {
  const selectedCategory = categories.value.find(
    (item) => item.active && item.value !== null
  );
  return selectedCategory ? selectedCategory.value : null;
};

// 获取选中的学习状态
const getSelectedStatus = () => {
  const selectedStatus = learningStatus.value.find(
    (item) => item.active && item.value !== null
  );
  return selectedStatus ? selectedStatus.value : null;
};

// 加载课程中心数据
const loadCourseList = async () => {
  loading.value = true;
  try {
    const categoryId = getSelectedCategoryId();
    const res = await getCourseList(
      pageNo.value,
      pageSize.value,
      searchKeyword.value,
      categoryId
    );
    if (res.code === 0) {
      courses.value = res.data;
    }
  } catch (error) {
    console.error("加载课程列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 加载我的课程数据
const loadMyCourseList = async () => {
  loading.value = true;
  try {
    const categoryId = getSelectedCategoryId();
    const status = getSelectedStatus();
    const res = await getMyCourseList(
      pageNo.value,
      pageSize.value,
      searchKeyword.value,
      categoryId,
      status
    );
    if (res.code === 0) {
      myCourses.value = res.data;
    }
  } catch (error) {
    console.error("加载我的课程列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 切换标签页
const handleTabChange = (tab) => {
  activeTab.value = tab;
  pageNo.value = 1;
  if (tab === "center") {
    loadCourseList();
  } else {
    loadMyCourseList();
  }
};

// 搜索课程
const searchCourse = () => {
  pageNo.value = 1;
  if (activeTab.value === "center") {
    loadCourseList();
  } else {
    loadMyCourseList();
  }
};

const toggleFilter = (filterType, index) => {
  if (filterType === "policeTypes") {
    policeTypes.value.forEach((item, i) => {
      item.active = i === index;
    });
  } else if (filterType === "regions") {
    regions.value.forEach((item, i) => {
      item.active = i === index;
    });
  } else if (filterType === "categories") {
    categories.value.forEach((item, i) => {
      item.active = i === index;
    });
    loadCourseList();
  } else if (filterType === "learningStatus") {
    learningStatus.value.forEach((item, i) => {
      item.active = i === index;
    });
    loadMyCourseList();
  } else if (filterType === "courseCategories") {
    courseCategories.value.forEach((item, i) => {
      item.active = i === index;
    });
    loadMyCourseList();
  }
};

// 页面初始化时加载数据
onMounted(() => {
  loadCourseList();
});

// 监听标签页变化
const watchActiveTab = computed(() => {
  return activeTab.value;
});

// 分页处理
const handlePageChange = (newPage) => {
  pageNo.value = newPage;
  if (activeTab.value === "center") {
    loadCourseList();
  } else {
    loadMyCourseList();
  }
};
</script>
<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
.banner {
  background: url(../../assets/course-bg.png) no-repeat center center;
  background-size: 100% 100%;
}
.banner .text {
  background: url(../../assets/course-bg-text.png) no-repeat center center;
  width: 268px;
  height: 63px;
}
</style>
