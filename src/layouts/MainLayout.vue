<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Bellboy
        </q-toolbar-title>

        <div class="q-gutter-md">
          <q-btn
            flat
            round
            dense
            :icon="connected ? 'link' : 'link_off'"
            @click="toggleConnected"
          />

          <q-btn
            flat
            round
            dense
            :icon="locked ? 'lock' : 'lock_open'"
            @click="toggleLock"
          />

          <q-btn flat round dense icon="power_settings_new" @click="logout" />
        </div>
      </q-toolbar>

      <q-tabs align="left" v-if="!!token">
        <q-route-tab to="/overview" label="Overview" />
        <q-route-tab to="/statistics" label="Statistics" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",

  components: {},

  data() {
    return {
      // locked: false,
      // connected: false
    };
  },

  computed: {
    locked: {
      get() {
        return this.$store.getters["general/locked"];
      },
      set(value) {
        return this.$store.dispatch("general/setLock", value);
      }
    },

    connected() {
      return navigator.onLine;
    },

    token() {
      return this.$store.getters["auth/token"];
    },

    user() {
      return this.$store.getters["auth/user"];
    }
  },

  async created() {
    await this.checkLogin();
  },

  methods: {
    toggleLock() {
      this.locked = !this.locked;
    },

    toggleConnected() {
      this.connected = !this.connected;
    },

    async checkLogin() {
      if (!this.token) {
        this.logout();
      }

      if (this.connected)
        try {
          this.$store.dispatch("auth/setHeaders");
          await this.$axios.get("/auth/login/status");
        } catch (error) {
          // console.error(error);
          this.logout();
        }
    },

    logout() {
      this.$store.dispatch("auth/logout");
      if (!this.$route.path.includes("/login")) this.$router.replace("/login");
    }
  }
};
</script>
