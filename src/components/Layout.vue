<template>
  <div class="layout">
    <Header></Header>
    <main class="main">
      <router-view></router-view>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";

export default {
  name: "Layout",
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  background: #ececec;
}
</style>
