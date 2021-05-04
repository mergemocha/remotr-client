import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import Vuelidate from 'vuelidate'

createApp(App)
  .use(store)
  .use(PrimeVue, Vuelidate)
  .mount('#app')
