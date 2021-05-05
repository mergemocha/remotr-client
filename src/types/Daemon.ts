export type DaemonOp = 'boot' | 'logout' | 'reboot' | 'shutdown' | 'restart'

export default interface Daemon {
  mac: string
  ip?: string
  user?: string
  hostname?: string
}
