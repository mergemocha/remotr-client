<template>
  <Dialog
    v-model:visible="$store.state.commandSettings.visible"
    :modal="true"
  >
    <template #header>
      <h3><i class="pi pi-options-horizontal"/> Advanced settings for {{$store.state.commandSettings.op}} operation</h3>
    </template>

    <div class="options">
      <div class="p-fluid">
        <div class="p-field">
          <h4 class="label">Force?</h4>
          <div class="description">Setting the force option will not wait for programs to gracefully close before shutting down.</div>
          <div class="p-field-checkbox">
            <Checkbox
              id="force"
              v-model="force"
              :binary="true"
            />
            <label for="force">{{force ? 'Yes' : 'No'}}</label>
          </div>
        </div>
        <div class="p-field">
          <h4 class="label">Timeout</h4>
          <div class="description">
            The computer will wait to execute the selected action for this amount of seconds.
            Setting to 0 will execute the action immediately.
          </div>
          <div class="p-d-inline-flex p-flex-row">
            <Knob
              class="p-d-inline-flex p-flex-column p-jc-center"
              :min="0"
              :max="120"
              :disabled="useCustomTimeout"
              v-model="timeout"
            />
            <div class="nested-option p-d-inline-flex p-flex-column">
              <i class="description">
                <b>Note:</b> To preserve reasonable granularity, this gauge only allows a timeout
                of up to 120 seconds. For adjustments up to the max value of <b>315360000</b> (10 years), use the
                below custom timeout field.
              </i>
              <div class="p-field-checkbox">
                <Checkbox
                  id="use-custom-timeout"
                  v-model="useCustomTimeout"
                  :binary="true"
                />
                <label for="use-custom-timeout">Use custom timeout?</label>
              </div>
              <span class="p-float-label">
                <InputText
                  id="timeout-custom"
                  type="text"
                  v-model="customTimeout.current"
                  :disabled="!useCustomTimeout"
                  :class="{'p-invalid': isCustomTimeoutInvalid}"
                  @keyup="validateCustomTimeout"
                />
                <label
                  for="timeout-custom"
                  :class="{'label-invalid': isCustomTimeoutInvalid}"
                >
                  <span v-if="isCustomTimeoutInvalid">Value must be in range 0-{{WINDOWS_MAX_SHUTDOWN_TIMEOUT}}</span>
                  <span v-else>Custom timeout</span>
                </label>
              </span>
            </div>
        </div>
        </div>
        <div class="p-field">
          <h4 class="label">Comment</h4>
          <div class="description">
            Supply a comment as a reason for the shutdown, which will be stored in the Windows shutdown event log.
          </div>
          <div v-if="$store.state.commandSettings.op === 'logout'" class="description">
            <i><b>Note:</b> This option cannot be used with the logout operation due to a Windows limitation.</i>
          </div>
            <span class="p-float-label">
              <InputText
                id="comment"
                type="text"
                v-model="comment"
                :disabled="$store.state.commandSettings.op === 'logout'"
                :class="{'p-invalid': isCommentInvalid}"
                @keyup="validateComment"
              />
              <label
                for="comment"
                :class="{'label-invalid': isCommentInvalid}"
              >
                  <span v-if="isCustomTimeoutInvalid">Value must be less than {{WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH}} characters</span>
                  <span v-else-if="$store.state.commandSettings.op === 'logout'">(Comments cannot be supplied for logout actions)</span>
                  <span v-else>Comment</span>
              </label>
            </span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Run"
        icon="pi pi-angle-double-right"
        class="p-button-success"
        :disabled="isCustomTimeoutInvalid || isCommentInvalid"
        @click="run"
        autofocus
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Knob from 'primevue/knob'
import InputText from 'primevue/inputtext'
import { WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH, WINDOWS_MAX_SHUTDOWN_TIMEOUT } from '../common/constants'
import runBackgroundAction, { OpCtx } from '../system/runBackgroundAction'
import { DaemonOp } from '../types/Daemon'
import { ShutdownOptions } from '@/types/ShutdownOptions'

@Options({
  components: {
    Dialog,
    Button,
    Checkbox,
    Knob,
    InputText
  }
})
export default class CommandSettingsModal extends Vue {
  // Re-exported for Vue
  WINDOWS_MAX_SHUTDOWN_TIMEOUT = WINDOWS_MAX_SHUTDOWN_TIMEOUT
  WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH = WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH

  force = false
  timeout = 0
  comment = ''
  isCommentInvalid = false
  useCustomTimeout = false
  isCustomTimeoutInvalid = false
  customTimeout = {
    current: '0',
    previous: '0'
  }

  validateCustomTimeout (event: KeyboardEvent): void {
    const rawTarget = event.target as HTMLInputElement

    const value = rawTarget.value.trim()

    if (value !== '' && !/^[0-9]+$/.test(value)) {
      this.customTimeout.current = this.customTimeout.previous
    } else {
      const parsedValue = parseInt(value)
      if (parsedValue < 0 || parsedValue > WINDOWS_MAX_SHUTDOWN_TIMEOUT) {
        this.isCustomTimeoutInvalid = true
      } else {
        this.customTimeout.previous = this.customTimeout.current
        this.customTimeout.current = value
        this.isCustomTimeoutInvalid = false
      }
    }
  }

  validateComment (event: KeyboardEvent): void {
    const rawTarget = event.target as HTMLInputElement
    const value = rawTarget.value.trim()

    if (value !== '' && value.length > WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH) {
      this.isCommentInvalid = true
    }

    this.comment = value
  }

  run (): void {
    const { force } = this

    const options: ShutdownOptions = {
      force,
      timeout: this.useCustomTimeout ? parseInt(this.customTimeout.current) : this.timeout
    }

    if (this.comment !== '') {
      options.comment = this.comment
    }

    runBackgroundAction(
      this.$store.state.commandSettings.op as DaemonOp,
      this.$store.state.commandSettings.opCtx as OpCtx,
      options
    )
  }
}
</script>

<style scoped lang="scss">
.options {
  max-width: 50rem;

  .label {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .nested-option {
    margin-left: 2rem;
  }

  .label-invalid {
    color: #b00020
  }
}
</style>
