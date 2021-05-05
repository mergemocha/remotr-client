<template>
  <div class="login-container">
    <div class="login p-shadow-3">
      <div class="Title">
        <h1>Remotr</h1>
      </div>
      <div class="p-field">
        <InputText
          id="username"
          type="text"
          placeholder="Username"
          :class="{'p-invalid': isUserEmpty || isInvalid}"
          @keyup="handleKeyPress($event, 'username')"
          v-model="username"
        />
        <small
          v-if="v$.username.$invalid && isUserEmpty"
          class="p-error"
        >
          Username is required.
        </small>
      </div>
      <div class="p-field">
        <Password
          id="password"
          placeholder="Password"
          :class="{'p-invalid': isPassEmpty || isInvalid}"
          @keyup="handleKeyPress($event, 'password')"
          v-model="password"
          :feedback="false"
          toggleMask
        />
        <small
          v-if="v$.password.$invalid && isPassEmpty"
          class="p-error"
        >
          Password is required.
        </small>
      </div>
      <div class="login-button">
        <small v-if="isInvalid" class="p-error">Username or password is invalid.</small>
      </div>
      <Button label="Log in" @click="validate($event)"/>
    </div>
  </div>
</template>

<script lang="ts">
import '../assets/scss/style.scss'
import { Options, Vue } from 'vue-class-component'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios'
import Keybinding from 'keybinding'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Password from 'primevue/password'

import logHTTPRequestError from '../utils/logHTTPRequestError'
import { API_BASE_URL, joinUrl, determineRequestErrorReason, RequestFailureReason, ResponseCode } from '../system/apiUtils'
import router from '../router'
import Toast from '../types/Toast'

axios.defaults.withCredentials = true

@Options({
  components: {
    InputText,
    Button,
    Password
  },

  validations () {
    return {
      username: { required },
      password: { required }
    }
  }
})

export default class Login extends Vue {
  username = ''
  password = ''
  isUserEmpty = false
  isPassEmpty = false
  isInvalid = false

  // Have to use any here because Vuelidate does not play nice with TypeScript
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v$: any = useVuelidate()

  mounted (): void {
    const keybinding = new Keybinding()
    keybinding.on('enter', this.validate)
  }

  async authenticate (): Promise<void> {
    try {
      await axios.post(joinUrl(API_BASE_URL, 'user/login'), {
        username: this.username,
        password: this.password
      })
      this.$toast.add({ severity: 'success', summary: 'Success', detail: 'User authenticated. Logging in.', life: 3000 })
      this.isInvalid = false
      router.push('/')
    } catch (err) {
      const { reason, code } = determineRequestErrorReason(err)

      if (reason === RequestFailureReason.RECEIVED_ERROR_RESPONSE && code === ResponseCode.UNAUTHORIZED) {
        this.isInvalid = true
      } else {
        logHTTPRequestError(err)
        this.$toast.add({ severity: 'error', summary: 'Unable to authenticate', detail: 'Could not contact the server for authentication. Details have been outputted into the log.', life: 3000 })
      }
    }
  }

  validate (): void {
    this.v$.$validate()

    if (this.v$.username.$error) {
      if (!this.v$.password.$error) this.isPassEmpty = false
      this.isUserEmpty = true
      this.isInvalid = false
    }

    if (this.v$.password.$error) {
      if (!this.v$.username.$error) this.isUserEmpty = false
      this.isPassEmpty = true
      this.isInvalid = false
    }

    if (!this.isUserEmpty && !this.isPassEmpty) this.authenticate()
  }

  handleKeyPress (event: KeyboardEvent, field: string): void {
    if (event.key === 'Enter') this.validate()

    this.resetInvalidation(field)
  }

  resetInvalidation (field: string): void {
    this.isInvalid = false
    field === 'username' ? this.isUserEmpty = false : this.isPassEmpty = false
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  logError (err: any): void {
    const { reason, code } = determineRequestErrorReason(err)

    if (reason === RequestFailureReason.RECEIVED_ERROR_RESPONSE) {
      const toast: Toast = { severity: 'error', life: 3000 }

      switch (code) {
        case ResponseCode.UNAUTHORIZED:
          toast.summary = 'Unauthorized login'
          toast.detail = 'There was an error in session handling.'
          break
        case ResponseCode.TOO_MANY_REQUESTS:
          toast.summary = 'Too many requests'
          toast.detail = 'You\'re issuing commands too quickly. Please wait a moment and try again.'
          break
        case ResponseCode.INTERNAL_SERVER_ERROR:
          toast.summary = 'Server error'
          toast.detail = 'The server reported an unspecified error. Please try again later.'
          break
      }

      this.$toast.add(toast)
    }
  }
}
</script>

<style lang="scss">
body {
  width: 100vw;
  height: 100vh;
}

.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  padding: 1rem 2rem 2rem 2rem;
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
  margin-bottom: 5%;
}
</style>
