<template>
  <div>
    <form id="edit-form">
      <div id="background" style="margin: 0 3rem;" class="flex-row flex-h-center flex-v-top">
        <span v-if="article.is_top">[顶]</span>

        <div class="title">
          <el-input name="title" size="mini" style="width: 600px; font-size: 1.3rem;" v-model="article.title" placeholder="Please input title" />
        </div>

        <div>
          <el-select v-model="article.source" size="mini" style="width: 100px;">
            <el-option v-for="(source,id) in articleSources" :key="id" :label="source.title" :value="source.value"/>
          </el-select>
          <el-select v-model="article.type" size="mini" style="width: 100px;">
            <el-option v-for="(type,id) in articleTypes" :key="id" :label="type.title" :value="type.value"/>
          </el-select>
          <el-select v-model="article.status" size="mini" style="width: 100px;">
            <el-option v-for="(state,id) in articleStates" :key="id" :label="state.title" :value="state.value"/>
          </el-select>

          <el-button size="mini" style="margin-left: 5px" type="warning" @click="onCancelEdit">Cancel</el-button>
          <el-button size="mini" style="margin-left: 5px" type="success" @click="saveArticle">Save</el-button>
        </div>
      </div>

      <div>
        <div id="content">
          <div id="editormd-editor" class="markdown-body">
            <textarea id="editormd" v-model="article.content"></textarea>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Close, Expand } from '@element-plus/icons-vue'
import { articleStore, articleSources, articleStates, articleTypes } from '../../client/articles'
import { ElNotification, ElLoading } from 'element-plus'
import { defineComponent, computed, onMounted, reactive, ref} from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { debounce } from "js-debounce-throttle";

export default {
  setup(props, ctx) {
    const router = useRouter()

    const article = reactive({
      title: "",
      content: "",
      source: 3,
      status: 0,
      type: 2
    })
    let editor = null

    const articleState = computed(()=>{
      let state = articleStates[article.status]
      if (!state) {
        state = {title: article.status}
      }
      return state
    })
    const articleType = computed(()=>{
      let type = articleTypes[article.type]
      if (!type) {
        type = {title: article.type}
      }
      return type
    })
    const articleSource = computed(()=>{
      let source = articleSources[article.source]
      if (!source) {
        source = {title: article.source}
      }
      return source
    })

    const initEditor = ()=> {
      editor = editormd("editormd-editor", {
        //width   : "100%",
        autoHeight: false,
        height  : "600px", // calculate height
        //syncScrolling : "single",
        path    : "/static/libs/editor.md/lib/",
        markdown : article.content,
        htmlDecode : "style,script,iframe|on*",
        delay           : 600,
        codeFold        : true,
        watch           : false,  // 实时预览

        // toolbar      : false,
        emoji           : false,
        taskList        : true,
        tex             : true,  // 默认不解析
        flowChart       : true,  // 默认不解析
        sequenceDiagram : true,  // 默认不解析
        atLink          : false,
        // // Editor.md theme, default or dark, change at v1.5.0
        // // You can also custom css class .editormd-preview-theme-xxxx
        //theme        : '${(OWLET_THEME eq "night-mode")?"dark":"default"}',
        // Preview container theme, added v1.5.0
        // // You can also custom css class .editormd-preview-theme-xxxx
        //previewTheme : '${(OWLET_THEME eq "night-mode")?"dark":"default"}',
        // // Added @v1.5.0 & after version is CodeMirror (editor area) theme
        //editorTheme  : (localStorage.editorTheme) ? localStorage.editorTheme : "pastel-on-dark",

        imageUpload    : true,
        imageFormats   : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL : "/api/file/upload_editorMd",
        imageUploadParams : [
                              {name:'uid', value:$("[name='uid']").val()},
                              {name:'aid', value:$("[name='id']").val()},
                              {name:'type', value:'0'},
                            ],
        onload : heightAdapt
      })
    }

    const saveArticle = () => {
      const content = editor.getMarkdown()
      if (content.trim().length == 0) {
        ElNotification({ message: '内容不能为空', type: 'warning', showClose: true})
        return
      }

      const creation = {title: article.title, content: content, type: article.type,
        source: article.source, status: article.status}
      const loading = ElLoading.service({ lock: true, text: 'requesting', spinner: 'el-icon-loading', background: 'rgba(255,255,255,0.7)' })
      let id = 0
      articleStore.createArticle(creation).then((data) => {
        ElNotification({ message: '更新成功', type: 'success', showClose: true})
        id = data.id
      }).catch((error) => {
        ElNotification({ message: 'failed to load data: ' + error, type: 'error', showClose: true})
      }).finally(() => {
        loading.close()
        if (id > 0) {
            redirectToDetail(id)
        }
      })
    }

    const onCancelEdit = () => {
      const content = editor.getMarkdown()
      if (content != "" || article.title != "") {
        ElMessageBox.confirm('内容未保存，确认退出?', 'Warning',{
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }).then(() => {
          ctx.emit('cancel-edit', null)
        }).catch(() => {
        })
      } else {
        ctx.emit('cancel-edit', null)
      }
    }
    const redirectToDetail = function (id) {
      router.push({ name: 'article-detail', params: {id: id} })
    }

    const heightAdapt = () => {
      if (window.innerHeight > 640) {
        editor.height(window.innerHeight - 50)
      } else {
        editor.height(600)
      }
    }

    onMounted(()=>{
      if (article) {
        initEditor()
      }

      window.onresize = debounce(heightAdapt, 250)
    })

    return {
      article,
      articleStates,
      articleTypes,
      articleSources,
      articleState,
      articleType,
      articleSource,
      saveArticle,
      onCancelEdit
    }
  }
}
</script>

<style>
.article-meta-block{
  padding: 0.2rem 0.8rem;
  margin-bottom: 0.2rem;
  border-width: 0 0 0 8px;
  border-style: solid;
  background-color: rgb(250, 250, 250);
  border-color: rgb(197, 229, 250);
}
.article-meta-block:hover {
  background-color: rgb(235, 248, 253);
}

#background {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}

#article-actions {
  position: relative;
}

#article-extension{
  margin-left: 1rem;
  margin-right: 1rem;
  flex-shrink: 0;
  position: relative;
  width: 300px;
}


#content {
  background-color: white;
  margin-top: 0;
}

ul.editormd-menu {
  padding: 0 !important;
  margin: 0 !important;
}
.editormd-toolbar-container {
  padding: 0 !important;
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
  margin: 0.2em 0.5em;
}
.article-status-0 {
  border-color: rgb(252, 241, 217);
}

.el-link {
    font-size: 1.2rem;
}
</style>
