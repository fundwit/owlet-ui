<template>
  <div id="background">
    <div id="article-page" v-if="article">
      <div id="header" class="title">
        <span v-if="!article.status">[稿]</span>
        <span v-if="article.is_top">[顶]</span>
        {{article.title}}
      </div>
      <div id="meta">
        <span :class="'property source source-'+article.source">{{articleSource.title}}</span>

        <span class="property"> <el-icon><MagicStick /></el-icon> {{article.create_time}}</span>
        <span class="property"> <el-icon><edit-pen /></el-icon> {{article.modify_time}}</span>

        <span class="property">分类: {{articleType.title}}</span>
        <span class="property">状态: {{articleState.title}}</span>

        <span class="property"><el-icon><View /></el-icon> {{article.view_num}}</span>
        <span class="property"><el-icon><chat-line-square /></el-icon> {{article.comment_num}}</span>
        <span class="property">
          <el-icon><collection-tag /></el-icon>
          <span style="margin-right:0.5em" v-for="tag in article.tags" v-bind:key="tag.id">{{tag.name}}</span>
        </span>
      </div>
      <div id="content">
        {{article.content}}
      </div>
    </div>
    <div v-else>
      loading
    </div>
  </div>
</template>

<script setup>
import {  CirclePlus } from '@element-plus/icons-vue'
import { Search,ArrowLeft, } from '@element-plus/icons-vue'
</script>


<script>
import { articleStore, articleSources, articleStates, articleTypes } from '../../client/articles'

export default {
  name: 'ArticleDetail',
  components: {
  },
  data () {
    return {
      articleId: null,
      article: null,
    }
  },
  computed: {
    articleState () {
      let state = articleStates[this.article.status]
      if (!state) {
        state = {title: this.article.status}
      }
      return state
    },
    articleType () {
      let type = articleTypes[this.article.type]
      if (!type) {
        type = {title: this.article.type}
      }
      return type
    },
    articleSource () {
      let source = articleSources[this.article.source]
      if (!source) {
        source = {title: this.article.source}
      }
      return source
    }
  },
  mounted () {
    this.articleId = this.$route.params.id
    this.loadArticle(this.articleId)
  },
  methods: {
    loadArticle(id) {
      const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.detailArticle(id).then((data) => {
        this.article = data
      }).catch((error) => {
        this.$notify.error({ title: 'Error', message: 'failed to load data: ' + error })
      }).finally(() => {
        mask.close()
      })
    },
  }
}
</script>

<style scoped>
.article-meta-block{
  padding: 0.5rem 0.8rem;
  margin-bottom: 0.5rem;
  border-width: 0 0 0 8px;
  border-style: solid;
  background-color: rgb(250, 250, 250);
  border-color: rgb(197, 229, 250);
}
.article-meta-block:hover {
  background-color: rgb(235, 248, 253);
}

.title {
  font-size: 2em;
}

#article-page {
  margin: 0 10%;
  margin-top: 1rem;
  border: 1px solid rgb(226, 225, 225);
}

#header {
  padding: 2rem 4rem;
  background-color: white;
}

#content {
  padding: 2rem 4rem;
  background-color: white;
  min-height: 400px;
}


#meta {
  padding: 0.6rem 4rem;
  background-color: rgb(250, 250, 250);
  border: 1px dashed rgb(226, 225, 225);
  border-width: 1px 0;
}

.top_sign {
  font-size: 1.2rem;
  color: rgb(53, 170, 248);
}

.source {
  color: white;
  font-size: 0.8rem;
  padding: 1px 6px;
  border-radius: 5px;
  background-color: lightgray;
}
.source-1 {
  background-color: green;
}
.source-2 {
  background-color: rgb(0, 102, 255);
}
.source-3 {
  background-color: rgb(196, 151, 5);
}
.source-4 {
  background-color: rgb(192, 95, 3);
}

.property {
  display: inline-block;
  margin: 0.2em 0.5em;
}
.article-status-0 {
  border-color: rgb(252, 241, 217);
}

.el-link {
    font-size: 1.2rem;
}
</style>
