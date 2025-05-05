<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部进度条 -->
    <div class="bg-white p-4 shadow-sm">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div class="w-3/4">
            <div class="bg-gray-200 h-2 rounded-full">
              <div class="bg-[#1771FD] h-2 rounded-full" style="width: 100%"></div>
            </div>
          </div>
          <div class="text-gray-500 mt-1">
            已完成{{ examResult.totalQuestions }}题 / {{ examResult.totalQuestions }}题
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧考试内容 -->
        <div class="w-full lg:w-3/4">
          <!-- 考试标题 -->
          <div class="bg-[#1771FD] text-white p-4 rounded-t-lg mb-6 flex items-center">
            <div class="w-1 h-6 bg-white mr-2"></div>
            <h1 class="text-xl font-bold">{{ examResult.examTitle }}</h1>
          </div>

          <!-- 考试内容 -->
          <div class="space-y-6">
            <!-- 章节标题 -->
            <div
              v-for="(section, sectionIndex) in exam.sections"
              :key="`section-${sectionIndex}`"
              class="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              <div class="bg-gray-100 p-3">
                <h2 class="text-gray-700 font-bold">{{ section.title }}</h2>
              </div>

              <!-- 题目列表 -->
              <div class="p-6">
                <div
                  v-for="questionIndex in getQuestionIndicesForSection(section)"
                  :key="`question-${questionIndex}`"
                  class="mb-8 last:mb-0"
                >
                  <div class="mb-4">
                    <!-- 题目类型和分值 -->
                    <div class="flex items-center mb-4">
                      <div class="text-[#1771FD] mr-2">
                        <AiFillStar class="w-5 h-5" />
                      </div>
                      <span class="text-[#1771FD] font-bold">{{
                        getQuestionTypeName(exam.questions[questionIndex].type)
                      }}</span>
                      <span class="text-gray-500 ml-2"
                        >（本题分值：{{ exam.questions[questionIndex].score }}分）</span
                      >
                    </div>

                    <!-- 题目内容 -->
                    <div class="flex">
                      <span class="mr-2">{{ questionIndex + 1 }}、</span>
                      <div class="flex-1">
                        <div class="mb-2">
                          {{ exam.questions[questionIndex].content }}
                        </div>

                        <!-- 音频题 -->
                        <div
                          v-if="exam.questions[questionIndex].audioUrl"
                          class="bg-blue-50 p-3 rounded-md mb-4"
                        >
                          <div class="text-black mb-2">
                            {{ exam.questions[questionIndex].audioTitle || "音频内容" }}
                          </div>
                          <div class="flex items-center">
                            <button
                              @click="toggleAudio(questionIndex)"
                              class="bg-[#1771FD] text-white w-8 h-8 rounded-full flex items-center justify-center mr-2"
                            >
                              <IoPlayOutline
                                v-if="!isPlaying[questionIndex]"
                                class="w-5 h-5"
                              />
                              <IoPauseOutline v-else class="w-5 h-5" />
                            </button>
                            <div class="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                v-model="audioProgress[questionIndex]"
                                class="w-full"
                              />
                            </div>
                            <div class="ml-2 text-black">
                              {{ formatTime(audioCurrentTime[questionIndex]) }}/{{
                                formatTime(audioDuration[questionIndex])
                              }}
                            </div>
                          </div>
                          <audio
                            :ref="
                              (el) => {
                                if (el) audioPlayers[questionIndex] = el;
                              }
                            "
                            :src="exam.questions[questionIndex].audioUrl"
                            @timeupdate="updateAudioProgress(questionIndex)"
                            @loadedmetadata="setAudioDuration(questionIndex)"
                          ></audio>
                        </div>

                        <!-- 视频题 -->
                        <div v-if="exam.questions[questionIndex].videoUrl" class="mb-4">
                          <video
                            :src="exam.questions[questionIndex].videoUrl"
                            class="w-full rounded-md"
                            controls
                          ></video>
                        </div>

                        <!-- 图片题 -->
                        <div v-if="exam.questions[questionIndex].imageUrl" class="mb-4">
                          <img
                            :src="exam.questions[questionIndex].imageUrl"
                            :alt="exam.questions[questionIndex].content"
                            class="max-w-full rounded-md"
                          />
                        </div>

                        <!-- 图片选项题 -->
                        <div
                          v-if="exam.questions[questionIndex].type === 'imageChoice'"
                          class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
                        >
                          <div
                            v-for="(option, optIndex) in exam.questions[questionIndex]
                              .imageOptions"
                            :key="`img-opt-${optIndex}`"
                            class="border rounded-md p-2"
                            :class="{
                              'border-green-500 bg-green-50':
                                option.value ===
                                exam.questions[questionIndex].correctAnswer,
                              'border-red-500 bg-red-50':
                                examResult.userAnswers[questionIndex] === option.value &&
                                option.value !==
                                  exam.questions[questionIndex].correctAnswer,
                            }"
                          >
                            <img
                              :src="option.imageUrl"
                              :alt="`选项${optIndex + 1}`"
                              class="w-full h-24 object-contain mb-2"
                            />
                            <div class="flex items-center justify-center">
                              <div
                                class="w-6 h-6 rounded-full border flex items-center justify-center mr-1"
                                :class="{
                                  'bg-green-500 border-green-500 text-white':
                                    option.value ===
                                    exam.questions[questionIndex].correctAnswer,
                                  'bg-red-500 border-red-500 text-white':
                                    examResult.userAnswers[questionIndex] ===
                                      option.value &&
                                    option.value !==
                                      exam.questions[questionIndex].correctAnswer,
                                  'border-gray-300':
                                    examResult.userAnswers[questionIndex] !==
                                      option.value &&
                                    option.value !==
                                      exam.questions[questionIndex].correctAnswer,
                                }"
                              >
                                {{ ["A", "B", "C", "D"][optIndex] }}
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
                    <div
                      v-if="exam.questions[questionIndex].type === 'singleChoice'"
                      class="space-y-3"
                    >
                      <div
                        v-for="(option, optIndex) in exam.questions[questionIndex]
                          .options"
                        :key="`opt-${optIndex}`"
                        class="flex items-center"
                      >
                        <div
                          class="w-6 h-6 rounded-full border flex items-center justify-center mr-2"
                          :class="{
                            'bg-green-500 border-green-500 text-white':
                              option.value ===
                              exam.questions[questionIndex].correctAnswer,
                            'bg-red-500 border-red-500 text-white':
                              examResult.userAnswers[questionIndex] === option.value &&
                              option.value !==
                                exam.questions[questionIndex].correctAnswer,
                            'border-gray-300':
                              examResult.userAnswers[questionIndex] !== option.value &&
                              option.value !==
                                exam.questions[questionIndex].correctAnswer,
                          }"
                        >
                          {{ ["A", "B", "C", "D"][optIndex] }}
                        </div>
                        <span
                          :class="{
                            'text-green-500':
                              option.value ===
                              exam.questions[questionIndex].correctAnswer,
                            'text-red-500':
                              examResult.userAnswers[questionIndex] === option.value &&
                              option.value !==
                                exam.questions[questionIndex].correctAnswer,
                          }"
                          >{{ option.text }}</span
                        >
                      </div>
                    </div>

                    <!-- 多选题 -->
                    <div
                      v-else-if="exam.questions[questionIndex].type === 'multipleChoice'"
                      class="space-y-3"
                    >
                      <div
                        v-for="(option, optIndex) in exam.questions[questionIndex]
                          .options"
                        :key="`multi-opt-${optIndex}`"
                        class="flex items-center"
                      >
                        <div
                          class="w-6 h-6 rounded border flex items-center justify-center mr-2"
                          :class="{
                            'bg-green-500 border-green-500 text-white': isCorrectMultipleChoice(
                              questionIndex,
                              option.value
                            ),
                            'bg-red-500 border-red-500 text-white': isIncorrectMultipleChoice(
                              questionIndex,
                              option.value
                            ),
                            'border-gray-300':
                              !isOptionSelected(questionIndex, option.value) &&
                              !isCorrectOption(questionIndex, option.value),
                          }"
                        >
                          <IoCheckmarkOutline
                            v-if="
                              isOptionSelected(questionIndex, option.value) ||
                              isCorrectOption(questionIndex, option.value)
                            "
                            class="w-4 h-4"
                          />
                        </div>
                        <span
                          :class="{
                            'text-green-500': isCorrectOption(
                              questionIndex,
                              option.value
                            ),
                            'text-red-500': isIncorrectMultipleChoice(
                              questionIndex,
                              option.value
                            ),
                          }"
                          >{{ option.text }}</span
                        >
                      </div>
                    </div>

                    <!-- 填空题 -->
                    <div
                      v-else-if="exam.questions[questionIndex].type === 'fillBlank'"
                      class="space-y-3"
                    >
                      <div class="border rounded-md p-3">
                        <div class="text-black mb-1">您的答案：</div>
                        <div
                          class="font-bold"
                          :class="{
                            'text-green-500': isAnswerCorrect(questionIndex),
                            'text-red-500': !isAnswerCorrect(questionIndex),
                          }"
                        >
                          {{ examResult.userAnswers[questionIndex] || "未作答" }}
                        </div>
                      </div>
                    </div>

                    <!-- 简答题 -->
                    <div
                      v-else-if="exam.questions[questionIndex].type === 'shortAnswer'"
                      class="space-y-3"
                    >
                      <div class="border rounded-md p-3">
                        <div class="text-black mb-1">您的答案：</div>
                        <div class="whitespace-pre-wrap">
                          {{ examResult.userAnswers[questionIndex] || "未作答" }}
                        </div>
                      </div>
                    </div>

                    <!-- 答案解析 -->
                    <div
                      v-if="exam.questions[questionIndex].type !== 'shortAnswer'"
                      class="mt-4"
                      :class="{
                        'bg-red-50 border border-red-200': !isAnswerCorrect(
                          questionIndex
                        ),
                        'bg-green-50 border border-green-200': isAnswerCorrect(
                          questionIndex
                        ),
                      }"
                    >
                      <div class="p-3">
                        <div class="flex items-center mb-2">
                          <div
                            class="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-white"
                            :class="
                              isAnswerCorrect(questionIndex)
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            "
                          >
                            <IoCheckmarkOutline
                              v-if="isAnswerCorrect(questionIndex)"
                              class="w-4 h-4"
                            />
                            <IoCloseOutline v-else class="w-4 h-4" />
                          </div>
                          <div
                            class="font-bold"
                            :class="
                              isAnswerCorrect(questionIndex)
                                ? 'text-green-500'
                                : 'text-red-500'
                            "
                          >
                            {{ isAnswerCorrect(questionIndex) ? "回答正确" : "回答错误" }}
                          </div>
                        </div>

                        <div v-if="!isAnswerCorrect(questionIndex)" class="mb-2">
                          <span class="font-bold">本题的答案：</span>
                          <span class="text-green-500 font-bold">{{
                            getFormattedCorrectAnswer(questionIndex)
                          }}</span>
                        </div>

                        <div class="mb-2">
                          <span class="font-bold">本题得分：</span>
                          <span
                            :class="
                              isAnswerCorrect(questionIndex)
                                ? 'text-green-500'
                                : 'text-red-500'
                            "
                          >
                            {{ getQuestionScore(questionIndex) }} /
                            {{ exam.questions[questionIndex].score }}分
                          </span>
                        </div>

                        <div
                          v-if="exam.questions[questionIndex].explanation"
                          class="mt-2"
                        >
                          <div class="font-bold">答案解析：</div>
                          <div class="text-gray-700 mt-1">
                            {{ exam.questions[questionIndex].explanation }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧得分和答题卡 -->
        <div class="w-full lg:w-1/4">
          <!-- 得分卡片 -->
          <div class="bg-white rounded-lg shadow-md mb-6">
            <div class="bg-[#1771FD] rounded-t-lg p-4">
              <div class="text-center text-4xl font-bold text-white mb-2">
                {{ examResult.score }}分
              </div>
              <div class="text-center text-white mb-4">本次成绩</div>
            </div>

            <div class="space-y-2 p-4">
              <div class="flex justify-center">
                <span class="text-black">试卷总分：</span>
                <span>{{ examResult.totalScore }}分</span>
              </div>
              <div class="flex justify-center">
                <span class="text-black">及格分数：</span>
                <span>{{ examResult.passingScore }}分</span>
              </div>
              <div class="flex justify-center">
                <span class="text-black">考试用时：</span>
                <span>{{ examResult.usedTime }}</span>
              </div>
              <div class="flex justify-center">
                <span class="text-black">考试结果：</span>
                <span
                  class="font-bold"
                  :class="examResult.passed ? 'text-green-500' : 'text-red-500'"
                >
                  {{ examResult.passed ? "通过" : "未通过" }}
                </span>
              </div>
            </div>
          </div>

          <!-- 答题卡 -->
          <div class="bg-white rounded-lg shadow-md p-4">
            <div class="text-center text-black mb-4">答题卡</div>

            <div
              v-for="(section, sectionIndex) in exam.sections"
              :key="`card-section-${sectionIndex}`"
              class="mb-4"
            >
              <div class="bg-gray-100 p-2 rounded-md mb-2">
                {{ section.title.split("(")[0] }}
              </div>

              <div class="grid grid-cols-5 gap-2">
                <div
                  v-for="questionIndex in getQuestionIndicesForSection(section)"
                  :key="`card-question-${questionIndex}`"
                  class="w-10 h-10 rounded-md flex items-center justify-center cursor-pointer"
                  :class="{
                    'bg-green-500 text-white': isAnswerCorrect(questionIndex),
                    'bg-red-500 text-white':
                      !isAnswerCorrect(questionIndex) &&
                      examResult.userAnswers[questionIndex] !== undefined,
                    'bg-gray-200 text-gray-500':
                      examResult.userAnswers[questionIndex] === undefined,
                  }"
                  @click="scrollToQuestion(questionIndex)"
                >
                  {{ questionIndex + 1 }}
                </div>
              </div>
            </div>

            <div class="flex items-center mt-4">
              <div class="flex items-center mr-4">
                <div class="w-4 h-4 bg-green-500 rounded-sm mr-1"></div>
                <span class="text-sm text-black">正确</span>
              </div>
              <div class="flex items-center mr-4">
                <div class="w-4 h-4 bg-red-500 rounded-sm mr-1"></div>
                <span class="text-sm text-black">错误</span>
              </div>
              <div class="flex items-center">
                <div class="w-4 h-4 bg-gray-200 rounded-sm mr-1"></div>
                <span class="text-sm text-black">未答</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  IoStarOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "vue-icons-plus/io5";
