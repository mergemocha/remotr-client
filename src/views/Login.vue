<template>
<div class="login-container">
    <div class="p-field">
      <InputText id="username" type="text" placeholder="Username" :class="{'p-invalid':isUserEmpty || isInv}" v-model="username"/>
      <small v-if="v$.username.$invalid && isUserEmpty" class="p-error">Username required</small>
    </div>
    <div class="p-field">
      <Password id="password" placeholder="Password" :class="{'p-invalid':isPassEmpty || isInv}" v-model="password" :feedback="false" toggleMask/>
      <small v-if="v$.password.$invalid && isPassEmpty" class="p-error">Password required</small>
    </div>
    <div class="login-button"><small id="login-invalid-text" v-if="isInv" class="p-error">Username or password is invalid.</small></div>
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
import logHTTPRequestError from '../utils/logHTTPRequestError'
import { API_BASE_URL, joinUrl } from '../system/apiUtils'
import router from '../router'

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
    validate () {
      this.v$.$validate()
      if (this.v$.username.$error) this.isUserEmpty = true
      if (this.v$.password.$error) this.isPassEmpty = true
      if (!this.isUserEmpty && !this.isPassEmpty) this.authenticate()
    },

    async authenticate () {
      try {
        const response = await axios({
          method: 'post',
          url: joinUrl(API_BASE_URL, 'user/login'),
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
          router.push('/')
        }
      } catch (err) {
        if (err.response.status === 400) this.isInv = true
        logHTTPRequestError(err)
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
  text-align: center;
  font-family: Roboto, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
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

  .login-button {
    display: block;
  }
    #login-invalid-text {
      margin-bottom: 5em !important;
    }
</style>
