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
              :src="courseDetail.cover || '../../assets/course-sample.png'"
              alt="课程图片"
              class="w-full h-auto"
            />
          </div>
        </div>

        <!-- 课程信息 -->
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-black mb-4">
            {{ courseDetail.courseName || "课程标题" }}
          </h1>

          <div class="flex flex-col gap-1 mb-6">
            <div class="flex items-center">
              <span class="text-black mr-2">类型：</span>
              <span>{{ courseDetail.categoryName || "未分类" }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-black mr-2">课时：</span>
              <span>{{ courseDetail.creditHour || 0 }}课时</span>
            </div>
            <div class="flex items-center col-span-2">
              <span class="text-black mr-2">发布时间：</span>
              <span>{{ courseDetail.publishTime || "未知" }}</span>
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
            <!-- <span v-if="tab.count" class="ml-1">({{ tab.count }})</span> -->
          </button>
        </div>

        <!-- 课程内容 -->
        <div class="p-6">
          <div
            v-if="activeTab === 'learning'"
            :class="{
              'grid grid-cols-1 md:grid-cols-3 gap-6':
                !currentSection || currentSection.fileType === '1',
              'flex flex-row gap-6': currentSection && currentSection.fileType === '2',
            }"
          >
            <!-- 视频/PDF播放区域 -->
            <div
              :class="{
                'md:col-span-2': !currentSection || currentSection.fileType === '1',
                'flex-1': currentSection && currentSection.fileType === '2',
              }"
            >
              <div v-if="currentSection">
                <!-- 视频播放器 -->
                <div
                  v-if="currentSection.fileType === '1'"
                  class="relative rounded-lg overflow-hidden aspect-video"
                >
                  <video
                    ref="videoPlayer"
                    class="w-full h-full"
                    controlsList="nodownload nofullscreen"
                    @timeupdate="handleTimeUpdate"
                    @loadedmetadata="handleMetadataLoaded"
                    @ended="handleVideoEnded"
                    @seeking="handleSeeking"
                    @play="startActivityMonitoring"
                    @pause="stopActivityMonitoring"
                  >
                    <source :src="currentSection.fileUrl" type="video/mp4" />
                    您的浏览器不支持视频播放
                  </video>

                  <!-- 自定义视频控制界面 -->
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-4"
                  >
                    <div class="flex items-center gap-4">
                      <!-- 播放/暂停按钮 -->
                      <button
                        @click="isPlaying ? pauseVideo() : startVideo()"
                        class="text-white focus:outline-none"
                      >
                        <svg
                          v-if="isPlaying"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <rect x="6" y="4" width="4" height="16" fill="white" />
                          <rect x="14" y="4" width="4" height="16" fill="white" />
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <polygon points="5,3 19,12 5,21" fill="white" />
                        </svg>
                      </button>

                      <!-- 当前时间/总时间 -->
                      <div class="text-white text-sm">
                        {{ formatTime(currentVideoTime) }} /
                        {{ formatTime(totalVideoDuration) }}
                      </div>

                      <!-- 不可拖动的进度条 -->
                      <div
                        class="flex-1 relative h-2 bg-gray-600 rounded-full overflow-hidden"
                      >
                        <!-- 已播放进度 -->
                        <div
                          class="absolute top-0 left-0 h-full bg-blue-500"
                          :style="{ width: videoProgress + '%' }"
                        ></div>
                        <!-- 可播放进度 -->
                        <div
                          class="absolute top-0 left-0 h-full bg-gray-400"
                          :style="{
                            width: allowedProgress + '%',
                            opacity: 0.3,
                          }"
                        ></div>
                      </div>

                      <!-- 音量控制 -->
                      <button
                        @click="toggleMute"
                        class="text-white focus:outline-none ml-2"
                      >
                        <svg
                          v-if="isMuted"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            fill="white"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                            stroke="white"
                          />
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- 播放按钮覆盖层 -->
                  <div
                    v-if="!isPlaying"
                    @click="startVideo"
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
                  >
                    <img src="../../assets/play-btn.png" alt="播放" class="w-16 h-16" />
                    <span
                      v-if="wasInterrupted"
                      class="absolute bottom-10 text-white text-lg font-bold"
                    >
                      继续从 {{ formatTime(lastPlayedTime) }} 开始播放
                    </span>
                  </div>

                  <!-- 不活跃提示 -->
                  <div
                    v-if="showInactiveWarning"
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
                  >
                    <div class="text-center text-white">
                      <p class="text-xl mb-4">检测到您已有一段时间未活动</p>
                      <p class="mb-6">视频已自动暂停，点击下方按钮继续观看</p>
                      <button
                        @click="resumeFromInactivity"
                        class="px-6 py-2 bg-blue-500 text-white rounded-full"
                      >
                        继续观看
                      </button>
                    </div>
                  </div>

                  <!-- 非活跃窗口提示 -->
                  <div
                    v-if="showWindowInactiveWarning"
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
                  >
                    <div class="text-center text-white">
                      <p
                        class="text-xl mb-4 cursor-pointer underline hover:text-blue-500"
                        @click="showWindowInactiveWarning = false"
                      >
                        返回学习页面
                      </p>
                      <p class="mb-6">检测到您正在使用其他窗口，视频已自动暂停</p>
                    </div>
                  </div>
                </div>

                <!-- PDF 展示 -->
                <div
                  v-else-if="currentSection.fileType === '2'"
                  class="relative rounded-lg overflow-hidden bg-gray-100"
                  style="height: 800px"
                >
                  <iframe
                    :src="currentSection.fileUrl"
                    class="w-full h-full"
                    frameborder="0"
                  ></iframe>
                </div>
              </div>
              <div
                v-else
                class="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-200 to-blue-400 aspect-video"
              >
                <div class="absolute inset-0 flex items-center justify-center text-white">
                  <div class="text-center">
                    <p>请从右侧选择要学习的内容</p>
                  </div>
                </div>
              </div>

              <!-- 视频模式下课程推荐 -->
              <div v-if="!currentSection || currentSection.fileType === '1'" class="mt-8">
                <h3
                  class="text-xl font-bold text-black border-l-8 border-[#1771FD] pl-2 mb-4"
                >
                  课程推荐
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    v-for="recommendedCourse in recommendedCourses.slice(0, 3)"
                    :key="recommendedCourse.id"
                    class="bg-white rounded-md shadow-md overflow-hidden"
                  >
                    <img
                      :src="recommendedCourse.cover"
                      alt="课程图片"
                      class="w-full h-32 object-cover"
                    />
                    <div class="p-4">
                      <h4 class="text-lg font-bold text-black mb-2">
                        {{ recommendedCourse.courseName }}
                      </h4>
                      <p class="text-gray-600 mb-2">
                        分类：{{ recommendedCourse.categoryName }}
                      </p>
                      <button
                        @click="navigateToCourse(recommendedCourse.id)"
                        class="w-full bg-blue-500 text-white py-1 rounded-full hover:bg-blue-600 transition text-center"
                      >
                        立即学习
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 课程章节 -->
            <div
              :class="{
                'md:col-span-1': !currentSection || currentSection.fileType === '1',
                'md:col-span-1': currentSection && currentSection.fileType === '2',
              }"
            >
              <div class="bg-gray-100 p-4 rounded-lg overflow-hidden flex flex-col">
                <div
                  class="flex items-center justify-between py-3 border-b border-dashed border-gray-600 mb-4"
                >
                  <h3 class="font-bold text-gray-700">课程章节</h3>
                  <IoChevronDownOutline class="w-5 h-5 text-gray-500" />
                </div>

                <!-- 章节列表 -->
                <div
                  v-if="
                    courseDetail.catalogueList && courseDetail.catalogueList.length > 0
                  "
                  class="flex flex-col gap-4 overflow-y-auto custom-scrollbar"
                  style="max-height: 600px"
                >
                  <div
                    v-for="catalogue in courseDetail.catalogueList"
                    :key="catalogue.id"
                    class="mb-4"
                  >
                    <div class="font-bold text-gray-700 mb-2">
                      {{ catalogue.catalogueName }}
                    </div>

                    <!-- 小节列表 -->
                    <div
                      v-for="section in catalogue.sectionFileList"
                      :key="section.id"
                      class="p-4 mb-2 cursor-pointer"
                      :class="{
                        'bg-[#1771FD] text-white':
                          currentSection && currentSection.id === section.id,
                        'bg-white text-white':
                          currentSection && currentSection.id != section.id,
                        'opacity-60': !section.unlocked,
                      }"
                      @click="section.unlocked && selectSection(section)"
                    >
                      <div class="flex justify-between items-start mb-2">
                        <h4
                          class="font-bold"
                          :class="
                            currentSection && currentSection.id === section.id
                              ? 'text-white'
                              : 'text-black'
                          "
                        >
                          {{ section.sectionName }}
                        </h4>
                      </div>
                      <div
                        class="flex justify-between items-center mb-2"
                        :class="
                          currentSection && currentSection.id === section.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        "
                      >
                        <span>{{ section.fileType === "1" ? "视频" : "PDF文档" }}</span>
                        <span>进度: {{ getCachedProgress(section) }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          class="h-full rounded-full"
                          :class="
                            currentSection && currentSection.id === section.id
                              ? 'bg-blue-200'
                              : 'bg-[#1771FD]'
                          "
                          :style="{
                            width: `${getCachedProgress(section)}%`,
                          }"
                        ></div>
                      </div>
                      <div
                        v-if="!section.unlocked"
                        class="text-red-500 flex items-center mt-4"
                      >
                        <IoLockClosedOutline class="w-4 h-4" />
                        当前课程未解锁
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4 text-gray-500">
                  没有可用的课程内容
                </div>

                <!-- PDF模式下课程推荐 -->
                <div
                  v-if="currentSection && currentSection.fileType === '2'"
                  class="mt-4"
                >
                  <h3
                    class="text-xl font-bold text-black border-l-4 border-[#1771FD] pl-2 mb-4"
                  >
                    课程推荐
                  </h3>
                  <div class="flex flex-col gap-4">
                    <div
                      v-for="recommendedCourse in recommendedCourses.slice(0, 4)"
                      :key="recommendedCourse.id"
                      class="bg-white rounded-md shadow-md overflow-hidden"
                    >
                      <div class="flex items-center p-2">
                        <img
                          :src="recommendedCourse.cover"
                          alt="课程图片"
                          class="w-20 h-16 object-cover rounded mr-2"
                        />
                        <div class="flex-1">
                          <h4 class="text-sm font-bold text-black mb-1 line-clamp-1">
                            {{ recommendedCourse.courseName }}
                          </h4>
                          <p class="text-xs text-gray-600 mb-1">
                            {{ recommendedCourse.categoryName }}
                          </p>
                          <button
                            @click="navigateToCourse(recommendedCourse.id)"
                            class="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded-full hover:bg-blue-600 transition text-center"
                          >
                            立即学习
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'intro'" class="prose max-w-none">
            <h2>课程介绍</h2>
            <p>{{ courseDetail.content || "暂无课程介绍" }}</p>
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
import { ref, onMounted, watch, onUnmounted, computed, nextTick } from "vue";
import { FiStar } from "vue-icons-plus/fi";
import { EpChatDotSquare } from "vue-icons-plus/ep";
import { IpGoodTwo } from "vue-icons-plus/ip";
import { PiShareBold } from "vue-icons-plus/pi";
import { IoChevronDownOutline, IoLockClosedOutline } from "vue-icons-plus/io";
import { useRoute, useRouter } from "vue-router";
import { getCourseDetail, saveLearningProgress } from "@/api/course";
import QaList from "./components/qaList.vue";
import QaDetail from "./components/qaDetail.vue";

