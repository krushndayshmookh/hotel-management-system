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

      <q-tabs align="left">
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
      locked: false,
      connected: false
    };
  },

  methods: {
    toggleLock() {
      this.locked = !this.locked;
    },

    toggleConnected() {
      this.connected = !this.connected;
    },

    logout() {
      this.$router.push("/login");
    }
  }
};
</script>
