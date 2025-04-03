<template>
  <div class="bg-white bg-opacity-90 p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold text-center mb-4">
      {{ subjectData.name }} refresher for {{ today }}
    </h2>

    <div class="flex justify-center space-x-4 mb-6">
      <div 
        v-for="(category, index) in selectedCategories" 
        :key="category.name"
        class="text-3xl cursor-pointer relative"
        :class="{'transform scale-110': currentQuestionIndex === index}"
        @click="currentQuestionIndex = index"
        @mouseenter="showTooltip(index)"
        @mouseleave="hideTooltip"
      >
        <span v-if="!submitted">
          <i v-if="userAnswers[index] !== null" 
             class="fas fa-lightbulb" 
             :class="[getIconColor(index), 
                     {'filter drop-shadow-glow animate-pulse-fast': currentQuestionIndex === index}]"></i>
          <i v-else 
             class="fas fa-clipboard-question" 
             :class="[getIconColor(index), 
                     {'filter drop-shadow-glow animate-pulse-fast': currentQuestionIndex === index}]"></i>
        </span>
        <span v-else>{{ isCorrect(index) ? '✅' : '❌' }}</span>
        
        <div 
          v-if="tooltipIndex === index" 
          class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-10"
        >
          {{ category.name }}
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">{{ currentQuestion.text }}</h3>
      
      <div class="space-y-2">
        <div 
          v-for="(answer, answerIndex) in currentQuestion.answers" 
          :key="answerIndex"
          class="p-3 rounded cursor-pointer flex items-center"
          :class="{
            'hover:bg-gray-100': !submitted,
            'bg-gray-100': userAnswers[currentQuestionIndex] === answerIndex && !submitted,
            'bg-green-100': submitted && answerIndex === currentQuestion.correctAnswer,
            'bg-red-100': submitted && userAnswers[currentQuestionIndex] === answerIndex && answerIndex !== currentQuestion.correctAnswer
          }"
          @click="!submitted && selectAnswer(answerIndex)"
        >
          <span class="mr-2 w-6 text-center">
            <span v-if="userAnswers[currentQuestionIndex] === answerIndex && !submitted">✓</span>
            <span v-if="submitted && answerIndex === currentQuestion.correctAnswer">✅</span>
            <span v-if="submitted && userAnswers[currentQuestionIndex] === answerIndex && answerIndex !== currentQuestion.correctAnswer">❌</span>
          </span>
          <span>{{ answer }}</span>
        </div>
      </div>

      <div v-if="submitted" class="mt-4 p-3 bg-gray-100 rounded text-sm">
        <p>{{ currentQuestion.explanation }}</p>
      </div>
    </div>

    <div class="mb-4 flex justify-between">
      <button 
        @click="toggleInstructions" 
        class="text-blue-600 hover:underline"
      >
        {{ showInstructions ? 'hide instructions' : 'show instructions' }}
      </button>
      <button 
        @click="resetToday" 
        class="text-blue-600 hover:underline"
      >
        reset today
      </button>
    </div>

    <div v-if="showInstructions" class="mb-6 text-gray-600">
      <p>Click on one of the options to select or change your answer or on one of the four emoji to switch to another question. Click on the submit button to submit your answers.</p>
    </div>

    <div v-if="submitted" class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">
        💡 Slightly More Awesome: {{ subjectData.name }} for {{ today }}
      </h3>
      
      <div class="space-y-2">
        <div v-for="(category, index) in selectedCategories" :key="category.name" class="flex">
          <span class="w-24 font-medium">{{ category.name }}:</span>
          <span>{{ isCorrect(index) ? '✅' : '❌' }}</span>
        </div>
      </div>
    </div>

    <div v-if="flashMessage" class="text-center mb-6 p-2 bg-green-100 rounded">
      {{ flashMessage }}
    </div>

    <div v-if="!submitted" class="flex justify-center mb-6">
      <button 
        @click="submitAnswers" 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!allQuestionsAnswered"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import spanishData from '../data/subject-data-spanish.js';

const route = useRoute();
const router = useRouter();
const subject = computed(() => route.params.subject);

// For now, we only have Spanish data
const subjectData = ref(subject.value === 'spanish' ? spanishData : {});

const today = computed(() => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
});

// Select 4 random categories and 1 random question from each
const selectedCategories = ref([]);
const selectedQuestions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref([null, null, null, null]);
const submitted = ref(false);
const showInstructions = ref(true);
const tooltipIndex = ref(null);
const flashMessage = ref('');

