import { createStore } from 'vuex';

export default createStore({
  state: {
    contacts: []
  },
  mutations: {
    saveContact(state, contact) {
      state.contacts.push(contact);
    }
  }
});