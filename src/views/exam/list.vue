<template>
  <div class="h-[230px] relative overflow-hidden w-full banner">
    <div class="h-full flex items-center justify-center">
      <div class="text"></div>
    </div>
  </div>
  <div class="mx-auto">
    <div class="bg-white w-full px-4 py-6 mb-6">
      <!-- 考试导航和搜索 -->
      <div class="flex justify-between items-center container">
        <div class="flex space-x-2 bg-[#1771FD] p-[5px] mb-4">
          <button
            class="px-4 py-1 text-white rounded-md"
            :class="{ 'bg-white text-[#1771FD]': activeTab === 'center' }"
            @click="activeTab = 'center'"
          >
            考试中心
          </button>
          <button
            class="px-4 py-1 text-white rounded-md"
            :class="{ 'bg-white text-[#1771FD]': activeTab === 'my' }"
            @click="activeTab = 'my'"
          >
            我的考试
          </button>
        </div>

        <div class="relative">
          <input
            type="text"
            placeholder="请输入考试名称"
            class="border border-gray-300 rounded-md pl-3 pr-10 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-[#1771FD]"
          />
          <button
            class="absolute right-0 top-0 h-full w-10 bg-[#1771FD] rounded-r-md flex items-center justify-center"
          >
            <CgSearch class="text-white w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 考试中心模块 -->
    <template v-if="activeTab === 'center'">
      <!-- 考试列表 -->
      <div class="flex flex-col gap-4">
        <div
          v-for="(exam, index) in myExams"
          :key="index"
          class="bg-white rounded-lg overflow-hidden container"
        >
          <div class="p-4 flex flex-col md:flex-row items-start gap-4">
            <!-- 考试图片 -->
            <div class="w-48 flex-shrink-0">
              <img
                src="../../assets/exam-sample.png"
                alt="考试图片"
                class="w-full h-auto"
              />
            </div>

            <!-- 考试信息 -->
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                {{ exam.title }}
              </h3>

              <div class="flex flex-col gap-2 mb-2">
                <div class="text-gray-600">
                  <span>考试时间：</span>
                  <span>{{ exam.timeRange }}</span>
                </div>
                <div class="text-gray-600">
                  <span>考试状态：</span>
                  <span
                    :class="{
                      'text-green-500': exam.status === '已通过',
                      'text-red-500': exam.status === '未通过',
                      'text-[#1771FD]': exam.status === '未参加',
                    }"
                    >{{ exam.status }}</span
                  >
                </div>
                <div class="text-gray-600">
                  <span>考试成绩：</span>
                  <span
                    :class="{
                      'text-green-500': exam.score >= 60,
                      'text-red-500': exam.score < 60,
                    }"
                    >{{ exam.score }}分</span
                  >
                </div>
              </div>

              <div
                class="flex justify-between flex-wrap gap-x-8 gap-y-2 text-[#1771FD] border-t py-2 border-gray-100"
              >
                <div>
                  <span>时长：</span>
                  <span>{{ exam.duration }}分钟</span>
                </div>
                <div>
                  <span>总分：</span>
                  <span>{{ exam.totalScore }}分</span>
                </div>
                <div>
                  <span>及格分：</span>
                  <span>{{ exam.passingScore }}分</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex-shrink-0 self-center mt-2 md:mt-0">
              <button
                class="bg-[#1771FD] text-white px-8 py-1 rounded-full hover:bg-blue-600 transition"
                @click="openExamModal(exam)"
              >
                去考试
              </button>
            </div>
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
          :class="
            page === 1 ? 'bg-[#1771FD] text-white' : 'text-black hover:text-[#1771FD]'
          "
        >
          {{ page }}
        </button>
        <button class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center">
          下一页<CgChevronRight class="w-4 h-4 ml-1" />
        </button>
        <button class="px-3 py-1 text-black hover:text-[#1771FD]">尾页</button>
      </div>
    </template>

    <!-- 我的考试模块 -->
    <template v-else-if="activeTab === 'my'">
      <div class="flex flex-col gap-4">
        <div
          v-for="(exam, index) in myExams"
          :key="index"
          class="bg-white rounded-lg overflow-hidden container"
        >
          <div class="p-4 flex flex-col md:flex-row items-start gap-4">
            <!-- 考试图片和状态标签 -->
            <div class="w-48 flex-shrink-0 relative">
              <div
                class="absolute top-0 left-0 px-2 py-1 text-sm text-white font-bold rounded-tl-lg"
                :class="{
                  'bg-orange-500': exam.statusTag === '已出分',
                  'bg-green-500': exam.statusTag === '考试中',
                  'bg-[#1771FD]': exam.statusTag === '待阅卷',
                  'bg-purple-500': exam.statusTag === '阅卷中',
                  'bg-gray-500': exam.statusTag === '未开始',
                }"
              >
                {{ exam.statusTag }}
              </div>
              <img
                src="../../assets/exam-sample.png"
                alt="考试图片"
                class="w-full h-full"
              />
            </div>

            <!-- 考试信息 -->
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                {{ exam.title }}
              </h3>

              <div class="flex flex-col gap-2 mb-2">
                <div class="text-gray-600">
                  <span>考试时间：</span>
                  <span>{{ exam.timeRange }}</span>
                </div>
                <div class="text-gray-600">
                  <span>考试时长：</span>
                  <span>{{ exam.duration }}分钟</span>
                </div>
                <div class="text-gray-600">
                  <span>试卷总分：</span>
                  <span>{{ exam.totalScore }}分</span>
                </div>
                <div class="text-gray-600 flex justify-between">
                  <div>
                    <span>及格分数：</span>
                    <span>{{ exam.passingScore }}分</span>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex-shrink-0 self-center mt-2 md:mt-0 flex flex-col gap-2">
                    <div
                      v-if="exam.statusTag === '已出分' || exam.statusTag === '阅卷中'"
                      class="flex gap-2"
                    >
                      <button
                        class="bg-[#1771FD] text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition mb-2 w-24"
                        @click="goToExamReview(exam.id)"
                      >
                        考试记录
                      </button>
                    </div>
                    <div v-else-if="exam.statusTag === '未开始'">
                      <button
                        class="bg-[#1771FD] text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition w-24"
                        @click="openExamModal(exam)"
                      >
                        去考试
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 考试结果信息 -->
              <div class="mt-3 bg-blue-50 rounded-md overflow-hidden">
                <div class="grid grid-cols-3 text-center">
                  <div class="py-2 px-4 bg-[#1771FD] text-white">
                    <div>我的得分：{{ exam.myScore }}</div>
                  </div>
                  <div class="py-2 px-4 bg-[#1771FD] text-white">
                    <div>通过情况：{{ exam.passStatus }}</div>
                  </div>
                  <div class="py-2 px-4 bg-[#1771FD] text-white">
                    <div>考试机会：{{ exam.attempts }}</div>
                  </div>
                </div>
              </div>
            </div>
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
          :class="
            page === 1 ? 'bg-[#1771FD] text-white' : 'text-black hover:text-[#1771FD]'
          "
        >
          {{ page }}
        </button>
        <button class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center">
          下一页<CgChevronRight class="w-4 h-4 ml-1" />
        </button>
        <button class="px-3 py-1 text-black hover:text-[#1771FD]">尾页</button>
      </div>
    </template>
  </div>

  <!-- 考试信息弹窗 -->
  <ExamInfoModal
    v-if="showExamModal"
    :exam="selectedExam"
    @close="showExamModal = false"
    @start="startExam"
  />
