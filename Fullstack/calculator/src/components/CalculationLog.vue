<template>
  <div class="calculation-log">
    {{ console.log(logEntries) }}
    <div v-for="(entry, index) in logEntries" :key="index" class="calculation-log-entry">{{ entry }}</div>
  </div>
</template>

<script>
export default {
  props: ['logEntries']
};
</script>

<style scoped>
.calculation-log {
  margin: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.calculation-log-entry {
  margin-bottom: 5px;
}

</style>