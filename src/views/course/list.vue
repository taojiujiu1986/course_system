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
            class="px-4 py-1 text-white rounded-md"
            :class="{ 'bg-white text-[#1771FD]': activeTab === 'center' }"
            @click="activeTab = 'center'"
          >
            课程中心
          </button>
          <button
            class="px-4 py-1 text-white rounded-md"
            :class="{ 'bg-white text-[#1771FD]': activeTab === 'my' }"
            @click="activeTab = 'my'"
          >
            我的课程
          </button>
        </div>
        <div class="relative">
          <input
            type="text"
            placeholder="请输入课程名称"
            class="border border-gray-300 rounded-md pl-3 pr-10 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            class="absolute right-0 top-0 h-full w-10 bg-blue-500 rounded-r-md flex items-center justify-center"
          >
            <CgSearch class="text-white w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div class="mb-6 container mt-6">
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
    </div>

    <!-- 课程列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container">
      <div
        v-for="(course, index) in courses"
        :key="index"
        class="bg-white rounded-md shadow-md overflow-hidden"
      >
        <div class="relative">
          <img :src="course.image" alt="课程图片" class="w-full h-48 object-cover" />
          <div
            class="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-80"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="text-center text-white">
              <div class="mb-1">反评教学</div>
              <div class="font-bold">共享资源，喜迎心!</div>
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-[#333333] font-bold mb-2">{{ course.title }}</h3>
          <div class="text-black mb-1">课程分类：{{ course.category }}</div>
          <div class="text-black mb-3">
            课程售价：<span class="text-[#1771FD]">{{ course.price }}</span>
          </div>
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
      <button class="px-3 py-1 text-black hover:text-[#1771FD]">首页</button>
      <button class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center">
        <CgChevronLeft class="w-4 h-4 mr-1" />上一页
      </button>
      <button
        v-for="page in 6"
        :key="page"
        class="w-8 h-8 rounded-full flex items-center justify-center"
        :class="page === 1 ? 'bg-blue-500 text-white' : 'text-black hover:text-[#1771FD]'"
      >
        {{ page }}
      </button>
      <button class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center">
        下一页<CgChevronRight class="w-4 h-4 ml-1" />
      </button>
      <button class="px-3 py-1 text-black hover:text-[#1771FD]">尾页</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { CgChevronLeft, CgChevronRight } from "vue-icons-plus/cg";
import { CgSearch } from "vue-icons-plus/cg";

const activeTab = ref("center");

const policeTypes = ref([
  { name: "全部", active: true },
  { name: "刑侦", active: false },
  { name: "网安", active: false },
  { name: "科信", active: true },
]);

const regions = ref([
  { name: "全部", active: true },
  { name: "省厅", active: false },
  { name: "贵阳市", active: false },
  { name: "黔南市", active: false },
]);

const categories = ref([
  { name: "全部", active: true },
  { name: "心理学", active: true },
  { name: "物理", active: false },
]);

// 模拟课程数据
const courses = ref(
  Array(12)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      title: "反评中心现场教学反演实践",
      category: "职业技能",
      price: "免费",
      image: "/course-image.jpg",
    }))
);

const toggleFilter = (filterType, index) => {
  if (filterType === "policeTypes") {
    policeTypes.value = policeTypes.value.map((item, i) => ({
      ...item,
      active: i === index ? true : item.active,
    }));
  } else if (filterType === "regions") {
    regions.value = regions.value.map((item, i) => ({
      ...item,
      active: i === index ? true : item.active,
    }));
  } else if (filterType === "categories") {
    categories.value = categories.value.map((item, i) => ({
      ...item,
      active: i === index ? true : item.active,
    }));
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
