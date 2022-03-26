import axios from 'axios'
import adapter from 'axios/lib/adapters/http'

axios.defaults.adapter = adapter
axios.defaults.withCredentials = true

export const articleSources = {
  1: {title: "原创", theme: "green"},
  2: {title: "翻译", theme: "orange"},
  3: {title: "笔记", theme: "blue"},
  4: {title: "转载", theme: "yellow"}
}

export const articleStates = {
  0: {title: "草稿", theme: "yellow"},
  1: {title: "已发布", theme: "green"}
}

export const articleTypes = {
  1: {title: "未分类", theme: "yellow"},
  2: {title: "IT", theme: "green"},
  3: {title: "其他", theme: "blue"}
}


export class OwletClient {
  constructor (url) {
    if (url === undefined || url === '') {
      url = process.env.API_BASE_URL
    }
    if (url === undefined) {
      url = ''
    }

    if (url.endsWith('/')) {
      url = url.substr(0, url.length - 1)
    }
    this.url = url
  }

  withPath (path) {
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return `${this.url}${path}`
  }

  async queryArticles (keyword, page) {
    return axios.get(this.withPath(`/v1/articles?kw=${keyword}&page=${page}`), {})
      .then(r => r.data)
  }

  async detailArticle (id) {
    return axios.get(this.withPath(`/v1/articles/${id}`), {})
      .then(r => r.data)
  }

  async createArticle (creationForm) {
    return axios.post(this.withPath('/v1/articles'), creationForm).then(r => r.data)
  }

  async updateArticle (id, workflowChanges) {
    return axios.put(this.withPath('/v1/articles/' + id), workflowChanges)
  }

  async deleteArticle (id) {
    return axios.delete(this.withPath('/v1/articles/' + id), {})
  }
}

export const articleStore = new OwletClient('/api')
export default articleStore