import { AiFillStar } from "vue-icons-plus/ai";

// 考试数据
const exam = ref({
  id: 1,
  title: "笔面过考-全程考试",
  duration: 30 * 60, // 30分钟，以秒为单位
  totalScore: 100,
  passingScore: 60,
  sections: [
    {
      id: 1,
      title: "第一大题SECTION 1(共3题,每题9分,合计3.5分)",
      startQuestionIndex: 0,
      endQuestionIndex: 2,
    },
    {
      id: 2,
      title: "第二大题SECTION 1",
      startQuestionIndex: 3,
      endQuestionIndex: 5,
    },
  ],
  questions: [
    {
      id: 1,
      type: "singleChoice",
      content: "二进制数1011对应的十进制数是?",
      score: 1,
      options: [
        { value: "A", text: "9" },
        { value: "B", text: "10" },
        { value: "C", text: "11" },
        { value: "D", text: "12" },
      ],
      correctAnswer: "C",
      explanation:
        "1011二进制转换为十进制：1×2^3 + 0×2^2 + 1×2^1 + 1×2^0 = 8 + 0 + 2 + 1 = 11",
    },
    {
      id: 2,
      type: "fillBlank",
      content: '"小荷才露尖尖角"的下一句是 _____。',
      score: 2,
      correctAnswer: "早有蜻蜓立上头",
      explanation:
        '出自宋代杨万里的《小池》，全诗为"泉眼无声惜细流，树阴照水爱晴柔。小荷才露尖尖角，早有蜻蜓立上头。"',
    },
    {
      id: 3,
      type: "shortAnswer",
      content: "请详细写一写，您对于前段时间，某某城市的火灾救援事件，您的看法是什么?",
      score: 0.5,
    },
    {
      id: 4,
      type: "singleChoice",
      content: "本次题目为音频题，请点击下方音频认真聆听，回答问题?",
      score: 1,
      audioUrl: "/audio-sample.mp3",
      audioTitle: "大学英语四级听力考试",
      options: [
        { value: "A", text: "9" },
        { value: "B", text: "10" },
        { value: "C", text: "11" },
        { value: "D", text: "12" },
      ],
      correctAnswer: "B",
      explanation: "根据音频内容，正确答案是B选项。",
    },
    {
      id: 5,
      type: "imageChoice",
      content: "如图是三个面有图案的正方体，翻动了一个，下面（）是正确的样子。",
      score: 1,
      imageUrl: "/cube-question.png",
      imageOptions: [
        { value: "A", imageUrl: "/cube-option-a.png" },
        { value: "B", imageUrl: "/cube-option-b.png" },
        { value: "C", imageUrl: "/cube-option-c.png" },
        { value: "D", imageUrl: "/cube-option-d.png" },
      ],
      correctAnswer: "B",
      explanation: "根据空间几何原理，正确答案是B选项。",
    },
    {
      id: 6,
      type: "multipleChoice",
      content: "以下哪些是JavaScript的基本数据类型?",
      score: 2,
      options: [
        { value: "A", text: "String" },
        { value: "B", text: "Number" },
        { value: "C", text: "Array" },
        { value: "D", text: "Boolean" },
      ],
      correctAnswer: ["A", "B", "D"],
      explanation:
        "JavaScript的基本数据类型包括String、Number、Boolean、Undefined、Null、Symbol和BigInt。Array是引用类型，不是基本数据类型。",
    },
  ],
});

