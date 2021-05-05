<template>
  <Card class="daemon p-mb-2 p-mr-2">
    <template #title>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <Skeleton width="150px" height="30px"/>
      </div>
    </template>
    <template #content>
      <div class="description p-d-flex p-flex-wrap p-jc-center">
        <Skeleton width="150px"/>
      </div>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <Skeleton class="property p-m-1" width="200px" height="40px"/>
        <Skeleton class="property p-m-1" width="200px" height="40px"/>
        <Skeleton class="property p-m-1" width="200px" height="40px"/>
        <Skeleton class="property p-m-1" width="200px" height="40px"/>
      </div>
    </template>
    <template #footer>
      <div class="description p-d-flex p-flex-wrap p-jc-center">
        <Skeleton width="150px"/>
      </div>
      <div class="p-d-flex p-flex-wrap p-jc-center">
        <Skeleton class="property p-m-1" width="100px" height="40px"/>
        <Skeleton class="property p-m-1" width="150px" height="40px"/>
        <Skeleton class="property p-m-1" width="150px" height="40px"/>
        <Skeleton class="property p-m-1" width="175px" height="40px"/>
        <Skeleton class="property p-m-1" width="175px" height="40px"/>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import CopyableProperty from './CopyableProperty.vue'
import ActionButton from './ActionButton.vue'

@Options({
  components: {
    Skeleton,
    Card,
    CopyableProperty,
    ActionButton
  }
})
export default class DummyDaemon extends Vue {}
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
  }

  .action-button {
    margin-top: 5px;
  }
}
</style>
