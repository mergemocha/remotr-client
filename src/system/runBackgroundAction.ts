import { ShutdownOptions } from '@/types/ShutdownOptions'
import Toast from '@/types/Toast'
import { deleteCookie } from 'cookies-utils'
import { ToastServiceMethods } from 'primevue/toastservice'
import { Router } from 'vue-router'
import Daemon, { DaemonOp } from '../types/Daemon'
import { determineRequestErrorReason, RequestFailureReason, ResponseCode } from './apiUtils'
import { boot, logout, reboot, restart, shutdown } from './daemonActions'

export interface OpCtx extends Daemon {
  toastService: ToastServiceMethods
  router: Router
}

/**
 * Runs a daemon op (action) in the background, showing a toast with the eventual result.
 *
 * If no options are specified, the op will be run with default parameters.
 *
 * @param op - {@link DaemonOp}
 * @param options - {@link ShutdownOptions}
 * @param ctx - {@link OpCtx}
 */
export default (op: DaemonOp, ctx: OpCtx, options?: ShutdownOptions): void => {
  // Having to do this the old-fashioned way because we can't use async/await in Vue renders
  switch (op) {
    case 'boot':
      boot(ctx.mac, options)
        .then(() => logActionSuccess(ctx, `Boot packet sent to ${ctx.user}@${ctx.hostname} (${ctx.mac}).`))
        .catch(err => logActionError(ctx, err))
      break
    case 'logout':
      logout(ctx.mac, options)
        .then(() => logActionSuccess(ctx, `Logout request sent to ${ctx.user}@${ctx.hostname} (${ctx.mac}).`))
        .catch(err => logActionError(ctx, err))
      break
    case 'reboot':
      reboot(ctx.mac, options)
        .then(() => logActionSuccess(ctx, `Reboot request sent to ${ctx.user}@${ctx.hostname} (${ctx.mac}).`))
        .catch(err => logActionError(ctx, err))
      break
    case 'shutdown':
      shutdown(ctx.mac, options)
        .then(() => logActionSuccess(ctx, `Shutdown request sent to ${ctx.user}@${ctx.hostname} (${ctx.mac}).`))
        .catch(err => logActionError(ctx, err))
      break
    case 'restart':
      restart(ctx.mac)
        .then(() => logActionSuccess(ctx, `Daemon restart issued on ${ctx.user}@${ctx.hostname} (${ctx.mac}).`))
        .catch(err => logActionError(ctx, err))
      break
  }
}

/**
 * Promise resolution shorthand to log that an action succeeded.
 *
 * @param ctx - {@link OpCtx}
 * @param message - Success toast message.
 * @param summary - Optional toast title.
 */
function logActionSuccess (ctx: OpCtx, message: string, summary?: string): void {
  ctx.toastService.add({ severity: 'success', summary: summary || 'Success', detail: message, life: 3000 })
}

/**
 * Promise rejection shorthand to log than an operation failed.
 *
 * @param ctx - {@link OpCtx}
 * @param err - Request error object.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function logActionError (ctx: OpCtx, err: any): void {
  const { reason, code } = determineRequestErrorReason(err)

  if (reason === RequestFailureReason.RECEIVED_ERROR_RESPONSE) {
    const toast: Toast = { severity: 'error', life: 3000 }

    switch (code) {
      case ResponseCode.UNAUTHORIZED:
        toast.summary = 'Session expired'
        toast.detail = 'Your session has expired, and you will need to log in again. Logging out in 3 seconds...'
        setTimeout(() => {
          deleteCookie('connect.sid')
          ctx.router.push('/login')
        }, 3000)
        break
      case ResponseCode.NOT_FOUND:
        toast.summary = 'Daemon not found'
        toast.detail = `Daemon ${ctx.user}@${ctx.hostname} (${ctx.mac}) not found. The daemon may have been deregistered.`
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
        toast.detail = `Daemon ${ctx.user}@${ctx.hostname} (${ctx.mac}) is not responding, and is probably offline.`
        break
      case ResponseCode.DAEMON_RETURNED_ERROR:
        toast.summary = 'Daemon reported error'
        toast.detail = `Daemon ${ctx.user}@${ctx.hostname} (${ctx.mac}) reported that your request could not be fulfilled. Details: ${err.response.data.error}`
        break
    }

    ctx.toastService.add(toast)
  }
}