const currentQuestion = computed(() => {
  if (!selectedQuestions.value || selectedQuestions.value.length === 0) {
    return { text: '', answers: [], correctAnswer: 0, explanation: '' };
  }
  return selectedQuestions.value[currentQuestionIndex.value];
});

const allQuestionsAnswered = computed(() => {
  return userAnswers.value.every(answer => answer !== null);
});

const selectAnswer = (answerIndex) => {
  userAnswers.value[currentQuestionIndex.value] = answerIndex;
};

const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value;
};

const resetToday = () => {
  // Clear local storage for today
  const storageKey = `sma-${subject.value}-${new Date().toISOString().split('T')[0]}`;
  localStorage.removeItem(storageKey);
  
  // Reset the quiz
  initializeQuiz();
  
  // Show a flash message
  flashMessage.value = "Today's questions have been reset!";
  setTimeout(() => {
    flashMessage.value = '';
  }, 3000);
};

const showTooltip = (index) => {
  tooltipIndex.value = index;
  setTimeout(() => {
    if (tooltipIndex.value === index) {
      tooltipIndex.value = null;
    }
  }, 5000);
};

const hideTooltip = () => {
  tooltipIndex.value = null;
};

const isCorrect = (index) => {
  return userAnswers.value[index] === selectedQuestions.value[index].correctAnswer;
};

const getIconColor = (index) => {
  const colors = ['text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500'];
  return colors[index % colors.length];
};

const submitAnswers = () => {
  submitted.value = true;
  
  // Generate results text
  const resultsText = `💡 Slightly More Awesome: ${subjectData.value.name} for ${today.value}\n\n` +
    selectedCategories.value.map((category, index) => 
      `${category.name}: ${isCorrect(index) ? '✅' : '❌'}`
    ).join('\n');
  
  // Copy to clipboard
  navigator.clipboard.writeText(resultsText).then(() => {
    flashMessage.value = "Results copied to clipboard! Come back tomorrow!";
    setTimeout(() => {
      flashMessage.value = '';
    }, 5000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
    flashMessage.value = "Couldn't copy to clipboard. Please copy manually.";
  });
};

const initializeQuiz = () => {
  // Make sure we have subject data before proceeding
  if (!subjectData.value || !subjectData.value.questionCategories) {
    console.error('Subject data not available');
    return;
  }

  // Get today's date as a string to use as a seed
  const dateStr = new Date().toISOString().split('T')[0];
  
  // Simple seeded random function
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Shuffle array using seeded random
  const shuffleArray = (array, seed) => {
    if (!array || !Array.isArray(array)) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Create a seed from the date string and subject
  const seed = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 
               subject.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Shuffle and select categories
  const shuffledCategories = shuffleArray(subjectData.value.questionCategories, seed);
  selectedCategories.value = shuffledCategories.slice(0, 4);
  
  // Select one random question from each category
  selectedQuestions.value = selectedCategories.value.map((category, index) => {
    const questions = shuffleArray(category.questions, seed + index);
    return questions[0];
  });
  
  // Reset user state
  userAnswers.value = [null, null, null, null];
  currentQuestionIndex.value = 0;
  submitted.value = false;
  showInstructions.value = true;
};

// Check local storage for previous results from today
const checkPreviousResults = () => {
  const storageKey = `sma-${subject.value}-${new Date().toISOString().split('T')[0]}`;
  const savedData = localStorage.getItem(storageKey);
  
  if (savedData) {
    const data = JSON.parse(savedData);
    selectedCategories.value = data.selectedCategories;
    selectedQuestions.value = data.selectedQuestions;
    userAnswers.value = data.userAnswers;
    submitted.value = data.submitted;
  } else {
    initializeQuiz();
  }
};

// Save results to local storage
watch([userAnswers, submitted], () => {
  if (selectedQuestions.value.length) {
    const storageKey = `sma-${subject.value}-${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(storageKey, JSON.stringify({
      selectedCategories: selectedCategories.value,
      selectedQuestions: selectedQuestions.value,
      userAnswers: userAnswers.value,
      submitted: submitted.value
    }));
  }
}, { deep: true });

onMounted(() => {
  if (subject.value === 'spanish') {
    // Make sure subjectData is properly set
    subjectData.value = spanishData;
    checkPreviousResults();
  } else {
    // Redirect to home if subject not found
    router.push('/');
  }
});
</script>
