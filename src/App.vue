<template>
  <div>
    <router-view></router-view>

    <div id="navigator">
      <div id="navigator-left" class="flex-row" style="position: fixed; top:2px; left: 5px; z-index:1000;" @mouseleave="onMouseLevelMainMenu">
        <el-button v-if="!showNavigator" type="primary" :icon="Collection" circle
         @click="toHome" @mouseenter="onMouseEnterMenu" @mouseleave="onMouseLevelMenu"></el-button>
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

    <div id="footer">
      <div style="text-align: center;">
        <span v-if="serviceInfos.meta.brand">
          {{serviceInfos.meta.brand.license}}
          -
          {{serviceInfos.meta.brand.copyright}}
        </span>
        <span v-else>......</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Grid, Collection, CollectionTag, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'
import { articleStore } from './client/articles'

const router = useRouter()
const showNavigator = ref(false)
const serviceInfos = reactive({
  meta: {}
})
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
onMounted(()=>{
  articleStore.serviceMeta().then((resp) => {
    serviceInfos.meta = resp.data
  }).catch((error) => {
    console.log("failed to load meta info: " + error)
  })
})

</script>

<style>
.CodeMirror-code {
  font-family: Menlo, Monaco, 'Courier New', monospace !important;
}
code {
  font-family: Menlo, Monaco, 'Courier New', monospace !important;
  font-size: 0.8em !important;
}

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
#footer {
  padding: 0.2rem 0;
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
