import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import Tooltip from 'primevue/tooltip'
import App from './App.vue'
import { store } from './store'

const app = createApp(App)

app.directive('tooltip', Tooltip)

app
  .use(store)
  .use(PrimeVue, { ripple: true })
  .mount('#app')
