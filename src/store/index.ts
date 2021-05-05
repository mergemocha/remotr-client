import { createStore } from 'vuex'
import Daemon from '../types/Daemon'

export interface GlobalState {
  daemons: Daemon[],
  commandSettingsVisible: boolean
}

export default createStore<GlobalState>({
  state: {
    daemons: [],
    commandSettingsVisible: false
  },
  mutations: {
    setDaemons (state, daemons: Daemon[]) {
      state.daemons = daemons
    },
    toggleCommandSettingsVisible (state) {
      state.commandSettingsVisible = !state.commandSettingsVisible
    }
  },
  actions: {},
  modules: {}
})
