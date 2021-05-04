<template>
<div class="login-container">
    <div class="p-field">
      <InputText id="username" type="text" placeholder="Username" :class="{'p-invalid':isUserEmpty}" v-model="username"/>
      <small v-if="v$.username.$invalid && isUserEmpty" class="p-error">Username required</small>
    </div>
    <div class="p-field">
      <Password id="password" placeholder="Password" :class="{'p-invalid':isPassEmpty}" v-model="password" :feedback="false" toggleMask/>
      <small v-if="v$.password.$invalid && isPassEmpty" class="p-error">Password required</small>
    </div>
    <small v-if="isInv" class="invalid">Username or password is invalid.</small>
    <Button label="Log in" @click="validate($event)"/>
  </div>
</template>

<script lang="ts">
import '../assets/scss/style.scss'
import { Options, Vue } from 'vue-class-component'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'

axios.defaults.withCredentials = true

@Options({
  name: 'login',
  components: {
    InputText,
    Button,
    Password
  },
  data () {
    return {
      v$: useVuelidate(),
      username: '',
      password: '',
      isUserEmpty: false,
      isPassEmpty: false,
      isInv: false
    }
  },
  props: {
  },
  methods: {
    validate () :void {
      this.v$.$validate()
      if (this.v$.username.$error) this.isUserEmpty = true
      if (this.v$.password.$error) this.isPassEmpty = true
      if (!this.isUserEmpty && !this.isPassEmpty) this.authenticate()
    },

    async authenticate () : Promise<void> {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/v1/user/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: this.username,
          password: this.password
        }
      })

      if (response.status === 200) {
        console.log(response.statusText)
        this.isInv = false
      } else if (response.status === 400) {
        console.log('ERROR:' + response.statusText)
        this.isInv = true
      } else {
        console.log(response.statusText)
        this.isInv = true
      }
    }
  },
  validations () {
    return {
      username: { required },
      password: { required }
    }
  }
})

export default class Login extends Vue {}
</script>

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
  .p-error {
    font-size: 0.7rem;
    text-align: left;
    padding: 0.3em 0 0 0.5em;
  }
  .p-inputtext, .p-password {
    width: 100%;
  }
</style>
