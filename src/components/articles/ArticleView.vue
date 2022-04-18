<template>
  <div v-if="data.article" id="background">
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
          <span v-for="tag in data.article.tags" v-bind:key="tag.id">
            <img class="tag-image-box" v-if="tag.image" :src="'https://owlet.fundwit.com/assets/tag_icons/'+tag.image"/>
          </span>
        </div>
        <div id="header" class="title">
          <span v-if="!data.article.status">[稿]</span>
          <span v-if="data.article.is_top">[顶]</span>
          {{data.article.title}}
        </div>

        <div id="tags">
          <el-tag v-for="tag in data.article.tags" :key="tag.id" size="mini" closable :disable-transitions="false" @close="handleDeleteTagAssign(tag)">
            {{ tag.name }}
          </el-tag>

          <el-input v-if="tagEdit.inputVisible" size="small" style="width: 100px; margin-left: 5px;" ref="InputRef" v-model="tagEdit.inputValue"
            @keyup.enter="handleCreateTagAssign" @blur="handleCreateTagAssign"/>
          <el-button v-else size="mini" @click="showTagInput">+ New Tag</el-button>
        </div>

        <div id="meta">
          <div class="flex-row">
            <span :class="'property source source-'+data.article.source">{{articleSource.title}}</span>

            <span class="property icon-label"> <el-icon><MagicStick /></el-icon> {{data.article.create_time}}</span>
            <span class="property icon-label"> <el-icon><edit-pen /></el-icon> {{data.article.modify_time}}</span>

            <span class="property icon-label">分类: {{articleType.title}}</span>
            <span class="property icon-label">状态: {{articleState.title}}</span>

            <span class="property icon-label"><el-icon><View /></el-icon> {{data.article.view_num}}</span>
            <span class="property icon-label"><el-icon><chat-line-square /></el-icon> {{data.article.comment_num}}</span>

            <span class="property icon-label">
              <el-icon><collection-tag /></el-icon>
              <span style="margin-right:0.5em" v-for="tag in data.article.tags" v-bind:key="tag.id"> {{tag.name}}</span>
            </span>
          </div>
        </div>

        <div id="content">
          <div id="editormd-view" class="markdown-body editormd-html-preview editormd-preview-container">
            <textarea id="editormd" v-model="data.article.content"></textarea>
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

<script>
import { Close, Expand, Edit, Delete, Search, CollectionTag } from '@element-plus/icons-vue'
import { ElInput, ElLoading, ElNotification, ElMessageBox } from 'element-plus'
import { articleStore, articleSources, articleStates, articleTypes } from '../../client/articles'
import _ from 'lodash'
import { nextTick, reactive, ref, computed, onMounted, onUpdated } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup(props, ctx) {
    const router = useRouter()
    const route = useRoute()

    const articleId = ref(0)
    const data = reactive({
      article: {}
    })
    const showOutline = ref(true)
    const tagEdit = reactive({
      inputVisible: false,
      inputValue: ""
    })

    let editor = null

    const redirectToArticleList = function (id) {
      router.push({ name: 'articles', replace: true })
    }

    const articleState = computed(()=>{
      let state = articleStates[data.article.status]
      if (!state) {
        state = {title: data.article.status}
      }
      return state
    })
    const articleType = computed(()=>{
      let type = articleTypes[data.article.type]
      if (!type) {
        type = {title: data.article.type}
      }
      return type
    })
    const articleSource = computed(()=>{
      let source = articleSources[data.article.source]
      if (!source) {
        source = {title: data.article.source}
      }
      return source
    })

    const showTagInput = () => {
      tagEdit.inputVisible = true
      nextTick(() => {
        //this.$refs.InputRef.focus()
      })
    }

    const handleDeleteTagAssign = (tag) => {
      const loading = ElLoading.service({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.deleteTagAssign(data.article.id, tag.id).then((res) => {
        data.article.tags = _.filter(data.article.tags, d => d.id != tag.id)
        ElNotification({ message: '更新成功', type: 'success', showClose: true})
      }).catch((error) => {
        ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
      }).finally(() => {
        loading.close()
      })
    }

    const handleCreateTagAssign = () => {
      const val = tagEdit.inputValue.trim()
      if (val) {
        const loading = ElLoading.service({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
        articleStore.createTagAssign(data.article.id, val).then((resp) => {
          if (!data.article.tags) {
            data.article.tags = []
          }
          const tagAssign = resp.data
          data.article.tags.push({id: tagAssign.tagId, name: tagAssign.tagName, note: tagAssign.tagNote, image: tagAssign.tagImage})
          tagEdit.inputVisible = false
          tagEdit.inputValue = ''
          ElNotification({ message: '更新成功', type: 'success', showClose: true})
        }).catch((error) => {
          ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
        }).finally(() => {
          loading.close()
        })
      } else {
        tagEdit.inputVisible = false
        tagEdit.inputValue = ''
      }
    }

    const initEditor = () => {
      editor = editormd.markdownToHTML("editormd-view", {
        markdown        : data.article.content, //$("#editormd").text() ,//+ "\r\n" + $("#append-test").text(),
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
      })
    }

    const onCloseOutline = () => {
      showOutline.value = false
      window.localStorage["showOutline"]="false";
    }
    const onOpenOutline = () => {
      showOutline.value = true
      window.localStorage["showOutline"]="true";
    }
    const loadArticle = (id) => {
      const loading = ElLoading.service({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      articleStore.detailArticle(id).then((res) => {
        data.article = res
        nextTick(() => {
          initEditor()
        })
      }).catch((error) => {
        ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
      }).finally(() => {
        loading.close()
      })
    }
    const onEnterEdit = () => {
      ctx.emit('enter-edit', null)
    }
    const onDelete = () => {
      const message = "将要删除文章'" + data.article.title +"'，删除后无法恢复。输入'DELETE' 确认删除操作。"
      ElMessageBox.prompt(message, '确认', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /DELETE/i,
        inputErrorMessage: '输入无效',
      }).then(({ value }) => {
        const loading = ElLoading.service({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
        articleStore.deleteArticle(data.article.id).then((data) => {
          loading.close()
          redirectToArticleList()
        }).catch((error) => {
          loading.close()
          ElNotification({ message: 'failed to handle request: ' + error, type: 'error', showClose: true})
        })
      }).catch((error) => {
        ElNotification({ message: 'Canceled', type: 'info', showClose: true})
      })
    }

    onMounted(()=>{
      articleId.value = route.params.id
      showOutline.value = window.localStorage["showOutline"] && window.localStorage["showOutline"] == 'true'
      loadArticle(articleId.value)
    })

    return {
      articleId,
      data,
      showOutline,
      tagEdit,
      articleStates,
      articleTypes,
      articleSources,
      articleState,
      articleType,
      articleSource,
      showTagInput,
      handleDeleteTagAssign,
      handleCreateTagAssign,
      onCloseOutline,
      onOpenOutline,
      loadArticle,
      onEnterEdit,
      onDelete,
      Edit,
      Delete,
      Close,
      Expand
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
