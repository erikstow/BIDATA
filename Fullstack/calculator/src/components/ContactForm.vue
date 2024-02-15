<template>
  <div>
    <h1>Kontaktskjema</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Navn:</label>
        <input id="name" v-model="name" required>
      </div>
      <div>
        <label for="email">E-post:</label>
        <input id="email" type="email" v-model="email" required>
      </div>
      <div>
        <label for="message">Melding:</label>
        <textarea id="message" v-model="message" required></textarea>
      </div>
      <button type="submit" :disabled="!formIsValid">Send inn</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      name: '',
      email: '',
      message: ''
    };
  },
  computed: {
    formIsValid() {
      return this.name && this.email.includes('@') && this.message;
    }
  },
  methods: {
  async submitForm() {
    const formData = { name: this.name, email: this.email, message: this.message };
    try {
      const response = await fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Skjema sendt suksessfullt!');
      } else {
        alert('Noe gikk galt med innsendingen.');
      }
    } catch (error) {
      console.error('Feil ved innsending av skjema:', error);
      alert('En feil oppstod, vennligst prøv igjen.');
    }
    this.$store.commit('saveContact', formData);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
}
</script>
