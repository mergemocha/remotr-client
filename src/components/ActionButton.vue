<template>
  <SplitButton
    v-if="split"
    :icon="icon"
    :label="label"
    :model="items"
  />
  <Button
    v-else
    :icon="icon"
    :label="label"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Button from 'primevue/button'
import SplitButton from 'primevue/splitbutton'

export interface ActionButtonOption {
  label: string
  icon?: string
  command: () => void | Promise<void>
}

class Props {
  split?: boolean
  icon?: string
  label!: string
  items?: ActionButtonOption[]
}

@Options({
  components: {
    Button,
    SplitButton
  }
})
export default class ActionButton extends Vue.with(Props) {}
</script>

<style scoped lang="scss"></style>
