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
          :value="ip"
          icon="pi pi-sitemap"
        />
        <CopyableProperty
          class="property p-m-1"
          property="MAC"
          :value="mac"
          icon="pi pi-desktop"
        />
        <CopyableProperty
          class="property p-m-1"
          property="User"
          :value="user"
          icon="pi pi-user"
        />
        <CopyableProperty
          class="property p-m-1"
          property="Hostname"
          :value="hostname"
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
          @click="runBackgroundAction('boot', getOpCtx())"
        />
        <ActionButton
          split="true"
          class="action-button p-m-1 p-button-info"
          icon="pi pi-lock"
          label="Log out"
          :items="getOptionsForOp('logout')"
          @click="runBackgroundAction('logout', getOpCtx())"
        />
        <ActionButton
          split="true"
          class="action-button p-m-1 p-button-warning"
          icon="pi pi-refresh"
          label="Reboot"
          :items="getOptionsForOp('reboot')"
          @click="runBackgroundAction('reboot', getOpCtx())"
        />
        <ActionButton
          split="true"
          class="action-button p-m-1 p-button-danger"
          icon="pi pi-power-off"
          label="Shutdown"
          :items="getOptionsForOp('shutdown')"
          @click="runBackgroundAction('shutdown', getOpCtx())"
        />
        <ActionButton
          class="action-button p-m-1 p-button-help"
          icon="pi pi-refresh"
          label="Restart daemon"
          @click="runBackgroundAction('restart', getOpCtx())"
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
import { DaemonOp } from '../types/Daemon'
import runBackgroundAction, { OpCtx } from '../system/runBackgroundAction'

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
  runBackgroundAction = runBackgroundAction // Re-export for the component to use

  getOptionsForOp (op: DaemonOp): ActionButtonOption[] {
    return [
      {
        label: 'Run with custom settings',
        icon: 'pi pi-sliders-v',
        command: (): void => this.$store.commit('toggleCommandSettingsVisible', { op, opCtx: this.getOpCtx() })
      }
    ]
  }

  getOpCtx (): OpCtx {
    const { mac, ip, user, hostname, $toast, $router } = this

    return {
      mac,
      ip,
      user,
      hostname,
      toastService: $toast,
      router: $router
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
