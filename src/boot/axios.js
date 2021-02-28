import Vue from "vue";
import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? process.env.API
    : "https://root-hms-server.herokuapp.com/api";

Vue.prototype.$axios = axios;
