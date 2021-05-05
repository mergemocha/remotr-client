<template>
  <Card class="daemon p-mb-2 p-mr-2">
    <template #title>
      <div class="title">{{user}}@{{hostname}}</div>
    </template>
    <template #content>
      <div class="description">
        Daemon information
      </div>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <CopyableProperty
          class="property p-m-1"
          property="IP"
          v-bind:value="ip"
          icon="pi pi-sitemap"
        />
        <CopyableProperty
          class="property p-m-1"
          property="MAC"
          v-bind:value="mac"
          icon="pi pi-desktop"
        />
        <CopyableProperty
          class="property p-m-1"
          property="User"
          v-bind:value="user"
          icon="pi pi-user"
        />
        <CopyableProperty
          class="property p-m-1"
          property="Hostname"
          v-bind:value="hostname"
          icon="pi pi-home"
        />
      </div>
    </template>
    <template #footer>
      <div class="description">
        Actions
      </div>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <ActionButton
          class="action-button p-m-1 p-button-success"
          icon="pi pi-power-off"
          label="Boot"
        />
        <ActionButton
          split="true"
          class="action-button p-m-1 p-button-info"
          icon="pi pi-lock"
          label="Log out"
          v-bind:items="items"
        />
        <ActionButton
          split="true"
          class="action-button p-m-1 p-button-warning"
          icon="pi pi-refresh"
          label="Reboot"
          v-bind:items="items"
        />
        <ActionButton
          split="true"
          class="action-button p-m-1 p-button-danger"
          icon="pi pi-power-off"
          label="Shutdown"
          v-bind:items="items"
        />
        <ActionButton
          class="action-button p-m-1 p-button-help"
          icon="pi pi-refresh"
          label="Restart daemon"
        />
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Card from 'primevue/card'
import CopyableProperty from './CopyableProperty.vue'
import ActionButton, { ActionButtonOption } from './ActionButton.vue'
import store from '../store'
import { DaemonOp } from '../types/Daemon'
import { boot, logout, reboot, shutdown, restart } from '../system/daemonActions'
import { determineRequestErrorReason, RequestFailureReason, ResponseCode } from '@/system/apiUtils'
import Toast from '../types/Toast'

class Props {
  ip!: string
  mac!: string
  user!: string
  hostname!: string
}

@Options({
  components: {
    Card,
    CopyableProperty,
    ActionButton
  }
})
export default class Daemon extends Vue.with(Props) {
  items: ActionButtonOption[] = [
    {
      label: 'Advanced settings',
      icon: 'pi pi-sliders-v',
      command: (): void => store.commit('toggleCommandSettingsVisible')
    }
  ]

  async runQuickAction (action: DaemonOp): Promise<void> {
    try {
      const toast: Toast = { severity: 'success', summary: 'Success', life: 3000 }

      switch (action) {
        case 'boot':
          await boot(this.mac)
          toast.detail = `Boot packet sent to ${this.user}@${this.hostname} (${this.mac}).`
          break
        case 'logout':
          await logout(this.mac)
          toast.detail = `Logout request sent to ${this.user}@${this.hostname} (${this.mac}).`
          break
        case 'reboot':
          await reboot(this.mac)
          toast.detail = `Reboot request sent to ${this.user}@${this.hostname} (${this.mac}).`
          break
        case 'shutdown':
          await shutdown(this.mac)
          toast.detail = `Shutdown request sent to ${this.user}@${this.hostname} (${this.mac}).`
          break
        case 'restart':
          await restart(this.mac)
          toast.detail = `Daemon restart issued on ${this.user}@${this.hostname} (${this.mac}).`
          break
      }

      this.$toast.add(toast)
    } catch (err) {
      const { reason, code } = determineRequestErrorReason(err)

      if (reason === RequestFailureReason.RECEIVED_ERROR_RESPONSE) {
        const toast: Toast = { severity: 'error', life: 3000 }

        switch (code) {
          case ResponseCode.UNAUTHORIZED:
            toast.summary = 'Session expired'
            toast.detail = 'Your session has expired, and you will need to log in again. Logging out in 3 seconds...'
            setTimeout(() => store.commit('logout'), 3000)
            break
          case ResponseCode.NOT_FOUND:
            toast.summary = 'Daemon not found'
            toast.detail = `Daemon ${this.user}@${this.hostname} (${this.mac}) not found. The daemon may have been deregistered.`
            break
          case ResponseCode.TOO_MANY_REQUESTS:
            toast.summary = 'Too many requests'
            toast.detail = 'You\'re issuing commands too quickly. Please wait a moment and try again.'
            break
          case ResponseCode.INTERNAL_SERVER_ERROR:
            toast.summary = 'Server error'
            toast.detail = 'The server reported an unspecified error. Please try again later.'
            break
          case ResponseCode.ORIGIN_IS_UNREACHABLE:
            toast.summary = 'Daemon is unreachable'
            toast.detail = 'The daemon is not responding, and is probably offline.'
            break
          case ResponseCode.DAEMON_RETURNED_ERROR:
            toast.summary = 'Daemon reported error'
            toast.detail = `The daemon reported that your request could not be fulfilled. Details: ${err.response.data.error}`
            break
        }

        this.$toast.add(toast)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.daemon {
  max-width: 500px;

  .title {
    text-align: center;
  }

  .property {
    margin-top: 0.5rem;
  }

  .description {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .action-button {
    margin-top: 5px;
  }
}
</style>
