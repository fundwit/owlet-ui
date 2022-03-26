<template>
  <div>
    <div id="navigator">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item @click="toHome" index="1">
          <template #title>
            <el-icon><grid/> </el-icon>
            <span>首页</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="toArticles" index="2">
          <template #title>
            <el-icon><collection/> </el-icon>
            <span>文档</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="toAbout" index="3">
          <template #title>
            <el-icon><files/> </el-icon>
            <span>系列</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="toAbout" index="4">
          <template #title>
            <el-icon><knife-fork/> </el-icon>
            <span>工具</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="toAbout" index="5">
          <template #title>
            <el-icon><promotion/> </el-icon>
            <span>链接</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="toAbout" index="6">
          <template #title>
            <el-icon><collection-tag/> </el-icon>
            <span>标签</span>
          </template>
        </el-menu-item>
        <el-menu-item index="7">
          <template #title>
            <el-icon><user/> </el-icon>
            <span>User</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useRouter } from 'vue-router'
const router = useRouter()

const toHome = (() => {
  router.push({
    name: 'home'
  })
})
const toArticles = (() => {
  router.push({
    name: 'articles'
  })
})
const toAbout = (() => {
  router.push({
    name: 'about'
  })
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
}
body {
  margin: 0;
  background-color: rgb(240, 240, 240);
}
</style>
