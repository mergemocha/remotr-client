import { Store } from 'vuex'
import { GlobalState } from '../store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<GlobalState>
  }
}
