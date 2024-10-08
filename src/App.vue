<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const products = ref([]);
const categories = ref([]);
const activeCategory = ref('All');
const cart = ref([]);

// Fetches all of products
const fetchAllProducts = async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Fetch all of the categories
const fetchCategories = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    const data = await response.json();
    categories.value = ['All', ...data];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Fetches products by category
const fetchProductsByCategory = async (category) => {
  try {
    // If the category is "All", it fetches all of the products
    if (category === 'All') {
      await fetchAllProducts();
    } else {
      const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
      products.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching filtered products:', error);
  }
};

// Handle different categories
const handleCategoryChange = async (category) => {
  activeCategory.value = category;
  await fetchProductsByCategory(category);
};

// Add product to cart
const addToCart = (product) => {
  cart.value.push(product);
};

onMounted(async () => {
  await fetchAllProducts();
  await fetchCategories();
  await fetchProductsByCategory(activeCategory.value);
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col mb-6">
      <h1 class="text-3xl font-bold pb-6">Welcome to Our Fake Store</h1>
      <div class="mb-4 flex space-x-4">
        <div class="flex items-center">
          <ul class="flex space-x-4">
            <li 
              v-for="category in categories" 
              :key="category" 
              @click="handleCategoryChange(category)" 
              class="cursor-pointer relative"
            >
              <span class="text-gray-700 font-semibold py-2 px-4" 
                    :class="{ 'text-gray-700': activeCategory === category }">
                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
              </span>
              <div 
                v-if="activeCategory === category" 
                class="absolute -bottom-1 left-0 h-1 w-full bg-gray-700"
              ></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <article 
        v-for="product in products" 
        :key="product.id" 
        class="border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
      >
        <img 
          class="w-44 h-44 object-contain mx-auto p-2" 
          :src="product.image" 
          alt="Product Image" 
        />
        <div class="p-4 flex flex-col justify-between" style="height: 220px;">
          <p class="text-left font-extrabold text-gray-700">€{{ product.price.toFixed(2) }}</p>
          <h4 class="font-semibold text-left">{{ product.title }}</h4>
          <button 
            @click="addToCart(product)" 
            class="mt-2 w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
