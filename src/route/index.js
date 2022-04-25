import { createRouter, createWebHistory } from "vue-router"


const routes = [
  {
    path: "/",
    name: "home",
    //component: () => import("../components/Home.vue"),
    component: () => import("../components/articles/Articles.vue"),
    children:[
    ]
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../components/About.vue")
  },
  {
    path: "/articles",
    name: "articles",
    component: () => import("../components/articles/Articles.vue")
  },
  {
    path: "/articles/:id",
    name: "article-detail",
    component: () => import("../components/articles/ArticleDetail.vue")
  }
]

export default createRouter({
    history: createWebHistory(),
    routes
})