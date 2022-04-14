<template>
  <div v-if="article" id="background">
    <div id="article-actions" class="flex-row flex-h-center flex-v-top">
      <div id="article-actions-box">
        <el-button type="success" :icon="Edit" circle @click="onEnterEdit"/>
        <el-button type="danger" :icon="Delete" circle @click="onDelete"/>
        <el-button type="primary" :icon="Expand" circle @click="onOpenOutline" v-if="!showOutline"/>
      </div>
    </div>

    <div id="container" class="flex-row flex-h-center flex-v-top">
      <div id="article-main">
        <div id="tag-images" class="flex-row flex-h-right">
          <span v-for="tag in article.tags" v-bind:key="tag.id">
            <img class="tag-image-box" v-if="tag.image" :src="'https://owlet.fundwit.com/assets/tag_icons/'+tag.image"/>
          </span>
        </div>
        <div id="header" class="title">
          <span v-if="!article.status">[稿]</span>
          <span v-if="article.is_top">[顶]</span>
          {{article.title}}
        </div>

        <div id="tags">
          <el-tag v-for="tag in article.tags" :key="tag.id" size="mini" closable :disable-transitions="false" @close="handleDeleteTagAssign(tag)">
            {{ tag.name }}
          </el-tag>

          <el-input v-if="inputVisible" size="small" style="width: 100px; margin-left: 5px;" ref="InputRef" v-model="updateForm.inputValue"
            @keyup.enter="handleCreateTagAssign" @blur="handleCreateTagAssign"/>
          <el-button v-else size="mini" @click="showInput">+ New Tag</el-button>
        </div>

        <div id="meta">
          <div class="flex-row">
            <span :class="'property source source-'+article.source">{{articleSource.title}}</span>

            <span class="property icon-label"> <el-icon><MagicStick /></el-icon> {{article.create_time}}</span>
            <span class="property icon-label"> <el-icon><edit-pen /></el-icon> {{article.modify_time}}</span>

            <span class="property icon-label">分类: {{articleType.title}}</span>
            <span class="property icon-label">状态: {{articleState.title}}</span>

            <span class="property icon-label"><el-icon><View /></el-icon> {{article.view_num}}</span>
            <span class="property icon-label"><el-icon><chat-line-square /></el-icon> {{article.comment_num}}</span>

            <span class="property icon-label">
              <el-icon><collection-tag /></el-icon>
              <span style="margin-right:0.5em" v-for="tag in article.tags" v-bind:key="tag.id"> {{tag.name}}</span>
            </span>
          </div>
        </div>

        <div id="content">
          <div id="editormd-view" class="markdown-body editormd-html-preview editormd-preview-container">
            <textarea id="editormd" v-model="article.content"></textarea>
          </div>
        </div>
      </div>

      <div id="article-extension" :style="{display: showOutline? 'block': 'none'}">
        <div style="position: fixed;">
          <div id="article-outline" :style="{display: showOutline ?'block':'none'}">
            <div id="article-outline-title" class="flex-row">
              <el-icon style="font-size: 20px" color="#409EFC"><Expand/></el-icon>
              <span style="flex-grow: 1"> 目录</span>
              <el-button @click="onCloseOutline" size="mini" type="danger" :icon="Close"></el-button>
            </div>
            <div id="toc-container" data-uk-scrollspy-nav="{closest:'li', smoothscroll:true, cls:'active'}">
              loading...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    loading
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'

