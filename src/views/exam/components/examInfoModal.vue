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
      <div class="p-4">
        <div class="grid grid-cols-3 gap-4">
          <!-- 左侧信息 -->
          <div class="col-span-2">
            <div class="grid grid-cols-1 gap-4">
              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试名称
                </div>
                <div class="flex-1 font-medium">{{ exam.title }}</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试总分
                </div>
                <div class="flex-1 font-medium">{{ exam.totalScore }}分</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  及格分数
                </div>
                <div class="flex-1 font-medium">{{ exam.passingScore }}分</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试时长
                </div>
                <div class="flex-1 font-medium">{{ exam.duration }}分钟</div>
              </div>

              <div class="flex py-3 gap-4">
                <div class="w-20 text-black bg-gray-100 text-center rounded">
                  考试类型
                </div>
                <div class="flex-1 font-medium">{{ exam.type }}</div>
              </div>
            </div>
          </div>

          <!-- 右侧图片 -->
          <div class="col-span-1">
            <div class="rounded-md p-2">
              <img
                src="../../../assets/exam-sample.png"
                alt="考试图片"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <!-- 考试规则 -->
        <div class="mt-4 p-4 bg-gray-50 rounded-md">
          <div
            v-for="(rule, index) in exam.rules"
            :key="index"
            class="flex items-start mb-2 last:mb-0"
          >
            <span class="text-red-500 mr-2">{{ index + 1 }}.</span>
            <span class="text-red-500 mr-2">{{ rule }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { IoCloseOutline } from "vue-icons-plus/io";

// 接收考试信息
const props = defineProps({
  exam: {
    type: Object,
    required: true,
  },
});

// 定义事件
defineEmits(["close", "start"]);
</script>