</template>

<script setup>
import { ref } from "vue";
import { CgChevronLeft, CgChevronRight } from "vue-icons-plus/cg";
import { CgSearch } from "vue-icons-plus/cg";
import { useRouter } from "vue-router";
import ExamInfoModal from "./components/examInfoModal.vue";

// 使用 useRouter 钩子
const router = useRouter();

// 考试弹窗状态
const showExamModal = ref(false);
const selectedExam = ref(null);

// 打开考试弹窗
const openExamModal = (exam) => {
  selectedExam.value = {
    ...exam,
    image: "../../assets/exam-sample.png",
    type: "笔试考试",
    rules: [
      "考试开始后，请勿刷新页面或关闭浏览器，否则可能导致考试中断。",
      "考试过程中请勿切换标签页或打开其他窗口，系统将记录切屏次数。",
      "提交试卷后将无法修改答案，请在提交前确认所有题目已作答。",
      "考试时间结束后，系统将自动提交当前已作答的试题。",
      "如遇技术问题，请立即联系管理员寻求帮助。",
    ],
  };
  showExamModal.value = true;
};

// 开始考试
const startExam = () => {
  console.log("开始考试:", selectedExam.value);
  showExamModal.value = false;
  // 跳转到考试页面
  router.push({ path: "/exam/start/" + selectedExam.value.id });
};

