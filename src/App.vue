<template>
  <Main/>
</template>

<script lang="ts">
import './assets/scss/style.scss'

import { Options, Vue } from 'vue-class-component'
import Login from './views/Login.vue'
import Main from './views/Main.vue'

@Options({
  components: {
    Main,
    Login
  }
})
export default class App extends Vue {}
</script>

<style scoped></style>
