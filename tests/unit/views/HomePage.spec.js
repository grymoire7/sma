import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../../../src/views/HomePage.vue'

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
    expect(subjectCards.length).toBe(4)

    // Check that the subjects are displayed
    expect(wrapper.text()).toContain('Spanish')
    expect(wrapper.text()).toContain('Test your Spanish vocabulary and grammar skills')

    expect(wrapper.text()).toContain('Roman Empire')
    expect(wrapper.text()).toContain('Explore the history and culture of ancient Rome')
    
    expect(wrapper.text()).toContain('Gardening')

    expect(wrapper.text()).toContain('Trivia')
    expect(wrapper.text()).toContain('General knowledge questions across various topics')
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
