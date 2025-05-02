<template>
  <div class="course-detail">
    <!-- Header Section -->
    <header class="header">
      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item"><a href="#home">Home</a></li>
          <li class="nav-item"><a href="#about">About</a></li>
          <li class="nav-item"><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero-title">Course Details</h1>
      <p class="hero-subtitle">Explore the course you're interested in.</p>
    </section>

    <!-- Course Details Section -->
    <section class="course-details">
      <h2 class="course-title">Course Title</h2>
      <p class="course-description">This is a detailed description of the course.</p>
      <div class="course-info">
        <span class="info-item">Duration: 3 months</span>
        <span class="info-item">Level: Beginner</span>
        <span class="info-item">Price: $99</span>
      </div>
      <button class="enroll-btn">Enroll Now</button>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
      <p class="footer-text">Copyright 2023. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Define your reactive state here
const courseDetails = ref({
  title: "Course Title",
  description: "This is a detailed description of the course.",
  duration: "3 months",
  level: "Beginner",
  price: "$99",
});
</script>

<style scoped>
.course-detail {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.header {
  background-color: #f8f9fa;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.nav-item {
  margin-right: 20px;
}

.nav-item a {
  text-decoration: none;
  color: #333;
}

.hero {
  padding: 100px 0;
  background-color: #f2f2f2;
  text-align: center;
}

.hero-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.hero-subtitle {
  font-size: 18px;
  color: #666;
}

.course-details {
  padding: 50px 0;
}

.course-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.course-description {
  margin-top: 20px;
  color: #666;
}

.course-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.info-item {
  font-size: 16px;
  color: #666;
}

.enroll-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.enroll-btn:hover {
  background-color: #0056b3;
}

.footer {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  color: #666;
}
</style>
