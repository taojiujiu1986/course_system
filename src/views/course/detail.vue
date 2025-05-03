<template>
  <div class="min-h-screen">
    <!-- 顶部课程信息 -->
    <div class="banner py-6">
      <div class="container flex flex-col md:flex-row items-start gap-6">
        <!-- 课程图片 -->
        <div class="w-full md:w-64 lg:w-80 flex-shrink-0">
          <div
            class="relative rounded-lg overflow-hidden bg-gradient-to-r from-orange-400 to-orange-300"
          >
            <img
              src="../../assets/course-sample.png"
              alt="课程图片"
              class="w-full h-auto"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white p-4">
                <div class="mb-1">反评阶段：</div>
                <div class="font-bold">共享屏幕，喜当心!</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 课程信息 -->
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-black mb-4">反评中心现场教学反盗实践</h1>

          <div class="flex flex-col gap-1 mb-6">
            <div class="flex items-center">
              <span class="text-black mr-2">类型：</span>
              <span>职业技能</span>
            </div>
            <div class="flex items-center">
              <span class="text-black mr-2">课时：</span>
              <span>3课时</span>
            </div>
            <div class="flex items-center col-span-2">
              <span class="text-black mr-2">发布时间：</span>
              <span>2025-04-30 09:59:31</span>
            </div>
          </div>

          <div class="flex space-x-4">
            <button
              class="flex items-center px-6 py-1 bg-[#CADDFF] text-[#1771FD] rounded-full hover:bg-blue-200 transition"
            >
              <FiStar class="w-5 h-5 mr-1" />
              收藏
            </button>
            <button
              class="flex items-center px-6 py-1 bg-[#CADDFF] text-[#1771FD] rounded-full hover:bg-blue-200 transition"
            >
              <PiShareBold class="w-5 h-5 mr-1" />
              分享
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 pb-12" style="margin-top: 20px">
      <div
        class="bg-white rounded-2xl shadow-md overflow-hidden px-4 py-4"
        style="box-shadow: 0px -7px 0px 0px rgb(55 110 251)"
      >
        <!-- 标签导航 -->
        <div class="flex border-b border-gray-200">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            class="px-6 py-3 font-bold text-black relative"
            :class="{
              'text-[#1771FD] text-medium': activeTab === tab.id,
              'border-b-4 border-[#1771FD]': activeTab === tab.id,
            }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
            <span v-if="tab.count" class="ml-1">({{ tab.count }})</span>
          </button>
        </div>

        <!-- 课程内容 -->
        <div class="p-6">
          <div
            v-if="activeTab === 'learning'"
            class="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <!-- 视频播放区域 -->
            <div class="md:col-span-2">
              <div
                class="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-200 to-blue-400 aspect-video"
              >
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center text-white"
                >
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center cursor-pointer hover:bg-white/40 transition"
                    >
                      <IoPlayOutline class="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 p-4 text-left">
                    <div class="bg-[#1771FD]/70 px-3 py-1 rounded-full inline-block mb-2">
                      重磅讲座
                    </div>
                    <h3 class="text-xl font-bold mb-1">详解劳动法</h3>
                    <p class="">懂法用法 保护自身权益</p>
                  </div>
                </div>
              </div>

              <!-- 课程推荐 -->
              <div class="mt-8">
                <h3
                  class="text-xl font-bold text-black border-l-8 border-[#1771FD] pl-2 mb-4"
                >
                  课程推荐
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    v-for="(course, index) in recommendedCourses"
                    :key="index"
                    class="border border-gray-200 rounded-md overflow-hidden"
                  >
                    <div class="relative">
                      <img
                        :src="course.image"
                        alt="课程图片"
                        class="w-full h-32 object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-80"
                      ></div>
                      <div class="absolute inset-0 flex items-center justify-center p-2">
                        <div class="text-center text-white">
                          <div class="mb-1">反评阶段</div>
                          <div class="font-bold">共享屏幕，喜当心!</div>
                        </div>
                      </div>
                    </div>
                    <div class="p-3">
                      <h4 class="font-bold text-black mb-1 line-clamp-2">
                        {{ course.title }}
                      </h4>
                      <div class="text-black mb-1">课程分类：{{ course.category }}</div>
                      <div class="text-black mb-2">
                        课程售价：<span class="text-[#1771FD]">{{ course.price }}</span>
                      </div>
                      <button
                        class="w-full bg-[#1771FD] text-white py-1 rounded-full hover:bg-blue-600 transition"
                      >
                        立即学习
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 课程章节 -->
            <div class="md:col-span-1">
              <div class="bg-gray-100 p-4 rounded-lg overflow-hidden">
                <div
                  class="flex items-center justify-between py-3 border-b border-dashed border-gray-600 mb-4"
                >
                  <h3 class="font-bold text-gray-700">课程章节</h3>
                  <IoChevronDownOutline class="w-5 h-5 text-gray-500" />
                </div>
                <div class="flex flex-col gap-4">
                  <div
                    v-for="(chapter, index) in chapters"
                    :key="index"
                    class="p-4 bg-white"
                    :class="{ 'bg-[#1771FD] text-white': chapter.active }"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <h4
                        class="font-bold"
                        :class="chapter.active ? 'text-white' : 'text-black'"
                      >
                        {{ chapter.title }}
                      </h4>
                      <div v-if="chapter.locked" class="text-red-500 flex items-center">
                        <IoLockClosedOutline class="w-4 h-4" />
                      </div>
                    </div>
                    <div
                      class="flex justify-between items-center mb-2"
                      :class="chapter.active ? 'text-blue-100' : 'text-gray-500'"
                    >
                      <span>课程时长: {{ chapter.duration }}</span>
                      <span>进度: {{ chapter.progress }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :class="chapter.active ? 'bg-blue-200' : 'bg-[#1771FD]'"
                        :style="{ width: chapter.progress }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'intro'" class="prose max-w-none">
            <h2>课程介绍</h2>
            <p>
              本课程主要讲解反评中心现场教学反盗实践相关内容，帮助学员掌握相关技能和知识。
            </p>
            <!-- 这里可以放更多课程介绍内容 -->
          </div>

          <div v-else-if="activeTab === 'qa'" class="prose max-w-none">
            <!-- 问答区域 -->
            <div v-if="!showQaDetail">
              <QaList @question-click="handleQuestionClick" />
            </div>
            <div v-else>
              <div class="mb-4">
                <button
                  @click="backToQaList"
                  class="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <span class="mr-1">←</span> 返回问题列表
                </button>
              </div>
              <QaDetail :question="currentQuestion" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FiStar } from "vue-icons-plus/fi";
