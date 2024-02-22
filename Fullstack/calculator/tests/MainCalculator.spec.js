import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import MainCalculator from '@/components/MainCalculator.vue';
import CalculatorButton from '@/components/CalculatorButton.vue';

describe('MainCalculator', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MainCalculator);
  });

  it('appends a digit to the current value when a number button is clicked', async () => {
    const button = wrapper.findAllComponents(CalculatorButton).find(w => w.props('label') === '1');
    await button.trigger('click');
    expect(wrapper.vm.currentValue).toBe('1');
  });

  it('clears the current value when C button is clicked', async () => {
    await wrapper.setData({ currentValue: '123' });
    const clearButton = wrapper.findAllComponents(CalculatorButton).find(w => w.props('label') === 'C');
    await clearButton.trigger('click');
    expect(wrapper.vm.currentValue).toBe('');
  });

  it('updates the display when multiple digits are appended', async () => {
    const buttons = wrapper.findAllComponents(CalculatorButton);
    await buttons.find(w => w.props('label') === '1').trigger('click');
    await buttons.find(w => w.props('label') === '2').trigger('click');
    expect(wrapper.vm.currentValue).toBe('12');
  });
  
  it('performs addition correctly', async () => {
    const buttons = wrapper.findAllComponents(CalculatorButton);
    await buttons.find(w => w.props('label') === '1').trigger('click');
    await buttons.find(w => w.props('label') === '+').trigger('click');
    await buttons.find(w => w.props('label') === '2').trigger('click');
    await buttons.find(w => w.props('label') === '=').trigger('click');
    expect(wrapper.vm.currentValue).toBe('3');
  });
  
  it('displays result in log after calculation', async () => {
    const buttons = wrapper.findAllComponents(CalculatorButton);
    await buttons.find(w => w.props('label') === '3').trigger('click');
    await buttons.find(w => w.props('label') === '*').trigger('click');
    await buttons.find(w => w.props('label') === '3').trigger('click');
    await buttons.find(w => w.props('label') === '=').trigger('click');
    expect(wrapper.vm.logEntries).toContain('3 * 3 = 9');
  });
});

