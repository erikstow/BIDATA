import { createRouter, createWebHistory } from 'vue-router';
import MainCalculator from '../components/MainCalculator.vue';
import ContactForm from '../components/ContactForm.vue';

const routes = [
  { path: '/', component: MainCalculator },
  { path: '/contact', component: ContactForm }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
