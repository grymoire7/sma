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
        :class="{'selected-icon': currentQuestionIndex === index}"
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
      <p>Click on one of the options to select or change your answer. Click on each emoji to switch to another question. When you think you've gotten them all, click Submit for the answers. Good luck!</p>
    </div>

    <div v-if="submitted" class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">
        💡 Slightly More Awesome: {{ subjectData.name }} for {{ today }}
      </h3>
      
      <div class="space-y-2">
        <div v-for="(category, index) in selectedCategories" :key="category.name" class="flex">
          <span>{{ isCorrect(index) ? '✅' : '❌' }}</span>
          <span class="w-24 font-medium pl-3">{{ category.name }}</span>
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
import { loadSubjectData } from '../config/subjects.js';
import { QuestionSelector } from '../utils/question_selector.js';

const route = useRoute();
const router = useRouter();
const subject = computed(() => route.params.subject);

// Get the appropriate subject data
const subjectData = ref({});

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
      `${isCorrect(index) ? '✅' : '❌'} ${category.name}`
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

  // Get question counts for each category
  const questionCounts = subjectData.value.questionCategories.map(category => category.questions.length);
  
  // Create QuestionSelector instance
  const questionSelector = new QuestionSelector(subjectData.value.questionCategories.length, questionCounts);
  
  // Get today's question data
  const questionData = questionSelector.getQuestionDataForDate(new Date());
  
  // Select categories based on the indices from QuestionSelector
  selectedCategories.value = questionData.categoryIndices.map(index => 
    subjectData.value.questionCategories[index]
  );
  
  // Select questions based on the indices from QuestionSelector
  selectedQuestions.value = questionData.categoryIndices.map((categoryIndex, i) => {
    const category = subjectData.value.questionCategories[categoryIndex];
    const questionIndex = questionData.questionIndices[i];
    return category.questions[questionIndex];
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

// Watch for route changes to update the subject data
watch(() => route.params.subject, async (newSubject) => {
  const data = await loadSubjectData(newSubject);
  
  if (data) {
    // Set the subject data based on the route
    subjectData.value = data;
    
    // Reset these values to ensure we get fresh questions for the new subject
    selectedCategories.value = [];
    selectedQuestions.value = [];
    userAnswers.value = [null, null, null, null];
    submitted.value = false;
    
    // Check for previous results or initialize new quiz
    checkPreviousResults();
  } else {
    // Redirect to home if subject not found
    router.push('/');
  }
}, { immediate: true });

onMounted(() => {
  // Initial setup is now handled by the watcher with immediate: true
});
</script>

<style scoped>
.selected-icon {
  transform: scale(1.5);
  transition: transform 0.2s ease;
}
</style>
