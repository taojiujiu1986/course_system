<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
      <!-- 弹窗标题 -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-blue-500">新建提问</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <IoCloseOutline class="w-6 h-6" />
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="p-4">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <div class="flex items-center mb-1">
              <span class="text-red-500 mr-1">*</span>
              <label class="text-gray-700">所属课件：</label>
            </div>
            <div class="relative">
              <div
                class="border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between cursor-pointer"
                @click="showCoursewareDropdown = !showCoursewareDropdown"
              >
                <span :class="selectedCourseware ? 'text-gray-800' : 'text-gray-500'">
                  {{ selectedCourseware || "请选择您的问题课件" }}
                </span>
                <IoChevronDownOutline class="w-4 h-4 text-gray-500" />
              </div>

              <!-- 下拉菜单 -->
              <div
                v-if="showCoursewareDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                <div
                  v-for="(item, index) in coursewareOptions"
                  :key="index"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="selectCourseware(item)"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex items-center mb-1">
              <span class="text-red-500 mr-1">*</span>
              <label class="text-gray-700">问题标题：</label>
            </div>
            <input
              v-model="questionTitle"
              placeholder="请输入问题标题（简明扼要）"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div class="mb-6">
            <div class="flex items-center mb-1">
              <span class="text-red-500 mr-1">*</span>
              <label class="text-gray-700">提问内容：</label>
            </div>
            <textarea
              v-model="questionContent"
              placeholder="请输入您想咨询的内容"
              class="w-full border border-gray-300 rounded-md p-3 min-h-[150px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              :disabled="!isFormValid"
            >
              确定
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { IoCloseOutline, IoChevronDownOutline } from "vue-icons-plus/io5";

const emit = defineEmits(["close", "submit"]);

// 课件选项
const coursewareOptions = [
  "第一章：课程介绍",
  "第二章：基础知识",
  "第三章：实践操作",
  "第四章：案例分析",
  "第五章：总结与展望",
];

const showCoursewareDropdown = ref(false);
const selectedCourseware = ref("");
const questionTitle = ref("");
const questionContent = ref("");

// 选择课件
const selectCourseware = (courseware) => {
  selectedCourseware.value = courseware;
  showCoursewareDropdown.value = false;
};

// 表单验证
const isFormValid = computed(() => {
  return (
    selectedCourseware.value &&
    questionTitle.value.trim().length > 0 &&
    questionContent.value.trim().length > 0
  );
});

// 提交表单
const handleSubmit = () => {
  if (!isFormValid.value) return;

  emit("submit", {
    courseware: selectedCourseware.value,
    title: questionTitle.value,
    content: questionContent.value,
  });

  // 重置表单
  selectedCourseware.value = "";
  questionTitle.value = "";
  questionContent.value = "";
};
</script>
