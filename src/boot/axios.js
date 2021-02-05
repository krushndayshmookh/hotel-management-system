import Vue from "vue";
import axios from "axios";

axios.defaults.baseURL = "https://root-hms-server.herokuapp.com/api";

Vue.prototype.$axios = axios;
