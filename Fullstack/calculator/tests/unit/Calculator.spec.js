import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import MainCalculator from 'src/components/MainCalculator.vue'; // Juster banen etter din filstruktur

describe('MainCalculator', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MainCalculator);
  });

  it('clears the current value and resets state', async () => {
    // Setter en initiell tilstand for å teste tilbakestillingen
    await wrapper.setData({ currentValue: '123', previousValue: '456', operator: '+', operatorClicked: true });

    // Kaller clear-metoden
    await wrapper.vm.clear();

    // Sjekker at tilstanden er tilbakestilt
    expect(wrapper.vm.currentValue).toBe('');
    expect(wrapper.vm.previousValue).toBeNull();
    expect(wrapper.vm.operator).toBeNull();
    expect(wrapper.vm.operatorClicked).toBe(false);
  });
});

it('appends a number to the current value', async () => {
  // Angir en initiell verdi
  await wrapper.setData({ currentValue: '1' });

  // Appenderer et nytt tall
  await wrapper.vm.appendToCurrent('2');

  // Sjekker at tallet ble lagt til riktig
  expect(wrapper.vm.currentValue).toBe('12');
});

it('sets the operator and updates state correctly', async () => {
  // Setter en initial verdi og operatør
  await wrapper.setData({ currentValue: '5' });
  await wrapper.vm.setOperator('+');

  // Sjekker at operatøren er satt, og tilstanden er oppdatert
  expect(wrapper.vm.operator).toBe('+');
  expect(wrapper.vm.previousValue).toBe('5');
  expect(wrapper.vm.operatorClicked).toBe(true);
});

it('performs calculation correctly and updates state', async () => {
  // Setter en initiell tilstand for en enkel beregning
  await wrapper.setData({ previousValue: '5', currentValue: '3', operator: '+', operatorClicked: false });

  // Utfører beregningen
  await wrapper.vm.calculate();

  // Sjekker at resultatet og tilstanden er oppdatert riktig
  expect(wrapper.vm.currentValue).toBe('8');
  expect(wrapper.vm.previousValue).toBeNull();
  expect(wrapper.vm.operator).toBeNull();
  expect(wrapper.vm.operatorClicked).toBe(false);
});

it('deletes the last character of the current value', async () => {
  await wrapper.setData({ currentValue: '123' });

  await wrapper.vm.deleteLast();

  expect(wrapper.vm.currentValue).toBe('12');
});

it('sets current value to the result of the last calculation', async () => {
  await wrapper.setData({ logEntries: ['1 + 1 = 2', '2 + 3 = 5'] });

  await wrapper.vm.answer();

  expect(wrapper.vm.currentValue).toBe('5');
});

it('updates current value on number button click', async () => {
  const button = wrapper.find('.button'); // Finn en knapp, juster selektoren etter behov
  await button.trigger('click');

  // Anta at knappen du klikket, har label "1"
  expect(wrapper.vm.currentValue).toContain('1');
});

it('calculates and updates value on equals button click', async () => {
  // Setter en tilstand for en enkel beregning
  await wrapper.setData({ previousValue: '3', currentValue: '2', operator: '+' });

  const equalsButton = wrapper.find('.equals'); // Finn "=" knappen
  await equalsButton.trigger('click');

  expect(wrapper.vm.currentValue).toBe('5');
});
