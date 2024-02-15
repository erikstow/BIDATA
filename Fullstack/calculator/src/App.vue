<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
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
