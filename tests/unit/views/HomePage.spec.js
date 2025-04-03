import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../../../src/views/HomePage.vue'
import spanishData from '../../../src/data/subject-data-spanish.js'
import romanEmpireData from '../../../src/data/subject-data-roman-empire.js'

describe('HomePage.vue', () => {
  it('renders the welcome message', () => {
    // Create a mock router
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomePage }]
    })

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Welcome to Slightly More Awesome!')
  })

  it('displays all subject cards', () => {
    // Create a mock router
    const router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: HomePage }]
    })

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    // Check that we have the correct number of subject cards
    const subjectCards = wrapper.findAll('.bg-white.shadow.rounded-lg.p-4')
    expect(subjectCards.length).toBe(2)

    // Check that the Spanish subject is displayed
    expect(wrapper.text()).toContain(spanishData.name)
    expect(wrapper.text()).toContain(spanishData.description)

    // Check that the Roman Empire subject is displayed
    expect(wrapper.text()).toContain(romanEmpireData.name)
    expect(wrapper.text()).toContain(romanEmpireData.description)
  })

  it('navigates to subject page when card is clicked', async () => {
    // Create a mock router with a push method spy
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomePage },
        { path: '/:subject', name: 'Subject', component: { template: '<div></div>' } }
      ]
    })
    
    // Spy on router.push
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(HomePage, {
      global: {
        plugins: [router]
      }
    })

    // Find the first subject card and click it
    const firstSubjectCard = wrapper.findAll('.bg-white.shadow.rounded-lg.p-4')[0]
    await firstSubjectCard.trigger('click')

    // Check that router.push was called with the correct path
    expect(pushSpy).toHaveBeenCalledWith('/spanish')
  })
})
