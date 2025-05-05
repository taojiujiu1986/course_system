<template>
  <header class="bg-[#1771FD] text-white">
    <div class="mx-auto px-4 flex items-center justify-around">
      <div class="flex items-center">
        <img src="../assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
        <h1 class="text-[24px] font-medium">贵州省公安队伍建设管理智慧平台</h1>
      </div>
      <nav class="flex items-center">
        <ul class="flex space-x-4">
          <li
            v-for="(item, index) in navItems"
            :key="index"
            class="relative px-2 py-1 cursor-pointer text-lg"
            style="line-height: 64px"
            :class="{
              'border-b-2 border-[#FDBB49] text-[#FDBB49] font-medium': item.active,
            }"
            @click="handleNavClick(item)"
          >
            {{ item.name }}
            <!-- <span v-if="tab.count" class="ml-1">({{ tab.count }})</span> -->
          </li>
          <li
            class="relative flex items-center ml-4 cursor-pointer"
            @click="toggleUserMenu"
          >
            <div class="flex items-center">
              <img
                :src="userInfo.avatar || getRandomAvatar(userInfo.nickname)"
                alt="用户头像"
                class="w-8 h-8 rounded-full mr-2 border-2 border-white"
              />
              <span class="mr-1">{{ userInfo.nickname }}</span>
              <CgChevronDown
                class="h-4 w-4"
                :class="{ 'transform rotate-180': showUserMenu }"
              />
            </div>

            <!-- 用户下拉菜单 -->
            <div
              v-if="showUserMenu"
              class="absolute top-full right-0 mt-1 w-36 bg-white rounded-md shadow-lg overflow-hidden z-50"
            >
              <div class="py-1">
                <div
                  class="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                  @click="goToUserCenter"
                >
                  <i class="fa fa-user mr-2 text-blue-500"></i>
                  <span>个人中心</span>
                </div>
                <div
                  class="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                  @click="logout"
                >
                  <i class="fa fa-sign-out mr-2 text-red-500"></i>
                  <span>退出系统</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch, reactive, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { CgChevronDown } from "vue-icons-plus/cg";

const router = useRouter();
const route = useRoute();
const showUserMenu = ref(false);
const userInfo = reactive({
  id: 0,
  nickname: "用户",
  avatar: "",
  deptId: 0,
});

// 用户头像缓存，确保同一用户始终使用同一头像
const avatarCache = new Map();

/**
 * 获取随机头像URL（当用户没有头像时使用）
 * @param {string} username - 用户名
 * @returns {string} - 头像URL
 */
const getRandomAvatar = (username) => {
  // 如果已经有缓存的头像，直接返回
  if (avatarCache.has(username)) {
    return avatarCache.get(username);
  }

  // 使用随机男性头像
  const avatarUrl = `https://randomuser.me/api/portraits/men/${Math.floor(
    Math.abs(hashCode(username)) % 100
  )}.jpg`;

  // 缓存结果
  avatarCache.set(username, avatarUrl);
  return avatarUrl;
};

// 简单的字符串哈希函数
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const navItems = ref([
  { name: "课程学习", active: false, path: "/course" },
  { name: "考试练习", active: false, path: "/exam" },
  { name: "培训活动", active: false, path: "/training" },
  { name: "教育风采", active: false, path: "/education" },
  { name: "训访档案", active: false, path: "/archives" },
  { name: "资源库", active: false, path: "/resources" },
  { name: "问卷调查", active: false, path: "/survey" },
  { name: "心理测评", active: false, path: "/psychological" },
]);

// 根据当前路由设置活动导航项
const setActiveNavByRoute = () => {
  const currentPath = route.path;
  navItems.value.forEach((item) => {
    // 简单路径匹配（如果路径以item.path开头，则认为是活动状态）
    item.active = currentPath.startsWith(item.path);
  });
};

// 点击导航项
const handleNavClick = (item) => {
  if (item.path) {
    router.push(item.path);
  }
};

// 切换用户菜单显示状态
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 跳转到个人中心
const goToUserCenter = () => {
  router.push("/user/profile");
  showUserMenu.value = false;
};

// 退出登录
const logout = () => {
  // 清除localStorage中的用户信息
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");

  // 跳转到登录页
  router.push("/login");
  showUserMenu.value = false;
};

// 从localStorage读取用户信息
const loadUserInfo = () => {
  try {
    const storedInfo = localStorage.getItem("user");
    if (storedInfo) {
      const parsedInfo = JSON.parse(storedInfo);
      if (parsedInfo.v) {
        let user = JSON.parse(parsedInfo.v);
        // 更新用户信息
        userInfo.id = user.user.id || 0;
        userInfo.nickname = user.user.nickname || "用户";
        userInfo.avatar = user.user.avatar || "";
        userInfo.deptId = user.user.deptId || 0;
      }
    }
  } catch (error) {
    console.error("Failed to parse user info from localStorage:", error);
  }
};

// 点击外部关闭用户菜单
const handleClickOutside = (event) => {
  const userMenuElement = document.querySelector(".relative.flex.items-center.ml-4");
  if (showUserMenu.value && userMenuElement && !userMenuElement.contains(event.target)) {
    showUserMenu.value = false;
  }
};

// 监听路由变化，更新活动导航项
watch(() => route.path, setActiveNavByRoute);

// 初始加载时设置活动导航项和加载用户信息
onMounted(() => {
  setActiveNavByRoute();
  loadUserInfo();

  // 添加点击外部关闭菜单的事件监听
  document.addEventListener("click", handleClickOutside);
});

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.container {
  width: 1200px;
}
</style>
