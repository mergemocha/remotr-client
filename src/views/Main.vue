<template>
  <Toolbar class="p-shadow-3">
    <template #left>
      <h2>Remotr</h2>
    </template>
    <template #right>
      <Button label="Logout" icon="pi pi-lock" id="logout-button"/>
    </template>
  </Toolbar>
  <div class="daemon-view p-d-flex p-flex-wrap p-flex-column p-flex-md-row p-jc-center">
    <div v-if="!hasFetched">
      <DummyDaemon/>
    </div>
    <div v-else-if="hasFetched && daemons?.length == 0">
      <Message severity="success" :closable="false">
        <div class="empty">
          <h3>Hm. There doesn't seem to be anything here.</h3>
          <p>This isn't a problem. It just seems that there are no daemons registered at this time.</p>
          <p>Please register some daemons by downloading the Remotr daemon on a host device and installing it with <code>remotr-daemon install -h http://yourServerHost -s yourSecretHere</code>.</p>
          <p>When you do, they will show up here. Until then, we'll keep checking every 5 seconds for new daemons.</p>
        </div>
      </Message>
    </div>
    <div v-else v-for="daemon in daemons" :key="daemon.mac">
      <Daemon :ip="daemon.ip" :mac="daemon.mac" :user="daemon.user" :hostname="daemon.hostname" />
    </div>
  </div>
  <CommandSettingsModal/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Message from 'primevue/message'
import axios from 'axios'
import Daemon from '../components/Daemon.vue'
import DummyDaemon from '../components/DummyDaemon.vue'
import CommandSettingsModal from '../components/CommandSettingsModal.vue'
import { API_BASE_URL, determineRequestErrorReason, joinUrl, RequestFailureReason, ResponseCode } from '../system/apiUtils'
import store from '../store'
import logHTTPRequestError from '../utils/logHTTPRequestError'
import IDaemon from '../types/Daemon'

@Options({
  components: {
    Toolbar,
    Button,
    Message,
    Daemon,
    DummyDaemon,
    CommandSettingsModal
  }
})
export default class Main extends Vue {
  hasFetched = false
  daemons: IDaemon[] = []
  interval: number | undefined = undefined

  updateDaemons (daemons: IDaemon[]): void {
    store.commit('setDaemons', daemons)
    this.hasFetched = true
    this.daemons = daemons
  }

  async mounted (): Promise<void> {
    axios.defaults.withCredentials = true

    try {
      await axios.post(joinUrl(API_BASE_URL, 'user/auth'))
      const response = await axios.get(joinUrl(API_BASE_URL, 'daemons'))
      this.updateDaemons(response.data)

      // Poll for updates every 5 seconds
      this.interval = setInterval(async () => {
        try {
          const response = await axios.get(joinUrl(API_BASE_URL, 'daemons'))
          this.updateDaemons(response.data)
        } catch (err) {
          const { reason, code } = determineRequestErrorReason(err)

          if (reason === RequestFailureReason.RECEIVED_ERROR_RESPONSE && code === ResponseCode.UNAUTHORIZED) {
            this.$toast.add({ severity: 'error', summary: 'Session expired', detail: 'Your session has expired, and you will need to log in again. Logging out in 3 seconds...' })
            setTimeout(() => store.commit('logout'), 3000)
          } else {
            logHTTPRequestError(err)
            this.$toast.add({ severity: 'error', summary: 'Could not fetch daemons', detail: 'Could not fetch new daemon data. Details have been outputted into the log.' })
          }
        }
      }, 5000)
    } catch (err) {
      const { reason, code } = determineRequestErrorReason(err)

      if (reason === RequestFailureReason.RECEIVED_ERROR_RESPONSE && code === ResponseCode.UNAUTHORIZED) {
        // FIXME: Temp
        // router.push('/login')
        await axios.post(joinUrl(API_BASE_URL, 'user/login'), {
          username: 'root',
          password: 'password'
        })
        console.log('HACK: Session token had expired, reload and it will work now')
      } else {
        logHTTPRequestError(err)
      }
    }
  }

  unmounted (): void {
    // Ensure we don't keep updating when we unmount
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="scss">
h2 {
  margin: 0;
}

.daemon-view {
  margin: 1rem;

  .empty {
    margin: 1rem;
    max-width: 50rem;
  }
}
</style>
