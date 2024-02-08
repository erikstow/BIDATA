<template>
  <div id="app">
    <Calculator/>
  </div>
</template>

<script>
import Calculator from './components/MainCalculator.vue';

export default {
  name: 'App',
  components: {
    Calculator
  }
};
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif; 
  background-color: #f5f5f5; 
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
}

@media (max-width: 600px) {
  .calculator {
    width: 90%; /* Gjør kalkulatoren mindre på små skjermer */
  }
}

</style>
