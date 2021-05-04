<template>
<div class="login-container">
    <div class="p-field">
      <InputText id="username" type="text" placeholder="Username" v-model="username" />
    </div>
      <div class="p-field">
      <InputText id="password" type="text" placeholder="Password" v-model="password" />
    </div>
    <Button label="Log in"/>
  </div>
</template>

<script lang="ts">
import '../assets/scss/style.scss'

import { Options, Vue } from 'vue-class-component'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

@Options({
  name: 'login',
  components: {
    InputText,
    Button
  },
  props: {
  }
})
export default class Login extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~primevue/resources/themes/md-light-indigo/theme.css';
@import '~primevue/resources/primevue.min.css';
@import '~primeflex/primeflex.css';
@import '~primeicons/primeicons.css';

.login-container {
  width: fit-content;
  margin: auto;
  padding: 3%;
  box-shadow: 0 0.2em 0.4em 0 rgba(0, 0, 0, 0.2);
}
  .p-field * {
    display:block;
  }
</style>
