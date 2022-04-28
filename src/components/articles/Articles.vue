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
      <el-pagination background layout="prev, pager, next" :currentPage="currentPage" :total="totalItems" :page-size="10"
        :hide-on-single-page="false" @current-change="onPageChange"/>
    </div>
  </div>

</template>

<script setup>
import { Search,ArrowLeft, CirclePlus } from '@element-plus/icons-vue'
import ArticleMeta from './ArticleMeta.vue'
import ArticleNew from './ArticleNew.vue'
import { ElNotification, ElPagination } from 'element-plus'
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
      totalItems: 0,
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
    onPageChange(page) {
      this.loadArticles(page)
    },
    loadArticles (page) {
      if (!page || page < 1) {
        page = 1
      }
      const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.queryArticles(this.query.searchKeyword, page).then((resp) => {
        this.articleCollection = resp.data
        this.currentPage = page
        this.totalItems = parseInt(resp.headers["x-total"], 10)
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