// 考试结果数据
const examResult = ref({
  examTitle: "笔面过考-全程考试",
  examTime: "2025-04-30 09:59:31 ~ 2025-04-30 09:59:31",
  usedTime: "70分钟",
  score: 60,
  totalScore: 100,
  passingScore: 60,
  passed: true,
  totalQuestions: 30,
  correctCount: 18,
  incorrectCount: 12,
  userAnswers: [
    "B", // 第1题，错误
    "早有蜻蜓立上头", // 第2题，正确
    "我认为这次火灾救援事件处理得非常及时，救援人员表现出了高度的专业素养和无私奉献精神。但也暴露出一些城市安全管理方面的问题，如消防通道被占用、消防设施不完善等。建议加强城市安全管理，提高市民安全意识，完善应急救援机制。", // 第3题，简答题
    "A", // 第4题，错误
    "B", // 第5题，正确
    ["A", "B"], // 第6题，部分正确
  ],
  questionScores: [
    0, // 第1题得分
    2, // 第2题得分
    0.5, // 第3题得分
    0, // 第4题得分
    1, // 第5题得分
    1, // 第6题得分
  ],
});

// 音频播放相关
const audioPlayers = ref({});
const isPlaying = ref({});
const audioProgress = ref({});
const audioCurrentTime = ref({});
const audioDuration = ref({});

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
  };
  return typeMap[type] || "未知题型";
};

