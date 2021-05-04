<template>
  <div class="p-shadow-1">
    <InputSwitch v-model="checked"></InputSwitch>
    <i class="pi pi-check"></i>
  </div>
</template>

<script lang="ts">
import '../assets/scss/style.scss'

import { Options, Vue } from 'vue-class-component'
import InputSwitch from 'primevue/inputswitch'

@Options({
  components: {
    InputSwitch
  },
  props: {
    msg: String
  }
})
export default class HelloWorld extends Vue {
  msg!: string
  checked = true
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
