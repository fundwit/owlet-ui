<template>
  <div style="margin:0 10%">
    <!-- <el-icon><search/> </el-icon> -->

      <el-input v-model="searchKeyword" size="small" style="margin: 1em 0; width: 300px" placeholder="Please input" @change="onSearchBlur">
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>


    <article-meta v-for="articleMeta in articleCollection" :article-meta="articleMeta" v-bind:key="articleMeta.id"/>

    <div style="margin: 1em 0;">
      page: {{currentPage}}
      <el-button-group>
        <el-button size="small" :icon="ArrowLeft" @click="onPrePage"></el-button>
        <el-button size="small" @click="onNextPage">
          <el-icon class="el-icon--right"><arrow-right /></el-icon>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import {  CirclePlus } from '@element-plus/icons-vue'
import { Search,ArrowLeft, } from '@element-plus/icons-vue'
import ArticleMeta from './ArticleMeta.vue'
</script>


<script>
import { articleStore } from '../../client/articles'

export default {
  name: 'Articles',
  components: {
  },
  data () {
    return {
      searchKeyword: "",
      currentPage: 1,
      articleCollection: null
    }
  },
  mounted () {
    this.loadArticles(1)
  },
  methods: {
    onSearchBlur() {
        this.loadArticles(1)
    },
    onPrePage() {
      this.loadArticles(this.currentPage - 1)
    },
    onNextPage() {
       this.loadArticles(this.currentPage + 1)
    },
    loadArticles (page) {
      if (!page || page < 1) {
        page = 1
      }
      const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.queryArticles(this.searchKeyword, page).then((resp) => {
        this.articleCollection = resp
        this.currentPage = page
      }).catch((error) => {
        this.$notify.error({ title: 'Error', message: 'failed to load data: ' + error })
      }).finally(() => {
        mask.close()
      })
    }
  }
}
</script>

<style scoped>
</style>
