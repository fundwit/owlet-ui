<template>
  <div>
    <router-view></router-view>

    <div id="navigator">
      <div id="navigator-left" class="flex-row" style="position: fixed; top:5px; left: 5px;">
        <el-button-group size="mini">
          <el-button type="primary" :icon="Grid" @click="toHome">首页</el-button>
          <el-button type="primary" :icon="Collection" @click="toArticles">文档</el-button>
          <el-button type="primary" :icon="CollectionTag" @click="toAbout">标签</el-button>
        </el-button-group>
      </div>
      <div id="navigator-right" class="flex-row" style="position: fixed; top:5px; right: 5px;">
        <el-button-group size="mini">
          <el-button type="primary" :icon="User" @click="toAbout">User Profile</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Grid, Collection, CollectionTag, User } from '@element-plus/icons-vue'

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
  font-size: 12px;
}
.icon-label {
  display: flex;
  align-items: center;
}
.flex-row {
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.flex-h-center {
  justify-content: center;
}
.flex-h-right {
  justify-content: flex-end;
}
.flex-v-top {
  align-items: flex-start;
}
</style>
