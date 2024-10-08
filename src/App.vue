<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { AdjustmentsHorizontalIcon } from "@heroicons/vue/16/solid";

const products = ref([]);
const categories = ref([]);
const activeCategory = ref('All');
const cart = ref([]);
const activeSort = ref('DEFAULT'); // Initialize sort state

const ASC = "asc";
const DESC = "desc";
const DEFAULT = ""; // Default state

// Fetch all products with sorting
const fetchAllProducts = async (sortOrder = DEFAULT) => {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products`);
    products.value = response.data;
    if (sortOrder === DESC) {
      products.value.sort((a, b) => b.price - a.price);
    } else if (sortOrder === ASC) {
      products.value.sort((a, b) => a.price - b.price);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
const handleSort = () => {
  if (activeSort == DEFAULT) activeSort.category.vale = ASC
  if (activeSort === ASC) activeSort.value = DESC
  activeSort.value = default
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    const data = await response.json();
    categories.value = ['All', ...data];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Fetch products by category with sorting
const fetchProductsByCategory = async (category, sortOrder = DEFAULT) => {
  try {
    if (category === 'All') {
      await fetchAllProducts(sortOrder);
    } else {
      const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
      products.value = response.data;
      if (sortOrder === DESC) {
        products.value.sort((a, b) => b.price - a.price);
      } else if (sortOrder === ASC) {
        products.value.sort((a, b) => a.price - b.price);
      }
    }
  } catch (error) {
    console.error('Error fetching filtered products:', error);
  }
};

// Handle category change
const handleCategoryChange = async (category) => {
  activeCategory.value = category;
  await fetchProductsByCategory(category, activeSort.value);
};

// Handle sort change
const handleSortChange = async () => {
  activeSort.value = activeSort.value === ASC ? DESC : ASC; // Toggle sort order
  await fetchProductsByCategory(activeCategory.value, activeSort.value);
};

// Add product to cart
const addToCart = (product) => {
  cart.value.push(product);
};

onMounted(async () => {
  await fetchAllProducts(); // Fetch all products initially
  await fetchCategories(); // Fetch categories
  await fetchProductsByCategory(activeCategory.value); // Fetch products based on the active category
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col mb-6">
      <h1 class="text-3xl font-bold pb-8 pt-4">Welcome to Our Fake Store</h1>
      <div class="mb-4 flex space-x-4">
        <div class="flex items-center">
          <button @click="handleSortChange">
            <AdjustmentsHorizontalIcon class="w-5 h-5 text-pink-900" />
          </button>
          <ul class="flex space-x-4">
            <li 
              v-for="category in categories" 
              :key="category" 
              @click="handleCategoryChange(category)" 
              class="cursor-pointer relative"
            >
              <span class="text-gray-700 font-semibold py-2 px-4" 
                    :class="{ 'text-pink-900': activeCategory === category }">
                {{ category.charAt(0).toUpperCase() + category.slice(1) }}
              </span>
              <div 
                v-if="activeCategory === category" 
                class="absolute -bottom-1 left-0 h-1 w-full bg-pink-900"
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
          <p class="text-right text-xl font-extrabold text-gray-700">{{ product.price.toFixed(2) }}€</p>
          <h4 class="font-semibold text-left">{{ product.title }}</h4>
          <button 
            @click="addToCart(product)" 
            class="mt-2 w-full bg-black text-white font-bold py-2 rounded hover:bg-pink-900"
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
