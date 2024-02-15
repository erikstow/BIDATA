import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ContactForm from 'src/components/ContactForm.vue'; // Juster banen etter din filstruktur

describe('ContactForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ContactForm);
  });

  it('initializes with empty fields', () => {
    expect(wrapper.vm.name).toBe('');
    expect(wrapper.vm.email).toBe('');
    expect(wrapper.vm.message).toBe('');
  });

  it('enables submit button when form is valid', async () => {
    await wrapper.setData({ name: 'Test Navn', email: 'test@example.com', message: 'Hei, dette er en testmelding.' });
    expect(wrapper.find('button[type="submit"]').element.disabled).toBe(false);
  });

  it('disables submit button when form is invalid', async () => {
    await wrapper.setData({ name: '', email: '', message: '' });
    expect(wrapper.find('button[type="submit"]').element.disabled).toBe(true);
  });

  it('shows alert on successful form submission', async () => {
    window.alert = vi.fn(); // Mocking alert-funksjonen
    window.fetch = vi.fn(() => Promise.resolve({ ok: true })); // Mocking fetch-funksjonen for å simulere et vellykket API-kall

    await wrapper.setData({ name: 'Test Navn', email: 'test@example.com', message: 'Hei, dette er en testmelding.' });
    await wrapper.find('form').trigger('submit.prevent');

    expect(window.alert).toHaveBeenCalledWith('Skjema sendt suksessfullt!');
    expect(window.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/contacts',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Navn', email: 'test@example.com', message: 'Hei, dette er en testmelding.' }),
      })
    );
  });

  it('shows alert on failed form submission', async () => {
    window.alert = vi.fn(); // Mocking alert-funksjonen
    window.fetch = vi.fn(() => Promise.resolve({ ok: false })); // Mocking fetch-funksjonen for å simulere et feilet API-kall

    await wrapper.setData({ name: 'Test Navn', email: 'test@example.com', message: 'Hei, dette er en testmelding.' });
    await wrapper.find('form').trigger('submit.prevent');

    expect(window.alert).toHaveBeenCalledWith('Noe gikk galt med innsendingen.');
  });

  it('clears fields after successful submission', async () => {
    window.fetch = vi.fn(() => Promise.resolve({ ok: true })); // Mocking fetch-funksjonen for å simulere et vellykket API-kall

    await wrapper.setData({ name: 'Test Navn', email: 'test@example.com', message: 'Hei, dette er en testmelding.' });
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.name).toBe('');
    expect(wrapper.vm.email).toBe('');
    expect(wrapper.vm.message).toBe('');
  });
});