const route = useRoute();
const router = useRouter();
const courseId = ref(route.params.id);
const courseDetail = ref({});
const loading = ref(false);
const videoPlayer = ref(null);
const progressTimer = ref(null);

// 视频控制状态
const isPlaying = ref(false);
const wasInterrupted = ref(false);
const lastPlayedTime = ref(0);
const activityTimerId = ref(null);
const inactivityTimeout = 3 * 60 * 1000; // 3分钟无活动自动暂停
const showInactiveWarning = ref(false);
const showWindowInactiveWarning = ref(false);
const lastActivityTime = ref(Date.now());
const userActivityEvents = ["mousemove", "mousedown", "keypress", "touchstart", "scroll"];
const allowedSeekTime = ref(0); // 允许的拖拽位置
const isMuted = ref(false);

// 添加响应式变量跟踪视频当前进度和总时长
const currentVideoTime = ref(0);
const totalVideoDuration = ref(0);

// 当前选中的章节
const currentSection = ref(null);

// Mock 推荐课程数据
const recommendedCourses = ref([
  {
    id: "1",
    courseName: "警务实战技能训练",
    categoryName: "实战技能",
    cover: require("../../assets/1.png"),
  },
  {
    id: "2",
    courseName: "公安法律法规解读",
    categoryName: "法律法规",
    cover: require("../../assets/2.png"),
  },
  {
    id: "3",
    courseName: "信息化警务建设",
    categoryName: "信息技术",
    cover: require("../../assets/3.png"),
  },
  {
    id: "4",
    courseName: "刑事案件调查技巧",
    categoryName: "刑事侦查",
    cover: require("../../assets/4.png"),
  },
  {
    id: "5",
    courseName: "警务心理学基础",
    categoryName: "心理学",
    cover: require("../../assets/5.png"),
  },
]);

