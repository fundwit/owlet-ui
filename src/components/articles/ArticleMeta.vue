<template>
  <div style="position: relative;" v-if="articleMeta" :class="'article-meta-block article-status-'+articleMeta.status" >
    <div style="position:absolute; z-index:0; top:0.5em; right:0.8em;">
      <span v-for="tag in articleMeta.tags" v-bind:key="tag.id">
        <img v-if="tag.image"  height="60" :src="'https://owlet.fundwit.com/assets/tag_icons/'+tag.image"/>
      </span>
    </div>

    <div style="position:absolute; top:1.2em; left:0.1em;">
      <el-icon class="top_sign" v-if="articleMeta.is_top"><LocationInformation /></el-icon>
    </div>

    <div>
      <div class="title">
        <el-link :href="'/articles/'+articleMeta.id">{{articleMeta.title}}</el-link>
        <el-link :href="'https://owlet.fundwit.com/article/'+articleMeta.id" target="_blank"> [View]</el-link>
      </div>
      <div>
        <span :class="'property source source-'+articleMeta.source">{{articleSource.title}}</span>

        <span class="property"> <el-icon><MagicStick /></el-icon> {{articleMeta.create_time}}</span>
        <span class="property"> <el-icon><edit-pen /></el-icon> {{articleMeta.modify_time}}</span>

        <span class="property">分类: {{articleType.title}}</span>
        <span class="property">状态: {{articleState.title}}</span>

        <span class="property"><el-icon><View /></el-icon> {{articleMeta.view_num}}</span>
        <span class="property"><el-icon><chat-line-square /></el-icon> {{articleMeta.comment_num}}</span>
        <span class="property">
          <el-icon><collection-tag /></el-icon>
          <span style="margin-right:0.5em" v-for="tag in articleMeta.tags" v-bind:key="tag.id">{{tag.name}}</span>
        </span>
      </div>
    </div>
  </div>
  <div v-else class="article-meta-block">
    no data
  </div>
</template>

<script setup>
import {  CirclePlus } from '@element-plus/icons-vue'
import { Search,ArrowLeft, } from '@element-plus/icons-vue'
</script>


<script>
import { articleSources, articleStates, articleTypes } from '../../client/articles'

export default {
  name: 'ArticleMeta',
  components: {
  },
  props: {
    articleMeta: null
  },
  data () {
    return {
    }
  },
  computed: {
    articleState () {
      let state = articleStates[this.articleMeta.status]
      if (!state) {
        state = {title: this.articleMeta.status}
      }
      return state
    },
    articleType () {
      let type = articleTypes[this.articleMeta.type]
      if (!type) {
        type = {title: this.articleMeta.type}
      }
      return type
    },
    articleSource () {
      let source = articleSources[this.articleMeta.source]
      if (!source) {
        source = {title: this.articleMeta.source}
      }
      return source
    }
  },
  mounted () {
  },
  methods: {
    onSearchBlur() {
    },
  }
}
</script>

<style scoped>
.article-meta-block{
  padding: 0.5em 0.8em;
  margin-bottom: 0.5em;
  border-width: 0 0 0 8px;
  border-style: solid;
  background-color: white;
  border-color: rgb(197, 229, 250);
}
.article-meta-block:hover {
  background-color: rgb(235, 248, 253);
}

.title {
  margin: 0.5em;
}

.top_sign {
  font-size: 1.2em;
  color: rgb(53, 170, 248);
}
.source {
  color: white;
  font-size: 0.8em;
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
    font-size: 1.2em;
}
</style>