// 更新音频进度
const updateAudioProgress = (questionIndex) => {
  if (!audioPlayers.value[questionIndex]) return;

  const currentTime = audioPlayers.value[questionIndex].currentTime;
  const duration = audioPlayers.value[questionIndex].duration;

  audioCurrentTime.value[questionIndex] = currentTime;
  audioProgress.value[questionIndex] = (currentTime / duration) * 100;
};

// 设置音频总时长
const setAudioDuration = (questionIndex) => {
  if (!audioPlayers.value[questionIndex]) return;
  audioDuration.value[questionIndex] = audioPlayers.value[questionIndex].duration;
};

// 播放/暂停音频
const toggleAudio = (questionIndex) => {
  if (!audioPlayers.value[questionIndex]) return;

  // 暂停所有其他音频
  Object.keys(audioPlayers.value).forEach((idx) => {
    if (idx !== questionIndex.toString() && audioPlayers.value[idx]) {
      audioPlayers.value[idx].pause();
      isPlaying.value[idx] = false;
    }
  });

  if (isPlaying.value[questionIndex]) {
    audioPlayers.value[questionIndex].pause();
  } else {
    audioPlayers.value[questionIndex].play();
  }

  isPlaying.value[questionIndex] = !isPlaying.value[questionIndex];
};