// 标签页数据
const tabs = [
  { id: "learning", name: "课程学习" },
  { id: "intro", name: "课程介绍" },
  { id: "qa", name: "课程问答", count: 1 },
];

const activeTab = ref("learning");
const showQaDetail = ref(false);
const currentQuestion = ref(null);

// 计算视频播放进度
const videoProgress = computed(() => {
  if (totalVideoDuration.value === 0) return 0;
  return Math.min(
    100,
    Math.max(0, Math.round((currentVideoTime.value / totalVideoDuration.value) * 100))
  );
});

// 计算允许观看的进度
const allowedProgress = computed(() => {
  if (totalVideoDuration.value === 0 || !currentSection.value) return 0;
  return Math.min(
    100,
    Math.max(
      0,
      Math.round((currentSection.value.learnedSeconds / totalVideoDuration.value) * 100)
    )
  );
});

// 切换静音
const toggleMute = () => {
  if (!videoPlayer.value) return;
  videoPlayer.value.muted = !videoPlayer.value.muted;
  isMuted.value = videoPlayer.value.muted;
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

// 开始播放视频
const startVideo = () => {
  if (!videoPlayer.value) return;

  // 如果有上次播放位置，从上次位置继续
  if (wasInterrupted.value && lastPlayedTime.value > 0) {
    videoPlayer.value.currentTime = lastPlayedTime.value;
    currentVideoTime.value = lastPlayedTime.value;
  } else if (currentSection.value && currentSection.value.learnedSeconds > 0) {
    // 从已学习进度开始播放
    videoPlayer.value.currentTime = currentSection.value.learnedSeconds;
    currentVideoTime.value = currentSection.value.learnedSeconds;
  }

  videoPlayer.value
    .play()
    .then(() => {
      isPlaying.value = true;
      wasInterrupted.value = false;
      allowedSeekTime.value = videoPlayer.value.currentTime;
      startActivityMonitoring();
    })
    .catch((error) => {
      console.error("视频播放失败:", error);
    });
};

// 暂停视频
const pauseVideo = (saveCurrentTime = true) => {
  if (!videoPlayer.value) return;

  if (saveCurrentTime) {
    lastPlayedTime.value = videoPlayer.value.currentTime;
    wasInterrupted.value = true;
  }

  videoPlayer.value.pause();
  isPlaying.value = false;
  stopActivityMonitoring();
};

// 开始活动监控
const startActivityMonitoring = () => {
  // 记录用户活动
  userActivityEvents.forEach((event) => {
    window.addEventListener(event, recordUserActivity);
  });

  // 检测窗口活动状态
  document.addEventListener("visibilitychange", checkWindowActivity);

  // 设置活动监测计时器
  activityTimerId.value = setInterval(checkUserActivity, 10000); // 每10秒检查一次

  // 初始化活动时间
  lastActivityTime.value = Date.now();
  showInactiveWarning.value = false;
  showWindowInactiveWarning.value = false;
};

// 停止活动监控
const stopActivityMonitoring = () => {
  if (activityTimerId.value) {
    clearInterval(activityTimerId.value);
    activityTimerId.value = null;
  }

  userActivityEvents.forEach((event) => {
    window.removeEventListener(event, recordUserActivity);
  });

  document.removeEventListener("visibilitychange", checkWindowActivity);
};

// 记录用户活动
const recordUserActivity = () => {
  lastActivityTime.value = Date.now();
  if (showInactiveWarning.value) {
    showInactiveWarning.value = false;
  }
};

// 检查用户活动状态
const checkUserActivity = () => {
  if (!isPlaying.value) return;

  const now = Date.now();
  const timeSinceLastActivity = now - lastActivityTime.value;

  // 如果超过无活动时间，暂停视频
  if (timeSinceLastActivity >= inactivityTimeout) {
    pauseVideo();
    showInactiveWarning.value = true;
  }
};

// 检查窗口活动状态
const checkWindowActivity = () => {
  if (!isPlaying.value) return;

  if (document.hidden) {
    pauseVideo();
    showWindowInactiveWarning.value = true;
  } else {
    showWindowInactiveWarning.value = false;
  }
};

// 从不活跃状态恢复
const resumeFromInactivity = () => {
  showInactiveWarning.value = false;
  startVideo();
};

// 处理拖拽事件
const handleSeeking = () => {
  if (!videoPlayer.value || !currentSection.value) return;

  const currentTime = videoPlayer.value.currentTime;

  // 如果尝试拖拽到已学习进度之后的位置，阻止跳跃
  if (currentTime > currentSection.value.learnedSeconds + 5) {
    // 允许5秒的宽容
    videoPlayer.value.currentTime = allowedSeekTime.value;
  } else {
    // 更新允许的拖拽位置
    allowedSeekTime.value = currentTime;
  }
};

// 加载课程详情
const loadCourseDetail = async () => {
  loading.value = true;
  try {
    const res = await getCourseDetail(courseId.value);
    if (res.code === 0 && res.data) {
      courseDetail.value = res.data;

      // 确保所有章节的进度值为数字类型
      if (
        courseDetail.value.catalogueList &&
        courseDetail.value.catalogueList.length > 0
      ) {
        courseDetail.value.catalogueList.forEach((catalogue) => {
          if (catalogue.sectionFileList && catalogue.sectionFileList.length > 0) {
            catalogue.sectionFileList.forEach((section) => {
              // 确保进度数据是数字类型
              section.learnedSeconds = Number(section.learnedSeconds) || 0;

              // 确保有合理的总学习时长值
              const needTime = Number(section.needLearnSeconds) || 0;
              if (needTime < 10) {
                // 如果总时长不合理，设置一个默认值
                console.warn(
                  `章节${section.id}的needLearnSeconds值异常(${needTime})，设置默认值`
                );
                section.needLearnSeconds = 100; // 默认设置为100秒
              } else {
                section.needLearnSeconds = needTime;
              }

              // 确保学习进度不超过总时长
              if (section.learnedSeconds > section.needLearnSeconds) {
                console.warn(
                  `章节${section.id}的已学习时长(${section.learnedSeconds})超过总时长(${section.needLearnSeconds})，进行修正`
                );
                section.learnedSeconds = section.needLearnSeconds;
              }
            });
          }
        });

        // 尝试找到第一个解锁的章节作为初始可观看内容
        const firstCatalogue = courseDetail.value.catalogueList[0];
        if (firstCatalogue.sectionFileList && firstCatalogue.sectionFileList.length > 0) {
          const unlockedSection = firstCatalogue.sectionFileList.find(
            (section) => section.unlocked
          );
          if (unlockedSection) {
            selectSection(unlockedSection);
          }
        }
      }
    }
  } catch (error) {
    console.error("加载课程详情失败:", error);
  } finally {
    loading.value = false;
  }
};

// 选择学习的章节
const selectSection = (section) => {
  // 如果正在播放视频，先停止
  if (isPlaying.value) {
    pauseVideo(false);
  }

  // 重置视频状态
  isPlaying.value = false;
  wasInterrupted.value = false;
  lastPlayedTime.value = 0;
  showInactiveWarning.value = false;
  showWindowInactiveWarning.value = false;
  currentVideoTime.value = 0;
  totalVideoDuration.value = 0;

  // 清除进度缓存
  clearProgressCache();

  // 更新当前章节
  currentSection.value = section;
  allowedSeekTime.value = section.learnedSeconds || 0;

  // 如果是视频，添加一次性事件监听器等待元数据加载
  if (section.fileType === "1") {
    // 使用nextTick确保DOM更新后再添加事件监听
    nextTick(() => {
      if (videoPlayer.value) {
        // 如果视频已经有元数据，直接处理
        if (videoPlayer.value.readyState >= 1) {
          handleMetadataLoaded();
        }
      }
    });
  }
};

// 处理视频播放进度更新
const handleTimeUpdate = () => {
  if (!videoPlayer.value || !currentSection.value) return;

  // 更新响应式变量，触发计算属性重新计算
  currentVideoTime.value = videoPlayer.value.currentTime;
  if (totalVideoDuration.value === 0 && videoPlayer.value.duration > 0) {
    totalVideoDuration.value = videoPlayer.value.duration;

    // 如果服务器返回的总时长不正确，使用实际视频时长更新它
    if (currentSection.value.needLearnSeconds < 10 && totalVideoDuration.value > 10) {
      console.log(
        `更新当前章节${currentSection.value.id}的总时长: ${
          currentSection.value.needLearnSeconds
        } -> ${Math.floor(totalVideoDuration.value)}`
      );
      currentSection.value.needLearnSeconds = Math.floor(totalVideoDuration.value);
    }
  }

  const currentTime = Math.floor(videoPlayer.value.currentTime);

  // 只允许记录连续播放的进度，且不超过视频总时长
  if (
    currentTime > currentSection.value.learnedSeconds &&
    currentTime <= allowedSeekTime.value + 5
  ) {
    // 确保保存的是数字类型且不超过视频总时长
    const totalTime = Math.max(
      totalVideoDuration.value,
      currentSection.value.needLearnSeconds
    );
    currentSection.value.learnedSeconds = Math.min(Number(currentTime), totalTime);
    allowedSeekTime.value = Number(currentTime);

    // 更新当前章节的进度缓存
    const progress = calculateProgress(currentSection.value);
    updateProgressCache(currentSection.value.id, progress);

    // 每30秒保存一次进度
    if (currentTime % 30 === 0) {
      saveProgress();
    }
  }
};

// 处理视频元数据加载
const handleMetadataLoaded = () => {
  if (!videoPlayer.value || !currentSection.value) return;

  const duration = videoPlayer.value.duration || 0;
  totalVideoDuration.value = duration;

  console.log(
    `视频元数据加载完成 - 章节${currentSection.value.id} - 实际时长: ${duration}秒, 配置时长: ${currentSection.value.needLearnSeconds}秒`
  );

  // 每次加载元数据时，都检查并更新总学习时长
  if (duration > 10) {
    // 如果视频实际时长与配置时长差异较大，使用实际时长
    if (
      Math.abs(duration - currentSection.value.needLearnSeconds) > 5 ||
      currentSection.value.needLearnSeconds < 10
    ) {
      console.log(
        `更新章节${currentSection.value.id}的总时长为视频实际时长: ${Math.floor(
          duration
        )}秒 (原配置: ${currentSection.value.needLearnSeconds}秒)`
      );
      currentSection.value.needLearnSeconds = Math.floor(duration);

      // 查找所有catalogueList中相同ID的章节并更新
      if (courseDetail.value && courseDetail.value.catalogueList) {
        courseDetail.value.catalogueList.forEach((catalogue) => {
          if (catalogue.sectionFileList) {
            catalogue.sectionFileList.forEach((section) => {
              if (section.id === currentSection.value.id) {
                section.needLearnSeconds = Math.floor(duration);
              }
            });
          }
        });
      }

      // 清除进度缓存，确保重新计算
      clearProgressCache();
    }
  }
};

// 处理视频播放结束
const handleVideoEnded = () => {
  if (!currentSection.value) return;

  // 视频播放完毕，将学习时间设为总时长
  currentSection.value.learnedSeconds = currentSection.value.needLearnSeconds;
  saveProgress();

  // 重置播放状态
  isPlaying.value = false;
  stopActivityMonitoring();

  // 尝试解锁并播放下一个视频
  tryPlayNextSection();
};

// 尝试播放下一个小节
const tryPlayNextSection = () => {
  if (!courseDetail.value || !courseDetail.value.catalogueList || !currentSection.value)
    return;

  // 找到当前小节所在的章
  const currentCatalogue = courseDetail.value.catalogueList.find(
    (catalogue) => catalogue.id === currentSection.value.catalogueId.toString()
  );

  if (!currentCatalogue) return;

  // 找到当前小节在章中的索引
  const currentIndex = currentCatalogue.sectionFileList.findIndex(
    (section) => section.id === currentSection.value.id
  );

  if (currentIndex === -1) return;

  // 如果有下一个小节
  if (currentIndex < currentCatalogue.sectionFileList.length - 1) {
    const nextSection = currentCatalogue.sectionFileList[currentIndex + 1];

    // 解锁下一个小节
    nextSection.unlocked = true;

    // 自动切换到下一个小节
    selectSection(nextSection);
    return;
  }

  // 如果当前章节已经是最后一个小节，尝试切换到下一章
  const currentCatalogueIndex = courseDetail.value.catalogueList.findIndex(
    (catalogue) => catalogue.id === currentCatalogue.id
  );

  if (currentCatalogueIndex < courseDetail.value.catalogueList.length - 1) {
    const nextCatalogue = courseDetail.value.catalogueList[currentCatalogueIndex + 1];
    if (nextCatalogue.sectionFileList && nextCatalogue.sectionFileList.length > 0) {
      const firstSection = nextCatalogue.sectionFileList[0];

      // 解锁下一章的第一个小节
      firstSection.unlocked = true;

      // 自动切换到下一章的第一个小节
      selectSection(firstSection);
    }
  }
};

// 保存学习进度
const saveProgress = async () => {
  if (!currentSection.value) return;

  try {
    // 确保learnedSeconds不超过总时长
    const learnedSeconds = Math.min(
      currentSection.value.learnedSeconds,
      currentSection.value.needLearnSeconds
    );

    await saveLearningProgress(
      currentSection.value.courseId,
      currentSection.value.id,
      learnedSeconds
    );
    console.log(
      `学习进度保存成功: ${learnedSeconds}/${currentSection.value.needLearnSeconds}秒`
    );
  } catch (error) {
    console.error("保存学习进度失败:", error);
  }
};

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

// 导航到课程详情页面
const navigateToCourse = (id) => {
  // 如果是同一个课程，强制刷新页面
  if (id === courseId.value) {
    // 重新加载课程数据
    loadCourseDetail();
  } else {
    // 跳转到新课程
    router.push(`/course/view/${id}`);
  }
};

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId !== courseId.value) {
      courseId.value = newId;
      // 重置状态
      currentSection.value = null;
      courseDetail.value = {};
      // 加载新课程数据
      loadCourseDetail();
    }
  }
);

