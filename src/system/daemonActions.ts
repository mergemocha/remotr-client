import { ShutdownOptions } from '@/types/ShutdownOptions'
import axios, { AxiosResponse } from 'axios'
import { getDaemonActionBaseURL, joinUrl } from './apiUtils'

export async function boot (mac: string, options?: ShutdownOptions): Promise<AxiosResponse> {
  return (await axios.post(joinUrl(getDaemonActionBaseURL(mac), 'boot'), options))
}

export async function logout (mac: string, options?: ShutdownOptions): Promise<AxiosResponse> {
  return (await axios.post(joinUrl(getDaemonActionBaseURL(mac), 'logout'), options))
}

export async function reboot (mac: string, options?: ShutdownOptions): Promise<AxiosResponse> {
  return (await axios.post(joinUrl(getDaemonActionBaseURL(mac), 'reboot'), options))
}

export async function shutdown (mac: string, options?: ShutdownOptions): Promise<AxiosResponse> {
  return (await axios.post(joinUrl(getDaemonActionBaseURL(mac), 'shutdown'), options))
}

export async function restart (mac: string): Promise<AxiosResponse> {
  return (await axios.post(joinUrl(getDaemonActionBaseURL(mac), 'restart')))
}
