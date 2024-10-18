<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { AdjustmentsHorizontalIcon } from "@heroicons/vue/16/solid";
import { useRouter, RouterLink } from 'vue-router'

const products = ref([]);
const categories = ref([]);
const activeCategory = ref("");
const activeSort = ref(ASC)

const ASC = "asc"
const DESC = "desc"
const DEFAULT = ""

const fetchAllProducts = async () => {
    activeCategory.value = "All"
    const response = await axios.get(`https://fakestoreapi.com/products?sort=${activeSort.value}`);
    products.value = response.data;
};

const fetchProductsByCategory = async (category) => {
    const response = await axios.get(`https://fakestoreapi.com/products/category/${category}?sort=${activeSort.value}`)
    products.value = response.data
}

const fetchAllCategories = async () => {
    const response = await axios.get(
        "https://fakestoreapi.com/products/categories"
    );
    categories.value = response.data;
};

const handleCategoryChange = async (category) => {
    activeCategory.value = category;
    await fetchProductsByCategory(category);
};

const handleSort = () => {
    if (activeSort.value === DEFAULT) {
        activeSort.value = ASC
    } else if (activeSort.value === ASC) {
        activeSort.value = DESC
    } else {
        activeSort.value = DEFAULT
    }

    if(activeCategory.value === "All") {
        fetchAllProducts();
    } else {
        fetchProductsByCategory(activeCategory.value)
    }
}

const handleCartAdd = async (product) => {
    console.log(product);
};

console.log(useRouter())

onMounted(async () => {
    await fetchAllProducts();
    await fetchAllCategories();
});
</script>

<template>
    <section class="max-w-5xl mx-auto">
        <h1 class="text-3xl py-12 font-bold">Welcome to our fake store</h1>
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-6">
                <button
                    @click="fetchAllProducts()"
                    class="uppercase font-bold"
                    :class="activeCategory === 'All' ? 'text-pink-800' : 'text-black/50'"
                >
                    All
                </button>
                <button
                    v-for="category in categories"
                    :key="category"
                    class="uppercase font-bold"
                    :class="activeCategory === category ? 'text-pink-800' : 'text-black/50'"
                    @click="handleCategoryChange(category)"
                >
                    {{ category }}
                </button>
            </div>
            <div class="flex items-center gap-2">
                <span class="uppercase text-gray-400 font-bold">{{ activeSort }}</span>
                <button
                    @click="handleSort"
                >
                    <AdjustmentsHorizontalIcon class="w-5 h-5 text-pink-900" />
                </button>
            </div>
        </div>
        <div class="grid grid-cols-4 gap-4">
            <router-link
                v-for="product in products"
                :key="product.id"
                class="flex flex-col justify-between gap-2 border rounded-md p-4"
                :to="{ name: 'single-product', params: { id: product.id} }"
            >
                <div class="space-y-4">
                    <img
                        class="w-full aspect-video object-contain"
                        :src="product.image"
                    />
                    <h4 class="font-medium text-sm">{{ product.title }}</h4>
                </div>
                <div>
                    <p class="text-right mt-2 font-bold text-lg">
                        {{ product.price }}€
                    </p>
                    <button
                        class="bg-black rounded-md text-white text-center w-full py-2 px-8"
                        @click="handleCartAdd(product)"
                    >
                        Add to cart
                    </button>
                </div>
            </router-link>
        </div>
    </section>
</template>