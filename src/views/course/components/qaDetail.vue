<template>
  <div>
    <!-- 问题内容 -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-gray-800 mb-4">
        {{ question ? question.title : '课程标题：当今社会这么多人选择考研，考研的意义是什么？' }}
      </h3>

      <div class="bg-gray-50 p-4 rounded-md text-gray-700">
        <div class="flex justify-between mb-3">
          <div class="flex items-center gap-2">
            <img 
              :src="getRandomAvatar(question ? question.user : '学员0111')" 
              alt="用户头像" 
              class="w-8 h-8 rounded-full" 
            />
            <span class="font-medium">{{ question ? question.user : '学员0111' }}</span>
          </div>
          <div class="text-gray-500">{{ question ? question.time : '2025-01-01 20:20:20' }}</div>
        </div>
        <p class="mb-2">
          {{ question ? question.content : '一、学术追求 对所学专业由入门到入述，视悟术有继续研究下去的必要，因而考研，期待在学术上有所建树。这是研究生的本来含义，也是最原始意义上的考研动机。二、延时就业 专科生怕大于求，本科生供需持平，研究生供不应求，这是今年大学生面临的就业形势。谁都看得出来，如今研究生是人才市场上的"香饽饽"。而且，意到就士文凭，使你多了一个进入大城市工作的敲门砖，为了日后谋求工作的自由，想想你的这点自由是什么？' }}
        </p>
      </div>
    </div>

    <!-- 评论区 -->
    <div>
      <h3 class="text-lg font-bold text-gray-800 mb-4">发表评论 (245)</h3>

      <!-- 评论输入框 -->
      <div class="mb-4">
        <textarea
          v-model="commentText"
          placeholder="请输入评论内容"
          class="w-full border border-gray-300 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
        <div class="flex justify-end mt-2">
          <button
            class="px-4 py-2 bg-[#1771FD] text-white rounded-md hover:bg-blue-600 transition"
            @click="submitComment"
          >
            发表评论
          </button>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="space-y-6">
        <!-- 评论项1 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <img
              :src="getRandomAvatar('爱学习的涛涛')"
              alt="用户头像"
              class="w-10 h-10 rounded-full"
            />
          </div>
          <div class="flex-1">
            <div class="flex mb-1 flex-col">
              <h4 class="font-bold text-blue-500 mr-2">爱学习的涛涛</h4>
              <span class="text-gray-500">刚刚</span>
            </div>
            <p class="text-gray-700 mb-2">老师讲的非常好，受益匪浅！</p>
            <div class="flex justify-end items-center space-x-4">
              <button class="flex items-center text-gray-500" @click="replyToComment">
                <EpChatDotSquare class="w-4 h-4 mr-1" />
                <span>评论</span>
              </button>
              <button class="flex items-center text-gray-500" @click="likeComment">
                <IpGoodTwo class="w-4 h-4 mr-1" />
                <span>20</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 评论项2 -->
        <div class="flex gap-4">
          <div class="flex-shrink-0">
            <img
              :src="getRandomAvatar('爱思考的飞飞')"
              alt="用户头像"
              class="w-10 h-10 rounded-full"
            />
          </div>
          <div class="flex-1">
            <div class="flex mb-1 flex-col">
              <h4 class="font-bold text-blue-500 mr-2">爱思考的飞飞</h4>
              <span class="text-gray-500">2天前</span>
            </div>
            <p class="text-gray-700 mb-2">老师讲的非常好，受益匪浅！</p>
            <div class="flex justify-end items-center space-x-4 mt-2">
              <button class="flex items-center text-gray-500" @click="replyToComment">
                <EpChatDotSquare class="w-4 h-4 mr-1" />
                <span>评论</span>
              </button>
              <button class="flex items-center text-gray-500" @click="likeComment">
                <IpGoodTwo class="w-4 h-4 mr-1" />
                <span>20</span>
              </button>
            </div>
            <!-- 回复 -->
            <div class="bg-gray-50 p-3 rounded-md mb-2 mt-2">
              <div class="mb-3">
                <div class="flex mb-1 flex-col">
                  <h4 class="font-bold text-blue-500 mr-2">爱洗澡的唐老师</h4>
                  <span class="text-gray-500">1天前</span>
                </div>
                <p class="text-gray-700">我也觉得老师讲的非常好，受益匪浅！</p>
              </div>
              <div class="flex justify-end items-center space-x-4">
                <button class="flex items-center text-gray-500" @click="replyToReply">
                  <EpChatDotSquare class="w-4 h-4 mr-1" />
                  <span>评论</span>
                </button>
                <button class="flex items-center text-gray-500" @click="likeComment">
                  <IpGoodTwo class="w-4 h-4 mr-1" />
                  <span>20</span>
                </button>
              </div>
            </div>

            <!-- 回复2 -->
            <div class="bg-gray-50 p-3 rounded-md mb-2">
              <div class="mb-3">
                <div class="flex mb-1 flex-col">
                  <h4 class="font-bold text-blue-500 mr-2">爱洗澡的唐老师</h4>
                  <span class="text-gray-500">1天前</span>
                </div>
                <p class="text-gray-700">老师确实讲的非常好，受益匪浅！</p>
              </div>
              <div class="flex justify-end items-center space-x-4">
                <button class="flex items-center text-gray-500" @click="replyToReply">
                  <EpChatDotSquare class="w-4 h-4 mr-1" />
                  <span>评论</span>
                </button>
                <button class="flex items-center text-gray-500" @click="likeComment">
                  <IpGoodTwo class="w-4 h-4 mr-1" />
                  <span>20</span>
                </button>
              </div>
            </div>

            <div class="text-center">
              <a href="#" class="text-blue-500 hover:underline"
                >查看全部72条评论</a
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 查看更多 -->
      <div class="text-center mt-6">
        <a href="#" class="text-blue-500 hover:underline">查看更多评论</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { EpChatDotSquare } from "vue-icons-plus/ep";