// 页面加载时获取课程信息
onMounted(() => {
  loadCourseDetail();

  // 设置定时器，每分钟保存一次学习进度
  progressTimer.value = setInterval(() => {
    if (currentSection.value) {
      saveProgress();
    }
  }, 60000);
});

// 组件销毁时清除资源
onUnmounted(() => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value);
  }

  stopActivityMonitoring();
});

// 计算章节进度
const calculateProgress = (section) => {
  if (!section) return 0;

  // 确保learnedSeconds和needLearnSeconds存在且为数字
  const learnedSeconds = Number(section.learnedSeconds) || 0;

  // 关键点：检查数据是否合理，防止错误的needLearnSeconds导致进度错误
  let needLearnSeconds = Number(section.needLearnSeconds) || 0;

  // 如果需要的学习时长是0或过小的值，但正在播放的是当前章节，使用视频总时长
  if (
    needLearnSeconds < 10 &&
    currentSection.value &&
    currentSection.value.id === section.id &&
    totalVideoDuration.value > 0
  ) {
    needLearnSeconds = Math.floor(totalVideoDuration.value);
    // 只对当前播放章节记录警告
    if (section.id === currentSection.value.id) {
      console.warn(
        `当前章节${section.id}的needLearnSeconds值过小(${section.needLearnSeconds})，使用视频实际时长${needLearnSeconds}代替`
      );
    }
  } else if (needLearnSeconds < 10) {
    // 为避免除以小数导致的异常百分比，设置一个合理的最小值
    needLearnSeconds = 100;
    // 只对当前播放章节记录警告
    if (section.id === currentSection.value?.id) {
      console.warn(
        `当前章节${section.id}的needLearnSeconds值过小(${section.needLearnSeconds})，使用默认值100代替`
      );
    }
  }

  // 确保不超过needLearnSeconds和100%
  const actualLearned = Math.min(learnedSeconds, needLearnSeconds);
  const percent = Math.min(
    100,
    Math.max(0, Math.floor((actualLearned / needLearnSeconds) * 100))
  );

  // 只对当前播放章节输出详细日志
  if (section.id === currentSection.value?.id) {
    console.log(
      `当前章节${section.id}进度: ${learnedSeconds}/${needLearnSeconds} = ${percent}%(实际使用值: ${actualLearned}/${needLearnSeconds})`
    );
  }

  return percent;
};

// 记录计算过的章节进度，避免重复计算和日志
const progressCache = ref(new Map());

// 获取缓存的章节进度，如果没有则计算并缓存
const getCachedProgress = (section) => {
  // 如果是当前播放的章节，总是重新计算以获取最新进度
  if (section.id === currentSection.value?.id) {
    return calculateProgress(section);
  }

  // 对其他章节使用缓存
  if (!progressCache.value.has(section.id)) {
    const progress = calculateProgress(section);
    progressCache.value.set(section.id, progress);
  }

  return progressCache.value.get(section.id);
};

// 清除进度缓存
const clearProgressCache = () => {
  progressCache.value.clear();
};

// 更新进度缓存中特定章节的值
const updateProgressCache = (sectionId, progress) => {
  progressCache.value.set(sectionId, progress);
};
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

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #1771fd #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #1771fd;
  border-radius: 4px;
}
</style>
