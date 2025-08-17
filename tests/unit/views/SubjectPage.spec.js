import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SubjectPage from '../../../src/views/SubjectPage.vue'

// Mock the subjects config
vi.mock('../../../src/config/subjects.js', () => ({
  loadSubjectData: vi.fn(),
  getSubjectByPath: vi.fn()
}))

// Mock the localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock the clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve())
  }
})

describe('SubjectPage.vue', () => {
  let router
  let mockSubjectData

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()
    localStorageMock.clear()

    // Mock subject data
    mockSubjectData = {
      name: "Spanish",
      description: "Learn Spanish with these fun and engaging questions.",
      questionCategories: [
        {
          name: "Grammar",
          questions: [
            {
              text: "What does the verb 'nadar' mean?",
              answers: ["To eat.", "To walk.", "To swim.", "To juggle flaming cheetos."],
              correctAnswer: 2,
              explanation: "The correct answer is 'to swim' because that's how Spanish works."
            }
          ]
        },
        {
          name: "Verbs",
          questions: [
            {
              text: "What does the verb 'hablar' mean?",
              answers: ["To eat.", "To speak.", "To swim.", "To dance."],
              correctAnswer: 1,
              explanation: "The correct answer is 'to speak' because that's how Spanish works."
            }
          ]
        },
        {
          name: "Adjectives",
          questions: [
            {
              text: "What does the adjective 'grande' mean?",
              answers: ["Big.", "Small.", "Medium.", "Huge."],
              correctAnswer: 0,
              explanation: "The correct answer is 'big' because that's how Spanish works."
            }
          ]
        },
        {
          name: "Phrases",
          questions: [
            {
              text: "What does the phrase 'hola, como estas?' mean?",
              answers: ["Goodbye, see you later.", "Hello, how are you?", "I'm hungry.", "I'm thirsty."],
              correctAnswer: 1,
              explanation: "The correct answer is 'Hello, how are you?' because that's how Spanish works."
            }
          ]
        }
      ]
    }

    // Mock the loadSubjectData function
    const { loadSubjectData } = await import('../../../src/config/subjects.js')
    loadSubjectData.mockResolvedValue(mockSubjectData)

    // Create a mock router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { 
          path: '/:subject', 
          name: 'Subject', 
          component: SubjectPage,
          props: true
        }
      ]
    })
  })

  it('displays the correct subject title', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.find('h2').text()).toContain('Spanish refresher for')
  })

  it('initializes with 4 questions', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check that we have 4 question state icons
    const questionIcons = wrapper.findAll('.text-3xl.cursor-pointer.relative')
    expect(questionIcons.length).toBe(4)
  })

  it('changes the current question when clicking on a question icon', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Get the initial question text
    const initialQuestionText = wrapper.find('h3').text()

    // Click on the second question icon
    const questionIcons = wrapper.findAll('.text-3xl.cursor-pointer.relative')
    await questionIcons[1].trigger('click')

    // Get the new question text
    const newQuestionText = wrapper.find('h3').text()

    // The question should have changed
    expect(newQuestionText).not.toBe(initialQuestionText)
  })

  it('selects an answer when clicked', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Find the first answer option and click it
    const answerOptions = wrapper.findAll('.p-3.rounded.cursor-pointer')
    await answerOptions[0].trigger('click')

    // The answer should now be selected (have the bg-gray-100 class)
    expect(answerOptions[0].classes()).toContain('bg-gray-100')
  })

  it('enables the submit button when all questions are answered', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Initially, the submit button should be disabled
    const submitButton = wrapper.find('button[disabled]')
    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toBe('Submit')

    // Answer all 4 questions
    for (let i = 0; i < 4; i++) {
      // Navigate to each question
      const questionIcons = wrapper.findAll('.text-3xl.cursor-pointer.relative')
      await questionIcons[i].trigger('click')

      // Select the first answer for each question
      const answerOptions = wrapper.findAll('.p-3.rounded.cursor-pointer')
      await answerOptions[0].trigger('click')
    }

    // Now the submit button should be enabled
    await wrapper.vm.$nextTick()
    const enabledSubmitButton = wrapper.find('button.bg-blue-600:not([disabled])')
    expect(enabledSubmitButton.exists()).toBe(true)
    expect(enabledSubmitButton.text()).toBe('Submit')
  })

  it('shows results after submitting answers', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router],
        mocks: {
          navigator: {
            clipboard: {
              writeText: vi.fn().mockResolvedValue(undefined)
            }
          }
        }
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Answer all 4 questions
    for (let i = 0; i < 4; i++) {
      // Navigate to each question
      const questionIcons = wrapper.findAll('.text-3xl.cursor-pointer.relative')
      await questionIcons[i].trigger('click')

      // Select the first answer for each question
      const answerOptions = wrapper.findAll('.p-3.rounded.cursor-pointer')
      await answerOptions[0].trigger('click')
    }

    // Submit the answers
    const submitButton = wrapper.find('button.bg-blue-600:not([disabled])')
    await submitButton.trigger('click')
    
    // Wait for the next tick to ensure the component updates
    await wrapper.vm.$nextTick()

    // Debug what's actually in the DOM
    // console.log('DOM content:', wrapper.html());
    // console.log('All h3 elements:', wrapper.findAll('h3').map(el => el.text()));

    // Check that the results section is displayed - use a more flexible selector
    const resultsHeading = wrapper.findAll('h3').filter(el => 
      el.text().includes('Slightly More Awesome: Spanish')
    )[0];
    
    expect(resultsHeading).toBeDefined();
    expect(resultsHeading.text()).toContain('Slightly More Awesome: Spanish for');
    
    // Check that a flash message is displayed
    expect(wrapper.text()).toContain('Results copied to clipboard')
  })

  it('resets the quiz when reset today is clicked', async () => {
    // Navigate to the Spanish subject
    await router.push('/spanish')

    const wrapper = mount(SubjectPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for the component to load the data
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Get the initial question text
    // const initialQuestionText = wrapper.find('h3').text()

    // Click the reset today button
    const resetButton = wrapper.findAll('button.text-blue-600')[1]
    await resetButton.trigger('click')

    // Check that localStorage.removeItem was called
    expect(localStorageMock.removeItem).toHaveBeenCalled()
    
    // Check that a flash message is displayed
    expect(wrapper.text()).toContain('Today\'s questions have been reset')
  })
})
