<template>
  <Toolbar class="p-shadow-3">
    <template #left>
      <h2>Remotr</h2>
    </template>
    <template #right>
      <Button label="Logout" icon="pi pi-lock" id="logout-button"/>
    </template>
  </Toolbar>
  <div class="daemon-view p-d-flex p-flex-wrap p-flex-column p-flex-md-row p-jc-center">
    <Daemon/>
    <Daemon/>
    <Daemon/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Daemon from '../components/Daemon.vue'

@Options({
  components: {
    Toolbar,
    Button,
    Tag,
    Daemon
  }
})
export default class Main extends Vue {}
</script>

<style scoped lang="scss">
h2 {
  margin: 0;
}

.daemon-view {
  margin: 1em;
}
</style>