import { EpChatDotSquare } from "vue-icons-plus/ep";
import { IpGoodTwo } from "vue-icons-plus/ip";
import { PiShareBold } from "vue-icons-plus/pi";
import QaList from "./components/qaList.vue";
import QaDetail from "./components/qaDetail.vue";

// 标签页数据
const tabs = [
  { id: "learning", name: "课程学习" },
  { id: "intro", name: "课程介绍" },
  { id: "qa", name: "课程问答", count: 1 },
];

const activeTab = ref("learning");
const showQaDetail = ref(false);
const currentQuestion = ref(null);

// 处理问题点击事件
const handleQuestionClick = (question) => {
  currentQuestion.value = question;
  showQaDetail.value = true;
};

// 返回问题列表
const backToQaList = () => {
  showQaDetail.value = false;
  currentQuestion.value = null;
};

// 推荐课程数据
const recommendedCourses = ref([
  {
    id: 1,
    title: "反评中心现场教学反盗实践",
    category: "职业技能",
    price: "免费",
    image: "/course-image.jpg",
  },
  {
    id: 2,
    title: "反评中心现场教学反盗实践",
    category: "职业技能",
    price: "免费",
    image: "/course-image.jpg",
  },
  {
    id: 3,
    title: "反评中心现场教学反盗实践",
    category: "职业技能",
    price: "免费",
    image: "/course-image.jpg",
  },
]);

// 课程章节数据
const chapters = ref([
  {
    id: 1,
    title: "1.1 申办考临床试验质量管理体系.MP4",
    duration: "20分18秒",
    progress: "50%",
    active: false,
  },
  {
    id: 2,
    title: "1.1 申办考临床试验质量管理体系.PDF",
    duration: "20分18秒",
    progress: "50%",
    active: true,
  },
  {
    id: 3,
    title: "1.1 申办考临床试验质量管理体系...",
    duration: "20分18秒",
    progress: "50%",
    active: false,
  },
  {
    id: 4,
    title: "1.1 申办考临床试验质量管理体系.MP4",
    duration: "20分18秒",
    progress: "50%",
    active: false,
  },
  {
    id: 5,
    title: "1.1 申办考临床试验质量管理体系.MP4",
    duration: "20分18秒",
    progress: "0%",
    active: false,
    locked: true,
  },
]);
</script>
<style scoped>
.banner {
  background: url(../../assets/course-detail-bg.png) no-repeat center center;
  background-size: 100% 100%;
}

.container {
  width: 1200px;
  margin: 0 auto;
}
</style>
