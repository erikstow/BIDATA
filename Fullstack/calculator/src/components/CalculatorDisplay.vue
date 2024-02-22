<template>
  <div class="display">{{ value }}</div>
</template>

<script>
export default {
  props: ['value']
};
</script>

<style scoped>
.display {
  display: flex;
  align-items: center; 
  justify-content: flex-end; 
  height: 60px; 
  margin: 20px;
  padding: 0 10px; 
  background-color: #f9f9f9;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 1.5rem; 
  overflow: hidden; 
}


</style>
