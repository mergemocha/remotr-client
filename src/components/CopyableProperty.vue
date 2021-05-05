<template>
  <Button
    v-bind:label="label"
    v-bind:icon="icon"
    v-tooltip.top="'Click to copy...'"
    v-on:click="copy"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Button from 'primevue/button'
import copyToClipboard from 'copy-to-clipboard'

class Props {
  property!: string
  value!: string
  icon?: string
  tooltipPosition?: 'top' | 'bottom'
}

@Options({
  components: {
    Button
  }
})
export default class CopyableProperty extends Vue.with(Props) {
  get label (): string {
    return `${this.property}: ${this.value}`
  }

  copy = (): void => {
    copyToClipboard(this.value)
  }
}
</script>

<style scoped lang="scss">
.copyable-property {
  margin-top: 5px;
}
</style>
