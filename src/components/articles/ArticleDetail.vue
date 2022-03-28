<template>
  <ArticleEdit v-if="editing" @cancel-edit="editing=false"/>
  <ArticleView v-else @enter-edit="editing=true"/>
</template>

<script setup>
import { Close, Expand } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import ArticleEdit from './ArticleEdit.vue'
import ArticleView from './ArticleView.vue'
</script>

<script>
import { articleStore, articleSources, articleStates, articleTypes } from '../../client/articles'

export default {
  name: 'ArticleDetail',
  components: {
  },
  data () {
    return {
      editing: false,
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
