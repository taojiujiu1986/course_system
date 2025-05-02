<template>
  <header class="bg-[#1771FD] text-white">
    <div class="container mx-auto px-4 flex items-center justify-between">
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
              'border-b-2 border-[#FDBB49] text-[#FDBB49] font-medium ': item.active,
            }"
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
import { ref } from "vue";
import { CgChevronDown } from "vue-icons-plus/cg";

const navItems = ref([
  { name: "课程学习", active: true },
  { name: "考试练习", active: false },
  { name: "培训活动", active: false },
  { name: "教育风采", active: false },
  { name: "训访档案", active: false },
  { name: "资源库", active: false },
  { name: "问卷调查", active: false },
  { name: "心理测评", active: false },
]);
</script>
