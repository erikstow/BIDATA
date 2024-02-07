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
  align-items: center; /* Senterer teksten vertikalt */
  justify-content: flex-end; /* Holder tallene til høyre */
  height: 60px; /* Fast høyde for å unngå størrelsesendringer */
  margin: 20px;
  padding: 0 10px; /* Juster padding etter behov */
  background-color: #f9f9f9;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 1.5rem; /* Juster fontstørrelsen etter behov */
  overflow: hidden; /* Forhindre overflow */
}


</style>
