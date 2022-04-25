<template>
  <div>
    <router-view></router-view>

    <div id="navigator">
      <div id="navigator-left" class="flex-row" style="position: fixed; top:2px; left: 5px; z-index:1000;" @mouseleave="onMouseLevelMainMenu">
        <el-button v-if="!showNavigator" type="primary" :icon="Collection" circle
         @click="toArticles" @mouseenter="onMouseEnterMenu" @mouseleave="onMouseLevelMenu"></el-button>
        <el-button-group v-else size="small" @mouseenter="onMouseEnterMainMenu">
          <el-button type="primary" :icon="Grid" @click="toHome">首页</el-button>
          <el-button type="primary" :icon="Collection" @click="toArticles">文档</el-button>
          <el-button type="primary" :icon="CollectionTag" @click="toAbout">标签</el-button>
        </el-button-group>
      </div>
      <div id="navigator-right" class="flex-row" style="position: fixed; top:2px; right: 5px; z-index:1000;">
        <el-button type="primary" :icon="User" circle @click="toAbout"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Grid, Collection, CollectionTag, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import {ref} from 'vue'

const router = useRouter()
const showNavigator = ref(false)
let mainMenuCloseTimer = 0
let mainMenuExpendTimer = 0

const onMouseEnterMenu = () => {
  mainMenuExpendTimer = setTimeout(()=>{
    showNavigator.value = true
  }, 1000)
}

const onMouseLevelMenu = () => {
  clearTimeout(mainMenuExpendTimer)
}

const onMouseLevelMainMenu = () => {
  mainMenuCloseTimer = setTimeout(()=>{
    showNavigator.value = false
  }, 3000)
}
const onMouseEnterMainMenu = () => {
  clearTimeout(mainMenuCloseTimer)
  showNavigator.value = true
}


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