import { Close, Expand, Edit, Delete, Search, CollectionTag } from '@element-plus/icons-vue'
import { ElInput, ElNotification, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()

const redirectToArticleList = function (id) {
  router.push({ name: 'articles' })
}
</script>

<script>
import { articleStore, articleSources, articleStates, articleTypes } from '../../client/articles'
import _ from 'lodash'

export default {
  name: 'ArticleView',
  components: {
  },
  data () {
    return {
      articleId: null,
      article: null,
      editor: null,
      showOutline: true,

      updateForm: {
        inputValue: "",
      },
      inputVisible: false,
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
    this.showOutline = window.localStorage["showOutline"] && window.localStorage["showOutline"] == 'true'

    this.loadArticle(this.articleId)
  },
  updated () {
    if (this.article && !this.editor) {
      this.initEditor()
    }
  },
  methods: {
    showInput () {
      this.inputVisible = true
      nextTick(() => {
        this.$refs.InputRef.focus()
      })
    },
    handleDeleteTagAssign(tag) {
      const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.deleteTagAssign(this.article.id, tag.id).then((data) => {
        this.article.tags = _.filter(this.article.tags, d => d.id != tag.id)
        ElNotification({ message: '更新成功', type: 'success', showClose: true})
      }).catch((error) => {
        ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
      }).finally(() => {
        mask.close()
      })
    },
    handleCreateTagAssign() {
      const val = this.updateForm.inputValue.trim()
      if (val) {
        const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
        articleStore.createTagAssign(this.article.id, val).then((resp) => {
          if (!this.article.tags) {
            this.article.tags = []
          }
          const data = resp.data
          this.article.tags.push({id: data.tagId, name: data.tagName, note: data.tagNote, image: data.tagImage})
          this.inputVisible = false
          this.updateForm.inputValue = ''
          ElNotification({ message: '更新成功', type: 'success', showClose: true})
        }).catch((error) => {
          ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
        }).finally(() => {
          mask.close()
        })
      } else {
        this.inputVisible = false
        this.updateForm.inputValue = ''
      }
    },
    initEditor() {
        this.editor = editormd.markdownToHTML("editormd-view", {
          markdown        : this.article.content, //$("#editormd").text() ,//+ "\r\n" + $("#append-test").text(),
          path            : "/assets/libs/editor.md/lib/",
          //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
          htmlDecode      : "style,script,iframe",  // you can filter tags decode
          toc             : true,
          tocm            : true,    // Using [TOCM]
          tocContainer    : "#toc-container", // 自定义 ToC 容器层
          //gfm             : false,
          //tocDropdown     : true,
          //markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
          emoji           : false,
          taskList        : true,
          tex             : true,  // 默认不解析
          flowChart       : true,  // 默认不解析
          sequenceDiagram : true,  // 默认不解析
          atLink          : false,

          change: function(){},
          onfullscreen: function(){},
          onfullscreenExit: function(){},
          onRendered : function(){},
          onload: function(){
            // load image-handle-paste
          }
        });
    },
    onCloseOutline () {
      this.showOutline = false
      window.localStorage["showOutline"]="false";
    },
    onOpenOutline () {
      this.showOutline = true
      window.localStorage["showOutline"]="true";
    },
    loadArticle(id) {
      const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.detailArticle(id).then((data) => {
        this.article = data
      }).catch((error) => {
        ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
      }).finally(() => {
        mask.close()
      })
    },
    onEnterEdit() {
      this.$emit('enter-edit', null)
    },
    onDelete () {
      const message = "将要删除文章'" + this.article.title +"'，删除后无法恢复。输入'DELETE' 确认删除操作。"
      ElMessageBox.prompt(message, '确认', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /DELETE/i,
        inputErrorMessage: '输入无效',
      }).then(({ value }) => {
        const mask = this.$loading({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
        articleStore.deleteArticle(this.article.id).then((data) => {
           mask.close()
          this.redirectToArticleList()
        }).catch((error) => {
           mask.close()
          ElNotification({ message: 'failed to handle request: ' + error, type: 'error', showClose: true})
        })
      }).catch((error) => {
        ElNotification({ message: 'Canceled', type: 'info', showClose: true})
      })
    }
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

#article-actions {
  position: relative;
  margin-top: 2px;
  height: 2.5rem;
}

#article-actions-box {
  position:fixed;
  z-index:100;
  padding: 2px 1rem;
}

#container {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}

#article-main {
  max-width: 900px;
  border: 1px solid rgb(226, 225, 225);
  background-color: white;
  position: relative;
  flex-shrink: 1;
  position:relative;
}

#article-extension{
  margin-left: 1rem;
  margin-right: 1rem;
  flex-shrink: 0;
  position: relative;
  width: 300px;
}

#article-outline{
  background-color: white;
  padding-bottom: 0.3rem;
  border: 1px solid rgb(226, 225, 225);
  position: fixed;
  width: 300px;
}
#article-outline-title {
  background-color: rgb(250, 250, 250);
  padding: 0.3rem 1rem;
  border: 0 dashed rgb(226, 225, 225);
  border-bottom-width: 1px;
}

#tag-images{
  pointer-events: none;
  position: absolute;
  flex-wrap: wrap;
  width: 350px;
  top: 3rem;
  right: 0rem;
}
.tag-image-box {
  pointer-events: none;
  opacity: 0.1;
  width: 350px;
}

#header {
  padding: 4rem 4rem 1rem 4rem;
  font-size: 2em;
}

#tags {
  padding: 0.2rem 4rem;
}

#tags .el-tag {
  margin-left: 5px;
}
#tags button {
  min-height: 1.2rem;
  padding: 0.2rem 0.5rem;
  margin-left: 5px;
}
#tags .el-input input {
  height: 20px !important;
  line-height: 20px !important;
  margin-left: 5px;
}

#content {
  padding: 2rem 4rem;
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
  background-color: rgb(196, 151, px);
}
.source-4 {
  background-color: rgb(192, 95, 3);
}

.property {
  margin: 0.2em 0.5em;
}
.article-status-0 {
  border-color: rgb(252, 241, 217);
}

.el-link {
    font-size: 1.2rem;
}
</style>
