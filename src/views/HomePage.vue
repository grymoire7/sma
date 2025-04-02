<template>
  <div>
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Welcome to Slightly More Awesome!</h2>
      <p class="mb-2">
        This is a daily, shareable, subject review app that will make you slightly more awesome at a subject of your choice.
      </p>
      <p>
        Each day you are given a set of four questions in your subject. Once all four questions are answered, 
        you will see your results and have the option to share them with friends and family.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="subject in subjects" 
        :key="subject.name" 
        class="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
        @click="goToSubject(subject.path)"
      >
        <h3 class="text-lg font-semibold mb-2">{{ subject.name }}</h3>
        <p class="text-gray-600">{{ subject.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import spanishData from '../data/subject-data-spanish.js';

const router = useRouter();

const subjects = ref([
  {
    name: spanishData.name,
    description: spanishData.description,
    path: 'spanish'
  }
]);

const goToSubject = (path) => {
  router.push(`/${path}`);
};
</script>
