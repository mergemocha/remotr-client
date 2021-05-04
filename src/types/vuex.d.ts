import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { State as GlobalState } from '../store'

declare module '@vue/runtime-core' {
  type State = GlobalState

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
