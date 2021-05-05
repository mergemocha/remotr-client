import { OpCtx } from '@/system/runBackgroundAction'
import { createStore } from 'vuex'
import Daemon, { DaemonOp } from '../types/Daemon'

export interface CommandSettings {
  op?: DaemonOp
  opCtx?: OpCtx
  visible: boolean
}

export interface GlobalState {
  daemons: Daemon[],
  commandSettings: CommandSettings
}

export default createStore<GlobalState>({
  state: {
    daemons: [],
    commandSettings: {
      op: undefined,
      opCtx: undefined,
      visible: false
    }
  },
  mutations: {
    setDaemons (state, daemons: Daemon[]) {
      state.daemons = daemons
    },
    toggleCommandSettingsVisible (state, settings: CommandSettings) {
      state.commandSettings = {
        ...settings,
        visible: !state.commandSettings.visible
      }
    }
  },
  actions: {},
  modules: {}
})