import { IpGoodTwo } from "vue-icons-plus/ip";

const props = defineProps({
  question: {
    type: Object,
    default: null
  }
});

const commentText = ref("");

// 用户头像缓存，确保同一用户始终使用同一头像
const avatarCache = reactive(new Map());

/**
 * 获取随机头像URL
 * @param {string} username - 用户名（用作种子以确保同一用户获得同一头像）
 * @returns {string} - 头像URL
 */
const getRandomAvatar = (username) => {
  // 如果已经有缓存的头像，直接返回
  if (avatarCache.has(username)) {
    return avatarCache.get(username);
  }
  
  // 可用的头像API选项
  const avatarApis = [
    // 随机动物头像
    () => `https://placeimg.com/200/200/animals?${Math.random()}`,
    // 随机抽象头像
    () => `https://avatars.dicebear.com/api/bottts/${encodeURIComponent(username)}.svg`,
    // 随机像素头像
    () => `https://avatars.dicebear.com/api/pixel-art/${encodeURIComponent(username)}.svg`,
    // 随机卡通头像
    () => `https://avatars.dicebear.com/api/avataaars/${encodeURIComponent(username)}.svg`,
    // 随机彩色几何头像
    () => `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(username)}.svg`,
    // 随机男性头像
    () => `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`,
    // 随机女性头像
    () => `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 100)}.jpg`,
  ];
  
  // 使用字符串散列函数生成一个一致的随机数
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };
  
  // 根据用户名选择API
  const apiIndex = hashCode(username) % avatarApis.length;
  const avatarUrl = avatarApis[apiIndex]();
  
  // 将结果缓存，确保同一用户每次获取相同头像
  avatarCache.set(username, avatarUrl);
  
  return avatarUrl;
};

const submitComment = () => {
  console.log("提交评论:", commentText.value);
  // 这里添加提交评论的逻辑
  commentText.value = "";
};

const replyToComment = () => {
  console.log("回复评论");
  // 这里添加回复评论的逻辑
};

const replyToReply = () => {
  console.log("回复回复");
  // 这里添加回复的回复的逻辑
};

const likeComment = () => {
  console.log("点赞评论");
  // 这里添加点赞评论的逻辑
};
</script>
