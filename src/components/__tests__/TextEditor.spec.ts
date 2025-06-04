import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TextEditor from '../TextEditor.vue'

describe('TextEditor', () => {
  it('renders properly', () => {
    const wrapper = mount(TextEditor)
    expect(wrapper.exists()).toBe(true)
  })

  it('emits input event when text changes', async () => {
    const wrapper = mount(TextEditor)
    const input = wrapper.find('textarea, input')
    await input.setValue('Hello world')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Hello world'])
  })

  it('renders initial value', () => {
    const wrapper = mount(TextEditor, {
      props: { modelValue: 'Initial text' }
    })
    const input = wrapper.find('textarea, input')
    expect((input.element as HTMLInputElement).value).toBe('Initial text')
  })

  it('disables input when disabled prop is true', () => {
    const wrapper = mount(TextEditor, {
      props: { disabled: true }
    })
    const input = wrapper.find('textarea, input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('applies custom placeholder', () => {
    const wrapper = mount(TextEditor, {
      props: { placeholder: 'Type here...' }
    })
    const input = wrapper.find('textarea, input')
    expect(input.attributes('placeholder')).toBe('Type here...')
  })
})
