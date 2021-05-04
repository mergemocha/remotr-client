import { createStore } from 'vuex'
import router from '../router'
import Daemon from '../types/Daemon'

export interface State {
  token: string | null,
  daemons: Daemon[],
  commandSettingsVisible: boolean
}

export default createStore<State>({
  state: {
    token: null,
    daemons: [],
    commandSettingsVisible: false
  },
  mutations: {
    login (state, token: string) {
      state.token = token
    },
    logout (state) {
      state.token = null
      router.push('login') // Navigate to login
    },
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
