<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部进度条 -->
    <div class="bg-white p-4 shadow-sm">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div class="w-3/4">
            <div class="bg-gray-200 h-2 rounded-full">
              <div
                class="bg-blue-500 h-2 rounded-full"
                :style="{
                  width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%`,
                }"
              ></div>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              已完成{{ currentQuestionIndex + 1 }}题 / {{ exam.questions.length }}题
            </div>
          </div>
          <div class="text-right">
            <button
              @click="submitExam"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              提交试卷
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧考试内容 -->
        <div class="w-full lg:w-3/4 bg-white rounded-lg shadow-md p-6">
          <!-- 考试标题 -->
          <div
            class="bg-blue-500 text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-6 flex items-center"
          >
            <div class="w-1 h-6 bg-white mr-2"></div>
            <h1 class="text-xl font-bold">{{ exam.title }}</h1>
          </div>

          <!-- 章节标题 -->
          <div class="bg-gray-100 p-3 rounded-md mb-6">
            <h2 class="text-gray-700 font-medium">
              {{ currentSection.title }}
            </h2>
          </div>

          <!-- 当前题目 -->
          <div v-if="currentQuestion" class="mb-6">
            <!-- 题目类型和分值 -->
            <div class="flex items-center mb-4">
              <div class="text-blue-500 mr-2">
                <IoStarOutline class="w-5 h-5" />
              </div>
              <span class="text-blue-500 font-medium">{{
                getQuestionTypeName(currentQuestion.type)
              }}</span>
              <span class="text-gray-500 ml-2"
                >（本题分值：{{ currentQuestion.score }}分）</span
              >
            </div>

            <!-- 题目内容 -->
            <div class="mb-4">
              <div class="flex">
                <span class="mr-2">{{ currentQuestionIndex + 1 }}、</span>
                <div>
                  <div class="mb-2" v-html="currentQuestion.content"></div>

                  <!-- 音频题 -->
                  <div
                    v-if="currentQuestion.audioUrl"
                    class="bg-blue-50 p-3 rounded-md mb-4"
                  >
                    <div class="text-sm text-gray-600 mb-2">
                      {{ currentQuestion.audioTitle || "音频内容" }}
                    </div>
                    <div class="flex items-center">
                      <button
                        @click="toggleAudio"
                        class="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      >
                        <IoPlayOutline v-if="!isPlaying" class="w-5 h-5" />
                        <IoPauseOutline v-else class="w-5 h-5" />
                      </button>
                      <div class="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          v-model="audioProgress"
                          class="w-full"
                        />
                      </div>
                      <div class="ml-2 text-sm text-gray-600">
                        {{ formatTime(audioCurrentTime) }}/{{ formatTime(audioDuration) }}
                      </div>
                    </div>
                    <audio
                      ref="audioPlayer"
                      :src="currentQuestion.audioUrl"
                      @timeupdate="updateAudioProgress"
                      @loadedmetadata="setAudioDuration"
                    ></audio>
                  </div>

                  <!-- 视频题 -->
                  <div v-if="currentQuestion.videoUrl" class="mb-4">
                    <video
                      ref="videoPlayer"
                      :src="currentQuestion.videoUrl"
                      class="w-full rounded-md"
                      controls
                    ></video>
                  </div>

                  <!-- 图片题 -->
                  <div v-if="currentQuestion.imageUrl" class="mb-4">
                    <img
                      :src="currentQuestion.imageUrl"
                      :alt="currentQuestion.content"
                      class="max-w-full rounded-md"
                    />
                  </div>

                  <!-- 图片选项题 -->
                  <div
                    v-if="currentQuestion.type === 'imageChoice'"
                    class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
                  >
                    <div
                      v-for="(option, index) in currentQuestion.imageOptions"
                      :key="index"
                      class="border rounded-md p-2 cursor-pointer"
                      :class="{
                        'border-blue-500':
                          userAnswers[currentQuestionIndex] === option.value,
                      }"
                      @click="selectAnswer(option.value)"
                    >
                      <img
                        :src="option.imageUrl"
                        :alt="`选项${index + 1}`"
                        class="w-full h-24 object-contain mb-2"
                      />
                      <div class="flex items-center justify-center">
                        <div
                          class="w-6 h-6 rounded-full border flex items-center justify-center mr-1"
                          :class="{
                            'bg-blue-500 border-blue-500 text-white':
                              userAnswers[currentQuestionIndex] === option.value,
                          }"
                        >
                          {{ ["A", "B", "C", "D"][index] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 答题区域 -->
            <div class="pl-6">
              <!-- 单选题 -->
              <div v-if="currentQuestion.type === 'singleChoice'" class="space-y-3">
                <div
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="flex items-center"
                >
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      :name="`question_${currentQuestionIndex}`"
                      :value="option.value"
                      v-model="userAnswers[currentQuestionIndex]"
                      class="hidden"
                    />
                    <div
                      class="w-6 h-6 rounded-full border flex items-center justify-center mr-2"
                      :class="{
                        'bg-blue-500 border-blue-500 text-white':
                          userAnswers[currentQuestionIndex] === option.value,
                      }"
                    >
                      {{ option.value }}
                    </div>
                    <span v-html="option.text"></span>
                  </label>
                </div>
              </div>

              <!-- 多选题 -->
              <div
                v-else-if="currentQuestion.type === 'multipleChoice'"
                class="space-y-3"
              >
                <div
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="flex items-center"
                >
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :value="option.value"
                      @change="toggleMultipleChoice(option.value)"
                      :checked="isOptionSelected(option.value)"
                      class="hidden"
                    />
                    <div
                      class="w-6 h-6 rounded border flex items-center justify-center mr-2"
                      :class="{
                        'bg-blue-500 border-blue-500 text-white': isOptionSelected(
                          option.value
                        ),
                      }"
                    >
                      <IoCheckmarkOutline
                        v-if="isOptionSelected(option.value)"
                        class="w-4 h-4"
                      />
                    </div>
                    <span v-html="option.text"></span>
                  </label>
                </div>
              </div>

              <!-- 填空题 -->
              <div v-else-if="currentQuestion.type === 'fillBlank'" class="space-y-3">
                <input
                  type="text"
                  v-model="userAnswers[currentQuestionIndex]"
                  placeholder="请输入您的答案"
                  class="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div class="text-xs text-gray-500 mt-1">
                  请填写标准答案，多个答案之间用逗号、分号或顿号分隔
                </div>
              </div>

              <!-- 简答题 -->
              <div v-else-if="currentQuestion.type === 'shortAnswer'" class="space-y-3">
                <textarea
                  v-model="userAnswers[currentQuestionIndex]"
                  placeholder="请输入您的答案"
                  class="w-full border border-gray-300 rounded-md p-3 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <!-- 判断题 -->
              <div v-else-if="currentQuestion.type === 'trueOrFalse'" class="space-y-3">
                <div class="flex items-center mb-3">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      :name="`question_${currentQuestionIndex}`"
                      value="T"
                      v-model="userAnswers[currentQuestionIndex]"
                      class="hidden"
                    />
                    <div
                      class="w-6 h-6 rounded-full border flex items-center justify-center mr-2"
                      :class="{
                        'bg-blue-500 border-blue-500 text-white':
                          userAnswers[currentQuestionIndex] === 'T',
                      }"
                    >
                      T
                    </div>
                    <span>正确</span>
                  </label>
                </div>
                <div class="flex items-center">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      :name="`question_${currentQuestionIndex}`"
                      value="F"
                      v-model="userAnswers[currentQuestionIndex]"
                      class="hidden"
                    />
                    <div
                      class="w-6 h-6 rounded-full border flex items-center justify-center mr-2"
                      :class="{
                        'bg-blue-500 border-blue-500 text-white':
                          userAnswers[currentQuestionIndex] === 'F',
                      }"
                    >
                      F
                    </div>
                    <span>错误</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 导航按钮 -->
          <div class="flex justify-between mt-8">
            <button
              @click="prevQuestion"
              class="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition"
              :disabled="currentQuestionIndex === 0"
              :class="{
                'opacity-50 cursor-not-allowed': currentQuestionIndex === 0,
              }"
            >
              上一题
            </button>
            <button
              @click="nextQuestion"
              class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              :disabled="currentQuestionIndex === exam.questions.length - 1"
              :class="{
                'opacity-50 cursor-not-allowed':
                  currentQuestionIndex === exam.questions.length - 1,
              }"
            >
              下一题
            </button>
          </div>
        </div>

        <!-- 右侧答题卡和计时器 -->
        <div class="w-full lg:w-1/4">
          <!-- 计时器 -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <div class="text-center text-gray-600 mb-2">剩余时间</div>
            <div class="text-center text-4xl font-bold text-red-500">
              {{ formatExamTime(remainingTime) }}
            </div>
            <div
              class="flex justify-between text-xs text-gray-500 mt-1 w-[100px] mx-auto"
            >
              <span>时</span>
              <span>分</span>
              <span>秒</span>
            </div>
          </div>

          <!-- 答题卡 -->
          <div class="bg-white rounded-lg shadow-md p-4">
            <div class="text-center text-gray-600 mb-4">答题卡</div>

            <div
              v-for="(section, sectionIndex) in exam.sections"
              :key="sectionIndex"
              class="mb-4"
            >
              <div class="bg-gray-100 p-2 rounded-md mb-2 text-sm">
                {{ section.title }}
              </div>

              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="questionIndex in getQuestionIndicesForSection(section)"
                  :key="questionIndex"
                  class="w-10 h-10 rounded-md flex items-center justify-center text-sm"
                  :class="{
                    'bg-blue-500 text-white': questionIndex === currentQuestionIndex,
                    'bg-blue-100 text-blue-500':
                      userAnswers[questionIndex] !== undefined &&
                      questionIndex !== currentQuestionIndex,
                    'bg-gray-100 text-gray-700':
                      userAnswers[questionIndex] === undefined &&
                      questionIndex !== currentQuestionIndex,
                  }"
                  @click="goToQuestion(questionIndex)"
                >
                  {{ questionIndex + 1 }}
                </button>
              </div>
            </div>

            <div class="flex items-center mt-4">
              <div class="flex items-center mr-4">
                <div class="w-4 h-4 bg-blue-500 rounded-sm mr-1"></div>
                <span class="text-xs text-gray-600">已答</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-gray-100 rounded-sm mr-1"></div>
                <span class="text-xs text-gray-600">未答</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IoStarOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoCheckmarkOutline,
} from "vue-icons-plus/io";
import { getAllInfo } from "@/api/pland";

// 路由参数和路由对象
const route = useRoute();
const router = useRouter();
const id = ref(route.query.id || route.params.id);

// 考试数据
const exam = ref({
  id: 1,
  title: "笔面过考-全程考试",
  duration: 30 * 60, // 30分钟，以秒为单位
  totalScore: 100,
  passingScore: 60,
  sections: [],
  questions: [],
});

// 用户答案
const userAnswers = ref([]);

// 当前题目索引
const currentQuestionIndex = ref(0);

// 考试计时器
const remainingTime = ref(0); // 初始化为0，在获取实际考试时间后更新
let timerInterval = null;

// 缓存键名
const CACHE_KEYS = {
  ANSWERS: 'exam_answers_',
  TIME: 'exam_time_',
  CURRENT_INDEX: 'exam_current_index_'
};

// 保存考试状态到缓存
const saveExamState = () => {
  if (!id.value) return;
  
  const cacheKey = CACHE_KEYS.ANSWERS + id.value;
  const timeKey = CACHE_KEYS.TIME + id.value;
  const indexKey = CACHE_KEYS.CURRENT_INDEX + id.value;
  
  localStorage.setItem(cacheKey, JSON.stringify(userAnswers.value));
  localStorage.setItem(timeKey, remainingTime.value.toString());
  localStorage.setItem(indexKey, currentQuestionIndex.value.toString());
};

// 从缓存恢复考试状态
const restoreExamState = () => {
  if (!id.value) return;
  
  const cacheKey = CACHE_KEYS.ANSWERS + id.value;
  const timeKey = CACHE_KEYS.TIME + id.value;
  const indexKey = CACHE_KEYS.CURRENT_INDEX + id.value;
  
  const cachedAnswers = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(timeKey);
  const cachedIndex = localStorage.getItem(indexKey);
  
  if (cachedAnswers) {
    userAnswers.value = JSON.parse(cachedAnswers);
  }
  
  if (cachedTime) {
    remainingTime.value = parseInt(cachedTime);
  }
  
  if (cachedIndex) {
    currentQuestionIndex.value = parseInt(cachedIndex);
  }
};

// 清除考试缓存
const clearExamCache = () => {
  if (!id.value) return;
  
  const cacheKey = CACHE_KEYS.ANSWERS + id.value;
  const timeKey = CACHE_KEYS.TIME + id.value;
  const indexKey = CACHE_KEYS.CURRENT_INDEX + id.value;
  
  localStorage.removeItem(cacheKey);
  localStorage.removeItem(timeKey);
  localStorage.removeItem(indexKey);
};

// 加载考试题目数据
const loadExamQuestions = async () => {
  try {
    const response = await getAllInfo(id.value);

    if (!response || !response.data) {
      alert("获取考试数据失败");
      return;
    }

    const examData = response.data;

    // 设置考试基本信息
    exam.value.id = examData.id || exam.value.id;
    exam.value.title = examData.examTitle || exam.value.title;

    // 记录从接口获取的考试时间（分钟）
    console.log("接口返回的考试时间(分钟):", examData.examTime);

    // 转换为秒并设置到exam对象，确保处理可能为空或0的情况
    if (examData.examTime && examData.examTime > 0) {
      exam.value.duration = examData.examTime * 60;
    } else {
      console.warn("接口返回的考试时间无效，使用默认值:", exam.value.duration);
    }
    console.log("设置到exam对象的时间(秒):", exam.value.duration);

    exam.value.totalScore = examData.totalScore || exam.value.totalScore;
    exam.value.passingScore = examData.qualifyScore || exam.value.passingScore;

    // 获取题目列表
    const questionList = examData.questionAnswerRespVOList || [];

    if (questionList.length === 0) {
      alert("考试题目为空");
      return;
    }

    // 处理题目数据
    // 映射题型类型
    const typeMapping = {
      1: "singleChoice", // 单选题
      2: "multipleChoice", // 多选题
      3: "trueOrFalse", // 判断题
      4: "shortAnswer", // 简答题
      5: "fillBlank", // 填空题
      6: "groupChoice", // 组合题
      7: "indefiniteChoice", // 不定项选择题
    };

    // 格式化题目数据
    const formattedQuestions = questionList.map((item) => {
      // 处理选项数据
      const options = (item.questionAnswer || [])
        .map((option) => {
          return {
            id: option.id,
            value: option.tag, // 选项标识，如 A, B, C, D
            text: option.content, // 选项内容，支持HTML
            sort: option.sort, // 排序
            image: option.image, // 选项图片
          };
        })
        .sort((a, b) => a.sort - b.sort); // 按sort排序

      // 构建题目对象
      return {
        id: item.id,
        quId: item.id, // 用于答案提交
        type: typeMapping[item.quType] || "singleChoice",
        content: item.content || "",
        score: item.score || 1,
        options: options,
        correctAnswer: "", // 考试时不展示正确答案
        analysis: item.analysis || "", // 题目解析
        audioUrl: item.fileType === 3 ? item.fileUrl : "",
        audioTitle: "音频内容",
        videoUrl: item.fileType === 2 ? item.fileUrl : "",
        imageUrl: item.fileType === 1 ? item.fileUrl : "",
        imageOptions: [], // 这个接口没有提供图片选项
        quType: item.quType, // 保存原始题型，用于提交答案
        isManual: item.isManual, // 是否需要人工阅卷
      };
    });

    // 更新题目数组
    exam.value.questions = formattedQuestions;

    // 创建默认分组
    exam.value.sections = [
      {
        id: 1,
        title: "考试题目",
        startQuestionIndex: 0,
        endQuestionIndex: formattedQuestions.length - 1,
      },
    ];

    // 初始化用户答案数组 - 为多选题创建空数组
    userAnswers.value = formattedQuestions.map((question) =>
      question.type === "multipleChoice" ? [] : undefined
    );

    // 尝试从缓存恢复考试状态
    restoreExamState();

    // 数据加载完成后开始计时器
    startTimer();
  } catch (error) {
    console.error("获取题目数据失败:", error);
    alert("获取题目数据失败，请刷新页面重试");
  }
};

// 计算当前题目
const currentQuestion = computed(() => {
  return exam.value.questions[currentQuestionIndex.value];
});

// 计算当前章节
const currentSection = computed(() => {
  for (const section of exam.value.sections) {
    if (
      currentQuestionIndex.value >= section.startQuestionIndex &&
      currentQuestionIndex.value <= section.endQuestionIndex
    ) {
      return section;
    }
  }
  return { title: "" };
});

// 获取章节的题目索引
const getQuestionIndicesForSection = (section) => {
  const indices = [];
  for (let i = section.startQuestionIndex; i <= section.endQuestionIndex; i++) {
    indices.push(i);
  }
  return indices;
};

// 题目类型名称映射
const getQuestionTypeName = (type) => {
  const typeMap = {
    singleChoice: "单选题",
    multipleChoice: "多选题",
    fillBlank: "填空题",
    shortAnswer: "简答题",
    imageChoice: "单选题",
    indefiniteChoice: "不定项选择题",
  };
  return typeMap[type] || "未知题型";
};

// 音频播放相关
const audioPlayer = ref(null);
const isPlaying = ref(false);
const audioProgress = ref(0);
const audioCurrentTime = ref(0);
const audioDuration = ref(0);

// 更新音频进度
const updateAudioProgress = () => {
  if (!audioPlayer.value) return;

  const currentTime = audioPlayer.value.currentTime;
  const duration = audioPlayer.value.duration;

  audioCurrentTime.value = currentTime;
  audioProgress.value = (currentTime / duration) * 100;
};

// 设置音频总时长
const setAudioDuration = () => {
  if (!audioPlayer.value) return;
  audioDuration.value = audioPlayer.value.duration;
};

// 播放/暂停音频
const toggleAudio = () => {
  if (!audioPlayer.value) return;

  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play();
  }

  isPlaying.value = !isPlaying.value;
};

// 格式化时间 (秒 -> mm:ss)
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 格式化考试时间 (秒 -> hh:mm:ss)
const formatExamTime = (seconds) => {
  if (isNaN(seconds)) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < exam.value.questions.length - 1) {
    currentQuestionIndex.value++;
  }
};

// 跳转到指定题目
const goToQuestion = (index) => {
  currentQuestionIndex.value = index;
};

// 选择答案 (图片选择题)
const selectAnswer = (value) => {
  userAnswers.value[currentQuestionIndex.value] = value;
};

// 检查选项是否被选中 (多选题)
const isOptionSelected = (value) => {
  const answers = userAnswers.value[currentQuestionIndex.value];
  return Array.isArray(answers) && answers.includes(value);
};

// 处理选项选择 (多选题专用)
const toggleMultipleChoice = (value) => {
  // 确保当前答案是数组
  if (!Array.isArray(userAnswers.value[currentQuestionIndex.value])) {
    userAnswers.value[currentQuestionIndex.value] = [];
  }

  const currentAnswers = userAnswers.value[currentQuestionIndex.value];
  const index = currentAnswers.indexOf(value);

  // 如果已选中，则移除；否则添加
  if (index > -1) {
    currentAnswers.splice(index, 1);
  } else {
    currentAnswers.push(value);
  }
};

// 开始计时器
const startTimer = () => {
  // 如果没有从缓存恢复时间，则使用考试总时长
  if (remainingTime.value <= 0) {
    remainingTime.value = exam.value.duration;
  }
  console.log("开始计时器，设置剩余时间(秒):", remainingTime.value);

  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
      // 每10秒保存一次状态
      if (remainingTime.value % 10 === 0) {
        saveExamState();
      }
    } else {
      clearInterval(timerInterval);
      submitExam();
    }
  }, 1000);
};

// 提交考试
const submitExam = async () => {
  // 计算已答题数量
  const answeredCount = userAnswers.value.filter((answer) => answer !== undefined).length;

  // 如果未全部作答，提示用户
  if (answeredCount < exam.value.questions.length) {
    if (
      !confirm(
        `您还有${exam.value.questions.length - answeredCount}题未作答，确定要提交吗？`
      )
    ) {
      return;
    }
  }

  try {
    // 准备提交的数据
    const submitData = {
      examId: id.value, // 考试ID
      answers: exam.value.questions.map((question, index) => {
        return {
          quId: question.id, // 题目ID
          quType: question.quType, // 原始题型
          answer: userAnswers.value[index], // 用户答案
          isManual: question.isManual, // 是否需要人工阅卷
        };
      }),
      usedTime: exam.value.duration - remainingTime.value, // 使用的时间（秒）
    };

    // 提交答案
    console.log("提交答案:", submitData);

    // 清除考试缓存
    clearExamCache();

    // 这里添加实际的API调用
    // 由于无法确定确切的API名称和参数，使用注释替代
    /*
    const result = await submitExamAnswers(submitData);
    
    if (result && result.code === 0) {
      // 提交成功
      const recordId = result.data; // 假设API返回了考试记录ID
      
      // 跳转到结果页面
      router.push({
        path: '/exam/result',
        query: {
          recordId: recordId
        }
      });
    } else {
      // 提交失败
      alert("提交失败：" + (result.msg || "未知错误"));
    }
    */

    // 临时提示，在不确定API的情况下使用
    alert("考试已提交！即将跳转到结果页面");

    // 模拟提交成功后跳转
    setTimeout(() => {
      router.push({
        path: "/exam/result",
        query: {
          id: id.value,
          examId: exam.value.id,
        },
      });
    }, 1000);
  } catch (error) {
    console.error("提交考试答案失败:", error);
    alert("提交失败，请重试");
  }
};

// 监听答案变化，自动保存到缓存
watch(userAnswers, () => {
  saveExamState();
}, { deep: true });

// 监听当前题目索引变化，保存到缓存
watch(currentQuestionIndex, () => {
  saveExamState();
});

// 组件挂载时
onMounted(() => {
  // 加载考试题目数据
  loadExamQuestions();

  // 计时器在数据加载完成后启动
});

// 组件卸载前
onBeforeUnmount(() => {
  // 清除计时器
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // 暂停音频
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }

  // 保存最终状态
  saveExamState();
});
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
