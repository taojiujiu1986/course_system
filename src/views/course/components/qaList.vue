<template>
  <div class="bg-white rounded-lg">
    <!-- 筛选和搜索 -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div class="flex items-center gap-4 w-full md:w-auto">
        <div class="relative w-full md:w-64">
          <div
            class="border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer"
          >
            <span class="text-gray-500">选择或搜索课件</span>
            <IoChevronDownOutline class="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div class="relative w-full md:w-64">
          <input
            type="text"
            placeholder="搜索问答"
            class="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            class="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-500"
          >
            <IoSearchOutline class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="flex gap-2 w-full md:w-auto">
        <button
          class="px-4 py-2 bg-[#1771FD] text-white rounded-md hover:bg-blue-600 transition"
        >
          只看已回答
        </button>
        <button
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        >
          仅看我发表
        </button>
        <button
          class="px-4 py-2 bg-[#1771FD] text-white rounded-md hover:bg-blue-600 transition flex items-center"
          @click="showNewQuestionModal = true"
        >
          <IoAddOutline class="w-5 h-5 mr-1" />
          新建提问
        </button>
      </div>
    </div>

    <!-- 问题列表 -->
    <div class="space-y-4">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="border-b border-gray-200 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 transition p-4"
        @click="handleQuestionClick(question)"
      >
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-[#E97D13] text-white px-2 py-0.5 text-sm rounded">{{
                question.status
              }}</span>
              <h3 class="font-medium text-gray-800">{{ question.title }}</h3>
            </div>
            <div class="text-gray-500">发布时间：{{ question.time }}</div>
          </div>
          <div class="flex items-center gap-2">
            <img :src="question.avatar" alt="用户头像" class="w-8 h-8 rounded-full" />
            <span class="text-gray-700">{{ question.user }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建提问弹窗 -->
    <NewQuestionModal
      v-if="showNewQuestionModal"
      @close="showNewQuestionModal = false"
      @submit="handleSubmitQuestion"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { IoSearchOutline, IoChevronDownOutline, IoAddOutline } from "vue-icons-plus/io5";
import NewQuestionModal from "./NewQuestionModal.vue";

const showNewQuestionModal = ref(false);
const emit = defineEmits(["question-click"]);

// 问题列表数据
const questions = ref([
  {
    id: 1,
    status: "待回复",
    title: "当今社会这么多人选择考研，考研的意义是什么？",
    content:
      "一、学术追求 对所学专业由入门到入述，视悟术有继续研究下去的必要，因而考研，期待在学术上有所建树。这是研究生的本来含义，也是最原始意义上的考研动机。二、延时就业 专科生怕大于求，本科生供需持平，研究生供不应求，这是今年大学生面临的就业形势。谁都看得出来，如今研究生是人才市场上的而且，意到就士文凭，使你多了一个进入大城市工作的敲门砖，为了日后谋求工作的自由，想想你的这点自由是什么？",
    time: "2025-01-01 20:20:20",
    user: "学员0111",
    avatar: "/avatar.jpg",
  },
  {
    id: 2,
    status: "待回复",
    title: "职业规划应该在大学什么时候开始",
    content: "职业规划应该什么时候开始？是大一还是大四？有没有一些好的建议？",
    time: "2025-01-02 10:30:15",
    user: "学员0222",
    avatar: "/avatar.jpg",
  },
  {
    id: 3,
    status: "已回复",
    title: "公安工作的职业发展路径是什么",
    content: "想了解下公安工作的职业发展路径是什么，有哪些晋升渠道？",
    time: "2025-01-03 14:22:36",
    user: "学员0333",
    avatar: "/avatar.jpg",
  },
  {
    id: 4,
    status: "已回复",
    title: "如何提高英语口语水平",
    content: "想要提高英语口语，有什么好的方法推荐吗？",
    time: "2025-01-04 09:15:48",
    user: "学员0444",
    avatar: "/avatar.jpg",
  },
  {
    id: 5,
    status: "待回复",
    title: "法律专业就业方向有哪些",
    content: "法律专业毕业后，除了律师、法官、检察官外，还有哪些就业方向？",
    time: "2025-01-05 16:40:22",
    user: "学员0555",
    avatar: "/avatar.jpg",
  },
]);

const handleSubmitQuestion = (questionData) => {
  // 处理提交问题的逻辑
  console.log("提交问题:", questionData);

  // 添加新问题到列表
  questions.value.unshift({
    id: questions.value.length + 1,
    status: "待回复",
    title: questionData.title,
    content: questionData.content,
    time: new Date()
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\//g, "-"),
    user: "学员0111",
    avatar: "/avatar.jpg",
  });

  // 关闭弹窗
  showNewQuestionModal.value = false;
};

// 点击问题跳转到详情
const handleQuestionClick = (question) => {
  emit("question-click", question);
};
</script>
