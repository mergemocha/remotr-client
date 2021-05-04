<template>
  <Card class="daemon p-mb-2 p-mr-2">
    <template #title>
      <div class="title">
        hello@CORSAIRONE
      </div>
    </template>
    <template #content>
      <div class="description">
        Daemon information
      </div>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <CopyableProperty
          class="property p-mr-2"
          property="IP"
          value="192.168.0.1"
          icon="pi pi-sitemap"
        />
        <CopyableProperty
          class="property p-mr-2"
          property="MAC"
          value="ff:ff:ff:ff:ff:ff"
          icon="pi pi-desktop"
        />
        <CopyableProperty
          class="property p-mr-2"
          property="User"
          value="hello"
          icon="pi pi-user"
        />
        <CopyableProperty
          class="property p-mr-2"
          property="Hostname"
          value="CORSAIRONE"
          icon="pi pi-home"
        />
      </div>
    </template>
    <template #footer>
      <div class="description">
        Actions
      </div>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <Button
          class="action-button p-mr-2 p-button-success"
          icon="pi pi-power-off"
          label="Boot"
        />
        <SplitButton
          class="action-button p-mr-2 p-button-info"
          icon="pi pi-lock"
          label="Log out"
        />
        <SplitButton
          class="action-button p-mr-2 p-button-warning"
          icon="pi pi-refresh"
          label="Reboot"
        />
        <SplitButton
          class="action-button p-mr-2 p-button-danger"
          icon="pi pi-power-off"
          label="Shutdown"
        />
        <Button
          class="action-button p-mr-2 p-button-help"
          icon="pi pi-refresh"
          label="Restart daemon"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import Button from 'primevue/button'
import SplitButton from 'primevue/splitbutton'
import Card from 'primevue/card'
import CopyableProperty from './CopyableProperty'

@Options({
  components: {
    Card,
    Button,
    SplitButton,
    CopyableProperty
  }
})

@Options({
  data: {
    items: [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
          this.$toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 })
        }
      }
    ]
  }
})
export default class Daemon extends Vue {

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
