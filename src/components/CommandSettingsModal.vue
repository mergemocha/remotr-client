<template>
  <Dialog
    v-model:visible="store.state.commandSettingsVisible"
    :modal="true"
  >
    <template #header>
      <h3>Advanced settings</h3>
    </template>

    Content

    <template #footer>
      <Button label="No" icon="pi pi-times" class="p-button-text"/>
      <Button label="Yes" icon="pi pi-check" autofocus />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import store from '../store'

@Options({
  components: {
    Dialog,
    Button
  }
})
export default class CommandSettingsModal extends Vue {
  store = store
}
</script>

<style scoped lang="scss"></style>
