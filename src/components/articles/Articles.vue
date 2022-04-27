<template>
  <div v-if="creating">
    <article-new @cancel-edit="creating=false"/>
  </div>
  <div v-else style="margin:0 auto; max-width: 900px;">
    <el-button size="mini" style="margin-right: 5px" type="success" @click="creating=true">+New</el-button>
    <el-input v-model="query.searchKeyword" size="small" style="margin: 1em 0; width: 300px" placeholder="Please input" @change="onSearchBlur">
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
import ArticleNew from './ArticleNew.vue'
import { ElNotification } from 'element-plus'
</script>


<script>
import { articleStore } from '../../client/articles'

export default {
  name: 'Articles',
  components: {
  },
  data () {
    return {
      query: {
        searchKeyword: null,
      },
      currentPage: 1,
      articleCollection: null,
      creating: false
    }
  },
  mounted () {
    document.title = "Articles"
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
      articleStore.queryArticles(this.query.searchKeyword, page).then((resp) => {
        this.articleCollection = resp
        this.currentPage = page
      }).catch((error) => {
        ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
      }).finally(() => {
        mask.close()
      })
    }
  }
}
</script>

<style scoped>
</style>
