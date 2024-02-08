<template>
  <button class = "button" @click="handleClick">{{ label }}</button>
</template>

<script>
export default {
  props: ['label', 'extraClass'],
  methods: {
    handleClick() {
      this.$emit('button-clicked', this.label);
    }
  }
};
</script>

<style scoped>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px; 
  background-color: #f0f0f0; 
  color: #333; 
  border-radius: 5px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #e0e0e0; 
}
</style>