// 格式化时间 (秒 -> mm:ss)
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 检查答案是否正确
const isAnswerCorrect = (questionIndex) => {
  const question = exam.value.questions[questionIndex];
  const userAnswer = examResult.value.userAnswers[questionIndex];

  if (userAnswer === undefined) return false;

  if (question.type === "multipleChoice") {
    if (!Array.isArray(userAnswer) || !Array.isArray(question.correctAnswer))
      return false;

    // 检查用户答案是否与正确答案完全匹配
    if (userAnswer.length !== question.correctAnswer.length) return false;

    return (
      question.correctAnswer.every((ans) => userAnswer.includes(ans)) &&
      userAnswer.every((ans) => question.correctAnswer.includes(ans))
    );
  }

  if (question.type === "shortAnswer") {
    // 简答题由评分决定
    return examResult.value.questionScores[questionIndex] > 0;
  }

  return userAnswer === question.correctAnswer;
};

// 检查选项是否被选中
const isOptionSelected = (questionIndex, value) => {
  const userAnswer = examResult.value.userAnswers[questionIndex];
  return Array.isArray(userAnswer) && userAnswer.includes(value);
};

// 检查选项是否是正确答案
const isCorrectOption = (questionIndex, value) => {
  const correctAnswer = exam.value.questions[questionIndex].correctAnswer;
  return Array.isArray(correctAnswer) && correctAnswer.includes(value);
};

