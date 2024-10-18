import { createWebHistory , createRouter } from 'vue-router'

import ProductList from './views/ProductList.vue'
import SingleProduct from './views/SingleProduct.vue'

const routes = [
  { 
    path: '/',
    name: 'home',
    component: ProductList 
  },
  { 
    path: '/product/:id',
    name: "single-product",
    component: SingleProduct
  }
]

const router = createRouter({
  history: createWebHistory(), 
  routes,
})

export default router