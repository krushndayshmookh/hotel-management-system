<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          HMS
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
            v-if="!!token && user.type == 'manager'"
          />

          <q-btn
            flat
            round
            dense
            icon="power_settings_new"
            v-if="!!token"
            @click="logout"
          />
        </div>
      </q-toolbar>

      <q-tabs align="left" v-if="!!token && tabs.length">
        <q-route-tab
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :label="tab.label"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const TABS = {
  admin: [
    {
      label: "Hotels",
      to: "/hotels"
    }
  ],

  manager: [
    {
      label: "Overview",
      to: "/overview"
    },
    {
      label: "Statistics",
      to: "/statistics"
    }
  ],

  viewer: [
    {
      label: "Overview",
      to: "/overview"
    },
    {
      label: "Statistics",
      to: "/statistics"
    }
  ]
};

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
    },

    tabs() {
      return TABS[this.user.type] || [];
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
          // this.$router.push("/overview");
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
