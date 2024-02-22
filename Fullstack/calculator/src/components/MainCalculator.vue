<template>
  <div class="calculator">

    <!-- Display -->
    <CalculatorDisplay :value="currentValue || '0'" />

    <!-- Knapper -->
    <div class="keypad">
      <CalculatorButton label="C" class="button special" @click="clear" />
      <CalculatorButton label="ANS" class="button special" @click="answer" />
      <CalculatorButton label="DEL" class="button special" @click="deleteLast" />
      <CalculatorButton label="+" class="button operator" @click="setOperator('+')" />

      <CalculatorButton label="7" class="button" @click="appendToCurrent('7')" />
      <CalculatorButton label="8" class="button" @click="appendToCurrent('8')" />
      <CalculatorButton label="9" class="button" @click="appendToCurrent('9')" />
      <CalculatorButton label="-" class="button operator" @click="setOperator('-')" />

      <CalculatorButton label="4" class="button" @click="appendToCurrent('4')" />
      <CalculatorButton label="5" class="button" @click="appendToCurrent('5')" />
      <CalculatorButton label="6" class="button" @click="appendToCurrent('6')" />
      <CalculatorButton label="*" class="button operator" @click="setOperator('*')" />

      <CalculatorButton label="1" class="button" @click="appendToCurrent('1')" />
      <CalculatorButton label="2" class="button" @click="appendToCurrent('2')" />
      <CalculatorButton label="3" class="button" @click="appendToCurrent('3')" />
      <CalculatorButton label="/" class="button operator" @click="setOperator('/')" />

      <CalculatorButton class="button empty" /> <!-- Tom knapp -->
      <CalculatorButton label="0" class="button zero" @click="appendToCurrent('0')" />
      <CalculatorButton label="." class="button" @click="appendToCurrent('.')" />
      <CalculatorButton label="=" class="button equals" @click="calculate" />
    </div>

    <!-- Logg -->
    <CalculationLog :logEntries="logEntries" />
  </div>
</template>


<script>
import CalculatorDisplay from './CalculatorDisplay.vue';
import CalculatorButton from './CalculatorButton.vue';
import CalculationLog from './CalculationLog.vue';

export default {
  name: 'MainCalculator',
  components: {
    CalculatorDisplay,
    CalculatorButton,
    CalculationLog,
  },
  data() {
    return {
      currentValue: '',
      previousValue: null,
      operator: null,
      operatorClicked: false,
      logEntries: [],
    };
  },
  methods: {
    clear() {
      this.currentValue = '';
      this.previousValue = null;
      this.operator = null;
      this.operatorClicked = false;
    },
    appendToCurrent(number) {
      if (this.operatorClicked) {
        this.currentValue = '';
        this.operatorClicked = false;
      }
      this.currentValue += number;
    },
    setOperator(op) {
      if (this.currentValue === '') return;
      if (this.previousValue !== null) {
        this.calculate();
      }
      this.operator = op;
      this.previousValue = this.currentValue;
      this.operatorClicked = true;
      console.log('Operator set to:', this.operator); //for feilsøking
    },
    calculate() {
  // Construct the expression string
  const expression = `${this.previousValue} ${this.operator} ${this.currentValue}`;
  
  // Send the expression to the backend for calculation
  fetch('http://localhost:8081/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    this.currentValue = String(data.result);
    this.addLogEntry(`${this.previousValue} ${this.operator} ${this.currentValue} = ${data.result}`);
    this.previousValue = null; // Clear the previous value
    this.operator = null; // Clear the operator
    this.operatorClicked = false; // Reset operator clicked state
  })
  .catch(error => {
    console.error('Error during calculation:', error);
    alert('There was an error processing your request');
  });
},
    deleteLast() {
      this.currentValue = this.currentValue.slice(0, -1);
    },
    answer() {
      if (this.logEntries.length === 0)
        return;
      const lastEntry = this.logEntries[this.logEntries.length - 1];
      const parts = lastEntry.split(' ');
      this.currentValue = parts[parts.length - 1];
    },
    addLogEntry(entry) {
      console.log('Adding log entry:', entry); // feilsøking
      this.logEntries.push(entry);
    },
  }
}
</script>

<style scoped>
.calculator {
  width: 100%;
  max-width: 320px;
  margin: auto;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr); 
  gap: 10px;
}

.button {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.5rem;
  background-color: #f9f9f9;
}

.special {
  background-color: orange;
  color: white;
}

.operator, .equals {
  background-color: orange;
  color: white;
}

.empty {
  background-color: transparent;
  border: none; 
}

</style>