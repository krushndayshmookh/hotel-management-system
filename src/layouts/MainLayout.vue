<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Bellboy
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          :icon="locked ? 'lock' : 'lock_open'"
          @click="toggleLock"
        />
      </q-toolbar>
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
      locked: false
    };
  },

  methods: {
    toggleLock() {
      this.locked = !this.locked;
    }
  }
};
</script>