// 检查多选题选项是否正确选择
const isCorrectMultipleChoice = (questionIndex, value) => {
  const correctAnswer = exam.value.questions[questionIndex].correctAnswer;
  const userAnswer = examResult.value.userAnswers[questionIndex];

  return (
    Array.isArray(correctAnswer) &&
    correctAnswer.includes(value) &&
    Array.isArray(userAnswer) &&
    userAnswer.includes(value)
  );
};

// 检查多选题选项是否错误选择
const isIncorrectMultipleChoice = (questionIndex, value) => {
  const correctAnswer = exam.value.questions[questionIndex].correctAnswer;
  const userAnswer = examResult.value.userAnswers[questionIndex];

  return (
    (Array.isArray(userAnswer) &&
      userAnswer.includes(value) &&
      (!Array.isArray(correctAnswer) || !correctAnswer.includes(value))) ||
    (Array.isArray(correctAnswer) &&
      correctAnswer.includes(value) &&
      (!Array.isArray(userAnswer) || !userAnswer.includes(value)))
  );
};

// 获取格式化的正确答案
const getFormattedCorrectAnswer = (questionIndex) => {
  const correctAnswer = exam.value.questions[questionIndex].correctAnswer;

  if (Array.isArray(correctAnswer)) {
    return correctAnswer.join(", ");
  }

  return correctAnswer;
};

// 获取题目得分
const getQuestionScore = (questionIndex) => {
  return examResult.value.questionScores[questionIndex];
};

// 滚动到指定题目
const scrollToQuestion = (questionIndex) => {
  const questionElement = document.getElementById(`question-${questionIndex}`);
  if (questionElement) {
    questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// 打印考试结果
const printExamResult = () => {
  window.print();
};

// 组件挂载时
onMounted(() => {
  // 初始化音频相关数据
  exam.value.questions.forEach((question, index) => {
    if (question.audioUrl) {
      isPlaying.value[index] = false;
      audioProgress.value[index] = 0;
      audioCurrentTime.value[index] = 0;
      audioDuration.value[index] = 0;
    }
  });
});

// 组件卸载前
onBeforeUnmount(() => {
  // 暂停所有音频
  Object.values(audioPlayers.value).forEach((player) => {
    if (player) player.pause();
  });
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

@media print {
  .bg-gray-100 {
    background-color: white !important;
  }

  button {
    display: none !important;
  }

  .shadow-md {
    box-shadow: none !important;
  }

  .container {
    max-width: 100% !important;
    padding: 0 !important;
  }

  .rounded-lg,
  .rounded-md,
  .rounded-full {
    border-radius: 0 !important;
  }
}
</style>
