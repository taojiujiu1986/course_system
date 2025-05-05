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
            class="px-4 py-1 rounded-md"
            :class="{
              'bg-white text-[#1771FD]': activeTab === 'center',
              'text-white': activeTab !== 'center',
            }"
            @click="activeTab = 'center'"
          >
            考试中心
          </button>
          <button
            class="px-4 py-1 rounded-md"
            :class="{
              'bg-white text-[#1771FD]': activeTab === 'my',
              'text-white': activeTab !== 'my',
            }"
            @click="activeTab = 'my'"
          >
            我的考试
          </button>
        </div>

        <div class="relative">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="请输入考试名称"
            class="border border-gray-300 rounded-md pl-3 pr-10 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-[#1771FD]"
            @keyup.enter="searchExam"
          />
          <button
            class="absolute right-0 top-0 h-full w-10 bg-[#1771FD] rounded-r-md flex items-center justify-center"
            @click="searchExam"
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
          v-for="(exam, index) in allExams"
          :key="index"
          class="bg-white rounded-lg overflow-hidden container"
        >
          <div class="p-4 flex flex-col md:flex-row items-start gap-4">
            <!-- 考试图片 -->
            <div class="w-48 flex-shrink-0">
              <img :src="exam.image" alt="考试图片" class="w-full h-auto" />
            </div>

            <!-- 考试信息 -->
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                {{ exam.examTitle }}
              </h3>

              <div class="flex flex-col gap-2 mb-2">
                <div class="text-gray-600">
                  <span>考试时间：</span>
                  <span
                    >{{ formatTimestamp(exam.startTime) }} ~
                    {{ formatTimestamp(exam.endTime) }}</span
                  >
                </div>
                <div class="text-gray-600">
                  <span>考试状态：</span>
                  <span
                    :class="{
                      'text-green-500': exam.status === 3,
                      'text-red-500': exam.status === 4,
                      'text-[#1771FD]': exam.status === 1,
                    }"
                    >{{ getExamStatus(exam.status) }}</span
                  >
                </div>
                <div class="text-gray-600">
                  <span>考试成绩：</span>
                  <span
                    :class="{
                      'text-green-500': exam.score >= exam.qualifyScore,
                      'text-red-500': exam.score < exam.qualifyScore,
                    }"
                    >{{ exam.score || 0 }}分</span
                  >
                </div>
              </div>

              <div
                class="flex justify-between flex-wrap gap-x-8 gap-y-2 text-[#1771FD] border-t py-2 border-gray-100"
              >
                <div>
                  <span>时长：</span>
                  <span>{{ exam.examTime }}分钟</span>
                </div>
                <div>
                  <span>总分：</span>
                  <span>{{ exam.totalScore }}分</span>
                </div>
                <div>
                  <span>及格分：</span>
                  <span>{{ exam.qualifyScore }}分</span>
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
        <button class="px-3 py-1 text-black hover:text-[#1771FD]" @click="changePage(1)">
          首页
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center"
          @click="
            pageParams.offset > 0
              ? changePage(Math.floor(pageParams.offset / pageParams.limit))
              : null
          "
          :disabled="pageParams.offset === 0"
        >
          <CgChevronLeft class="w-4 h-4 mr-1" />上一页
        </button>

        <!-- 页码按钮 -->
        <template v-if="totalPages > 0">
          <button
            v-for="page in getPaginationRange()"
            :key="page"
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="
              currentPage === page
                ? 'bg-[#1771FD] text-white'
                : 'text-black hover:text-[#1771FD]'
            "
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center"
          @click="currentPage < totalPages ? changePage(currentPage + 1) : null"
          :disabled="currentPage >= totalPages"
        >
          下一页<CgChevronRight class="w-4 h-4 ml-1" />
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD]"
          @click="changePage(totalPages)"
        >
          尾页
        </button>
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
              <img :src="exam.imageUrl" alt="考试图片" class="w-full h-full" />
            </div>

            <!-- 考试信息 -->
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-800 mb-2">
                {{ exam.examTitle }}
              </h3>

              <div class="flex flex-col gap-2 mb-2">
                <div class="text-gray-600">
                  <span>考试时间：</span>
                  <span
                    >{{ formatTimestamp(exam.startTime) }} ~
                    {{ formatTimestamp(exam.endTime) }}</span
                  >
                </div>
                <div class="text-gray-600">
                  <span>考试时长：</span>
                  <span>{{ exam.examTime }}分钟</span>
                </div>
                <div class="text-gray-600">
                  <span>试卷总分：</span>
                  <span>{{ exam.totalScore }}分</span>
                </div>
                <div class="text-gray-600 flex justify-between">
                  <div>
                    <span>及格分数：</span>
                    <span>{{ exam.qualifyScore }}分</span>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex-shrink-0 self-center mt-2 md:mt-0 flex flex-col gap-2">
                    <div class="flex gap-2">
                      <button
                        class="bg-[#1771FD] text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition mb-2 w-24"
                        @click="goToExamReview(exam.id)"
                      >
                        考试记录
                      </button>
                    </div>
                    <!-- <div v-else-if="exam.status === 1">
                      <button
                        class="bg-[#1771FD] text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition w-24"
                        @click="openExamModal(exam)"
                      >
                        去考试
                      </button>
                    </div> -->
                  </div>
                </div>
              </div>

              <!-- 考试结果信息 -->
              <div class="mt-3 bg-blue-50 rounded-md overflow-hidden">
                <div class="grid grid-cols-3 text-center">
                  <div class="py-2 px-4 bg-[#1771FD] text-white">
                    <div>我的得分：{{ exam.points || 0 }}</div>
                  </div>
                  <div class="py-2 px-4 bg-[#1771FD] text-white">
                    <div>
                      通过情况：{{
                        exam.points >= exam.qualifyScore ? "已通过" : "未通过"
                      }}
                    </div>
                  </div>
                  <div class="py-2 px-4 bg-[#1771FD] text-white">
                    <div>考试机会：{{ exam.chanceUsed || 0 }}/{{ exam.chance }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="flex justify-center items-center mt-8 space-x-2 mb-8">
        <button class="px-3 py-1 text-black hover:text-[#1771FD]" @click="changePage(1)">
          首页
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center"
          @click="
            pageParams.offset > 0
              ? changePage(Math.floor(pageParams.offset / pageParams.limit))
              : null
          "
          :disabled="pageParams.offset === 0"
        >
          <CgChevronLeft class="w-4 h-4 mr-1" />上一页
        </button>

        <!-- 页码按钮 -->
        <template v-if="totalPages > 0">
          <button
            v-for="page in getPaginationRange()"
            :key="page"
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="
              currentPage === page
                ? 'bg-[#1771FD] text-white'
                : 'text-black hover:text-[#1771FD]'
            "
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          class="px-3 py-1 text-black hover:text-[#1771FD] flex items-center"
          @click="currentPage < totalPages ? changePage(currentPage + 1) : null"
          :disabled="currentPage >= totalPages"
        >
          下一页<CgChevronRight class="w-4 h-4 ml-1" />
        </button>
        <button
          class="px-3 py-1 text-black hover:text-[#1771FD]"
          @click="changePage(totalPages)"
        >
          尾页
        </button>
      </div>
    </template>
  </div>

  <!-- 考试信息弹窗 -->
  <ExamInfoModal
    v-if="showExamModal"
    :examInfo="selectedExam"
    @close="showExamModal = false"
    @start="startExam"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { CgChevronLeft, CgChevronRight } from "vue-icons-plus/cg";
import { CgSearch } from "vue-icons-plus/cg";
import { useRouter } from "vue-router";
import ExamInfoModal from "./components/examInfoModal.vue";
import { getExamPageList, getStudentRecordPageList } from "@/api/pland";

// 使用 useRouter 钩子
const router = useRouter();

// 考试弹窗状态
const showExamModal = ref(false);
const selectedExam = ref(null);

// 打开考试弹窗
const openExamModal = (exam) => {
  // 直接使用API返回的字段
  selectedExam.value = {
    ...exam,
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
const goToExamReview = (id) => {
  router.push({ path: "/exam/review/" + id });
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

// 考试中心
const allExams = ref([]);
// 考试数据
const myExams = ref([]);
// 分页参数
const pageParams = ref({
  query: {},
  limit: 10,
  offset: 0,
  order: "createTime desc",
});
// 搜索关键词
const searchKeyword = ref("");

// 分页相关变量和函数
const currentPage = ref(1);
const totalItems = ref(0);
const totalPages = ref(0);

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 获取考试列表数据
const fetchExamList = async () => {
  if (activeTab.value === "center") {
    // 考试中心 - 使用getExamPageList接口
    try {
      const response = await getExamPageList({
        pageNo: currentPage.value,
        pageSize: pageParams.value.limit,
        ...pageParams.value.query,
      });

      if (response.code === 200 || response.code === 0) {
        // 直接使用API返回的数据
        allExams.value = response.data.list;

        // 更新分页信息
        totalItems.value = response.data.total;
        totalPages.value = Math.ceil(totalItems.value / pageParams.value.limit);
        currentPage.value =
          Math.floor(pageParams.value.offset / pageParams.value.limit) + 1;
      }
    } catch (error) {
      console.error("获取考试列表失败:", error);
    }
  } else {
    // 我的考试 - 使用getStudentRecordPageList接口
    try {
      const response = await getStudentRecordPageList({
        pageNo: currentPage.value,
        pageSize: pageParams.value.limit,
        ...pageParams.value.query,
      });

      if (response.code === 200 || response.code === 0) {
        // 直接使用API返回的数据
        myExams.value = response.data.list;

        // 更新分页信息
        totalItems.value = response.data.total;
        totalPages.value = Math.ceil(totalItems.value / pageParams.value.limit);
        currentPage.value =
          Math.floor(pageParams.value.offset / pageParams.value.limit) + 1;
      }
    } catch (error) {
      console.error("获取我的考试列表失败:", error);
    }
  }
};

// 根据API返回的状态获取展示状态
const getExamStatus = (status) => {
  // 假设状态值: 1=未开始，2=进行中，3=已结束
  switch (status) {
    case 1:
      return "未参加";
    case 2:
      return "进行中";
    case 3:
      return "已通过"; // 这里需要根据实际成绩判断是否通过
    default:
      return "未参加";
  }
};

// 获取状态标签
const getStatusTag = (status) => {
  // 假设状态值: 1=未开始，2=进行中，3=已结束
  switch (status) {
    case 1:
      return "未开始";
    case 2:
      return "考试中";
    case 3:
      return "已出分"; // 假设考试结束就已出分
    default:
      return "未开始";
  }
};

// 搜索考试
const searchExam = () => {
  if (searchKeyword.value) {
    pageParams.value.query = {
      ...pageParams.value.query,
      examTitle: searchKeyword.value,
    };
  } else {
    // 如果搜索关键词为空，删除查询条件中的examTitle
    if (pageParams.value.query.examTitle) {
      const { examTitle, ...rest } = pageParams.value.query;
      pageParams.value.query = rest;
    }
  }
  pageParams.value.offset = 0; // 重置页码
  fetchExamList();
};

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  pageParams.value.offset = (page - 1) * pageParams.value.limit;
  fetchExamList();
};

// 获取分页范围（显示页码按钮）
const getPaginationRange = () => {
  const range = [];
  const maxButtons = 5; // 最多显示5个页码按钮

  if (totalPages.value <= maxButtons) {
    // 总页数小于等于最大显示按钮数，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i);
    }
  } else {
    // 总页数大于最大显示按钮数，使用省略号显示
    let start = Math.max(1, currentPage.value - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages.value, start + maxButtons - 1);

    // 调整起始页，确保显示的按钮数量为maxButtons
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  }

  return range;
};

// 切换考试状态筛选
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

    // 根据选择的状态筛选考试列表
    if (index === 0) {
      // 全部
      delete pageParams.value.query.status;
    } else if (index === 1) {
      // 未开始
      pageParams.value.query.status = 1;
    } else if (index === 2) {
      // 已完成
      pageParams.value.query.status = 3;
    }

    fetchExamList();
  } else if (filterType === "examTypes") {
    examTypes.value = examTypes.value.map((item, i) => ({
      ...item,
      active: i === index,
    }));

    // 根据选择的类型筛选考试列表
    if (index === 0) {
      // 全部
      delete pageParams.value.query.examType;
    } else {
      // 其他类型，假设index对应examType值
      pageParams.value.query.examType = index;
    }

    fetchExamList();
  }
};

const activeTab = ref("center");

// 监听标签切换
const handleTabChange = () => {
  // 重置查询参数
  pageParams.value = {
    query: {},
    limit: 10,
    offset: 0,
    order: "createTime desc",
  };

  // 重置当前页码
  currentPage.value = 1;

  fetchExamList();
};

// 监听标签变化
watch(activeTab, () => {
  handleTabChange();
});

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

// 页面加载时获取考试列表
onMounted(() => {
  fetchExamList();
});
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
