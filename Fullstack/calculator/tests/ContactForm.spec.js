import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ContactForm from '@/components/ContactForm.vue';

describe('ContactForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ContactForm, {
      global: {
        mocks: {
          $store: {
            commit: vi.fn(),
          },
        },
      },
    });
  });

  it('initializes with empty fields', () => {
    expect(wrapper.vm.name).toBe('');
    expect(wrapper.vm.email).toBe('');
    expect(wrapper.vm.message).toBe('');
  });

  it('enables submit button when form is valid', async () => {
    await wrapper.setData({ name: 'Test Name', email: 'test@example.com', message: 'Hello' });
    expect(wrapper.find('button[type="submit"]').element.disabled).toBeFalsy();
  });

  it('displays error when submitting with invalid email', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    globalThis.alert = vi.fn();
    await wrapper.setData({ name: 'Test Name', email: 'test', message: 'Hello' });
    await wrapper.find('form').trigger('submit.prevent');
    expect(globalThis.alert).toHaveBeenCalledWith('Noe gikk galt med innsendingen.');
  });

  it('disables submit button with empty fields', async () => {
    await wrapper.setData({ name: '', email: '', message: '' });
    expect(wrapper.find('button[type="submit"]').element.disabled).toBe(true);
  });
  
  it('displays success message on valid form submission', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    globalThis.alert = vi.fn();
    await wrapper.setData({ name: 'John Doe', email: 'john@example.com', message: 'Hello there!' });
    await wrapper.find('form').trigger('submit.prevent');
    expect(globalThis.alert).toHaveBeenCalledWith('Skjema sendt suksessfullt!');
  });
  
  it('clears fields after successful form submission', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    await wrapper.setData({ name: 'John Doe', email: 'john@example.com', message: 'Hello there!' });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.vm.name).toBe('');
    expect(wrapper.vm.email).toBe('');
    expect(wrapper.vm.message).toBe('');
  });
});

