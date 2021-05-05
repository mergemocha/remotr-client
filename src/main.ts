import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import store from './store'
import Vuelidate from 'vuelidate'
import router from './router'

const app = createApp(App)

app.directive('tooltip', Tooltip)

app
  .use(store)
  .use(router)
  .use(PrimeVue, Vuelidate, { ripple: true })
  .use(ToastService)
  .mount('#app')
