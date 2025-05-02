<template>
  <footer class="bg-[#1771FD] text-white py-6">
    <div class="container mx-auto px-4">
      <div class="flex justify-between gap-6">
        <div class="flex flex-col">
          <div class="mb-2">
            <span class="font-medium">邮编：</span>
            <span>336000</span>
          </div>
          <div class="mb-2">
            <span class="font-medium">电话：</span>
            <span>0371-00000000</span>
          </div>
          <div>
            <span class="font-medium">地址：</span>
            <span>江西省南昌市红谷滩区丰和南大道</span>
          </div>
        </div>
        <div class="w-px h-full bg-gray-300 mx-4"></div>
        <div class="flex flex-col">
          <div class="mb-2">
            <span class="font-medium">邮箱：</span>
            <span>zxst_tyq@163.com</span>
          </div>
          <div class="mb-2">
            <span class="font-medium">技术支持：</span>
            <span>北京智信数图科技有限公司</span>
          </div>
          <div>
            <span>&copy; 2017-2022 智信数图 京ICP备14039810号-2</span>
          </div>
        </div>
        <div class="w-px h-full bg-gray-300 mx-4"></div>
        <div class="flex justify-center md:justify-end items-center">
          <div class="text-center">
            <img src="/qrcode.png" alt="QR Code" class="w-24 h-24 mx-auto mb-2" />
            <div class="text-sm">公众号二维码</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
</style>
