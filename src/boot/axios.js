import Vue from "vue";
import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? process.env.API
    : "https://bellboy.rootkings.dev/api";

Vue.prototype.$axios = axios;
