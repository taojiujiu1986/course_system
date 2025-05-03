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
          </li>
          <li class="flex items-center ml-4">
            <span class="mr-1">用户名称</span>
            <CgChevronDown class="h-4 w-4" />
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { CgChevronDown } from "vue-icons-plus/cg";

const router = useRouter();
const route = useRoute();

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

// 监听路由变化，更新活动导航项
watch(() => route.path, setActiveNavByRoute);

// 初始加载时设置活动导航项
onMounted(setActiveNavByRoute);
</script>

<style scoped>
.container {
  width: 1200px;
}
</style>
