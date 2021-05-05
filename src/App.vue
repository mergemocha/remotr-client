<template>
  <div>
    <Main/>
    <Toast position="bottom-right"/>
  </div>
</template>

<script lang="ts">
import './assets/scss/style.scss'

import { Options, Vue } from 'vue-class-component'
import Toast from 'primevue/toast'
import Main from './views/Main.vue'

@Options({
  components: {
    Main,
    Toast
  }
})
export default class App extends Vue {}
</script>

<style scoped></style>
