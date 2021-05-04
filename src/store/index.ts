import Daemon from '@/types/Daemon'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  token: string | null,
  daemons: Daemon[]
}

export const key: InjectionKey<Store<State>> = Symbol('State injection key')

export const store = createStore<State>({
  state: {
    token: null,
    daemons: []
  },
  mutations: {
    setToken (state, token: string) {
      state.token = token
    },
    setDaemons (state, daemons: Daemon[]) {
      state.daemons = daemons
    }
  },
  actions: {},
  modules: {}
})

export function useStore (): Store<State> {
  return baseUseStore(key)
}
