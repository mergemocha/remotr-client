export type DaemonOp = 'boot' | 'logout' | 'reboot' | 'shutdown' | 'restart'

export default interface Daemon {
  token: string
  mac: string
  ip?: string
  user?: string
  hostname?: string
}
