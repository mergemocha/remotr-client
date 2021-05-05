export default interface Toast {
  severity: 'success' | 'warn' | 'error' | 'info',
  summary?: string,
  detail?: string,
  life?: number
}
