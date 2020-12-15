import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.API

Vue.prototype.$axios = axios
