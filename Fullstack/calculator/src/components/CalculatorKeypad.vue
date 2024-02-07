<template>
  <div class="keypad">
    <Button v-for="button in buttons" :key="button" :value="button" @button-clicked="handleButtonClick" />
  </div>
</template>

<script>
import Button from './CalculatorButton.vue';

export default {
  components: { Button },
  data() {
    return {
      buttons: ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '0', '=', '/', 'C']
    };
  },
  methods: {
    handleButtonClick(value) {
      this.$emit('button-clicked', value);
    }
  }
};
</script>

<style scoped>
.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px;
}
</style>
