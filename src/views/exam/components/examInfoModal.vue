<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
      <!-- 弹窗标题 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <div class="flex items-center text-blue-500">
          <div class="w-1 h-5 bg-[#1771FD] mr-2"></div>
          <h3 class="text-lg font-medium text-black">考试信息</h3>
        </div>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <IoCloseOutline class="w-6 h-6" />
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="p-4" v-if="examInfo">
        <div class="grid grid-cols-3 gap-4">
          <!-- 左侧信息 -->
          <div class="col-span-2">
            <div class="grid grid-cols-1 gap-4">
              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试名称
                </div>
                <div class="flex-1 font-medium">{{ examInfo.examTitle }}</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试总分
                </div>
                <div class="flex-1 font-medium">{{ examInfo.totalScore }}分</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  及格分数
                </div>
                <div class="flex-1 font-medium">{{ examInfo.qualifyScore }}分</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试时长
                </div>
                <div class="flex-1 font-medium">{{ examInfo.examTime }}分钟</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试类型
                </div>
                <div class="flex-1 font-medium">
                  {{ getExamType(examInfo.examType) }}
                </div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试时间
                </div>
                <div class="flex-1 font-medium">
                  {{ formatTimestamp(examInfo.startTime) }} ~
                  {{ formatTimestamp(examInfo.endTime) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧图片 -->
          <div class="col-span-1">
            <div class="rounded-md p-2">
              <img :src="examInfo.image" alt="考试图片" class="w-full h-auto" />
            </div>
          </div>
        </div>

        <!-- 考试规则和说明 -->
        <div class="mt-4 p-4 bg-gray-50 rounded-md">
          <h4 class="font-medium mb-2">考试说明</h4>
          <div class="mb-4" v-html="examInfo.examBrief || '暂无考试说明'"></div>

          <h4 class="font-medium mb-2">考试规则</h4>
          <div class="flex items-start mb-2">
            <span class="text-red-500 mr-2">1.</span>
            <span class="text-red-500"
              >考试开始后，请勿刷新页面或关闭浏览器，否则可能导致考试中断。</span
            >
          </div>
          <div class="flex items-start mb-2">
            <span class="text-red-500 mr-2">2.</span>
            <span class="text-red-500"
              >考试过程中请勿切换标签页或打开其他窗口，系统将记录切屏次数。</span
            >
          </div>
          <div class="flex items-start mb-2">
            <span class="text-red-500 mr-2">3.</span>
            <span class="text-red-500"
              >提交试卷后将无法修改答案，请在提交前确认所有题目已作答。</span
            >
          </div>
          <div class="flex items-start mb-2">
            <span class="text-red-500 mr-2">4.</span>
            <span class="text-red-500"
              >考试时间结束后，系统将自动提交当前已作答的试题。</span
            >
          </div>
          <div class="flex items-start mb-2">
            <span class="text-red-500 mr-2">5.</span>
            <span class="text-red-500">如遇技术问题，请立即联系管理员寻求帮助。</span>
          </div>
          <div v-if="examInfo.reviewRule" class="flex items-start mb-2">
            <span class="text-red-500 mr-2">6.</span>
            <span class="text-red-500">阅卷规则：{{ examInfo.reviewRule }}</span>
          </div>
        </div>

        <!-- 开始考试按钮 -->
        <div class="flex justify-center mt-6">
          <button
            @click="$emit('start')"
            class="bg-[#1771FD] text-white px-8 py-2 rounded-full hover:bg-blue-600 transition"
          >
            开始考试
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else class="p-6 text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
        ></div>
        <p>加载考试信息中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { IoCloseOutline } from "vue-icons-plus/io";

// 接收考试信息
const props = defineProps({
  examInfo: {
    type: Object,
    required: true,
  },
});

// 定义事件
defineEmits(["close", "start"]);

// 获取考试类型文本
const getExamType = (type) => {
  const types = {
    1: "笔试考试",
    2: "面试考试",
    3: "实操考试",
    4: "综合考试",
  };
  return types[type] || "未知类型";
};

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
</script>
