import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App)
  .use(store)
  .use(PrimeVue)
  .mount('#app')