// 跳转到考试记录页面
const goToExamReview = (examId) => {
  router.push({ path: "/exam/review/" + examId });
};

// 考试状态筛选
const examStatus = ref([
  { name: "全部", active: true },
  { name: "未开始", active: false },
  { name: "已完成", active: false },
]);

// 考试类型筛选
const examTypes = ref([
  { name: "全部", active: true },
  { name: "日常练习", active: false },
  { name: "月度测评", active: false },
  { name: "专项考试", active: false },
]);

// 我的考试数据
const myExams = ref([
  {
    id: 1,
    title: "笔面过考-全程考试",
    timeRange: "2025-04-30 09:59:31 ~ 2025-04-30 09:59:31",
    status: "已通过",
    score: 85,
    duration: "30",
    totalScore: "100",
    passingScore: "60",
    image: "/exam-image.jpg",
    statusTag: "已出分",
    myScore: "85",
    passStatus: "通过",
    attempts: "1/3",
  },
  {
    id: 2,
    title: "笔面过考-全程考试",
    timeRange: "2025-04-30 09:59:31 ~ 2025-04-30 09:59:31",
    status: "未通过",
    score: 45,
    duration: "30",
    totalScore: "100",
    passingScore: "60",
    image: "/exam-image.jpg",
    statusTag: "已出分",
    myScore: "45",
    passStatus: "未通过",
    attempts: "1/3",
  },
  {
    id: 3,
    title: "笔面过考-全程考试",
    timeRange: "2025-04-30 09:59:31 ~ 2025-04-30 09:59:31",
    status: "未参加",
    score: 0,
    duration: "30",
    totalScore: "100",
    passingScore: "60",
    image: "/exam-image.jpg",
    statusTag: "未开始",
    myScore: "0",
    passStatus: "未参加",
    attempts: "0/3",
  },
]);

const activeTab = ref("center");

const policeTypes = ref([
  { name: "全部", active: true },
  { name: "刑侦", active: false },
  { name: "网安", active: false },
  { name: "科信", active: false },
]);

const difficulties = ref([
  { name: "全部", active: true },
  { name: "简单", active: false },
  { name: "中等", active: false },
  { name: "困难", active: false },
]);

const categories = ref([
  { name: "全部", active: true },
  { name: "公安基础", active: false },
  { name: "法律法规", active: false },
  { name: "专业技能", active: false },
]);

// 模拟考试数据
const exams = ref(
  Array(12)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      title: ["公安基础知识测试", "法律法规考核", "专业技能评估", "综合素质测评"][
        index % 4
      ],
      category: ["公安基础", "法律法规", "专业技能", "综合素质"][index % 4],
      difficulty: ["简单", "中等", "困难"][index % 3],
      questionCount: [50, 80, 100, 120][index % 4],
      duration: [45, 60, 90, 120][index % 4],
      image: "/course-image.jpg",
    }))
);

const toggleFilter = (filterType, index) => {
  if (filterType === "policeTypes") {
    policeTypes.value = policeTypes.value.map((item, i) => ({
      ...item,
      active: i === index,
    }));
  } else if (filterType === "difficulties") {
    difficulties.value = difficulties.value.map((item, i) => ({
      ...item,
      active: i === index,
    }));
  } else if (filterType === "categories") {
    categories.value = categories.value.map((item, i) => ({
      ...item,
      active: i === index,
    }));
  } else if (filterType === "examStatus") {
    examStatus.value = examStatus.value.map((item, i) => ({
      ...item,
      active: i === index,
    }));
  } else if (filterType === "examTypes") {
    examTypes.value = examTypes.value.map((item, i) => ({
      ...item,
      active: i === index,
    }));
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "简单":
      return "text-green-500";
    case "中等":
      return "text-yellow-500";
    case "困难":
      return "text-red-500";
    default:
      return "";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "未开始":
      return "bg-blue-100 text-blue-600";
    case "已完成":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
.banner {
  background: url(../../assets/exam-bg.png) no-repeat center center;
  background-size: 100% 100%;
}
.banner .text {
  background: url(../../assets/exam-bg-text.png) no-repeat center center;
  width: 268px;
  height: 63px;
}
</style>
