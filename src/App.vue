<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-green-700 text-white shadow p-4 flex justify-between items-center">
      <div class="flex items-center cursor-pointer" @click="goToHome">
        <span class="fas fa-lightbulb text-blue-200 text-2xl mr-2"></span>
        <h1 class="text-xl font-bold">
          Slightly More Awesome
          <span v-if="currentSubject">: {{ currentSubject }}</span>
        </h1>
      </div>
      <div class="text-2xl cursor-pointer relative" @click="toggleMenu">
        ≡
        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg py-1 z-50">
          <router-link 
            to="/spanish" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="showMenu = false"
          >
            Spanish
          </router-link>
          <router-link 
            to="/roman-empire" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="showMenu = false"
          >
            Roman Empire
          </router-link>
          <a 
            href="#" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="showMenu = false"
          >
            Settings
          </a>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto p-4 relative z-0 my-4">
      <router-view />
    </main>

    <footer class="bg-green-700 text-white shadow p-4 text-center text-sm">
      Copyright 2025 Slightly More Awesome
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import spanishData from './data/subject-data-spanish.js';
import romanEmpireData from './data/subject-data-roman-empire.js';

const router = useRouter();
const route = useRoute();
const showMenu = ref(false);

const currentSubject = computed(() => {
  if (route.params.subject === 'spanish' && spanishData) {
    return spanishData.name;
  } else if (route.params.subject === 'roman-empire' && romanEmpireData) {
    return romanEmpireData.name;
  }
  return '';
});

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const goToHome = () => {
  router.push('/');
};

// Close menu when clicking outside
window.addEventListener('click', (e) => {
  if (showMenu.value && !e.target.closest('.relative')) {
    showMenu.value = false;
  }
});
</script>
