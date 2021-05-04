<template>
  <login></login>
  <Main/>
</template>

<script lang="ts">
import './assets/scss/style.scss'

import { Options, Vue } from 'vue-class-component'
import Login from './components/Login.vue'
import Main from './views/Main.vue'

@Options({
  components: {
    Login
    Main
  }
})
export default class App extends Vue {}
</script>

<style scoped></style>
