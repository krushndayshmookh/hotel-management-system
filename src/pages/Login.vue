<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width:350px;">
      <q-card-section>
        <div>
          <p class="text-h5 text-weight-bold q-mt-sm text-primary">
            Welcome To HMS
          </p>
          <p class="text-body1">Please login to continue</p>
        </div>
        <form @submit.prevent.stop="login" class="q-gutter-sm">
          <q-input
            color="primary"
            v-model="user.username"
            label="Username"
            type="text"
            ref="input_username"
            :rules="[val => !!val || 'Username is required']"
            lazy-rules
          />
          <q-input
            color="primary"
            v-model="user.password"
            label="Password"
            type="password"
            ref="input_password"
            :rules="[val => !!val || 'Password is required']"
            lazy-rules
          />

          <div>
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
            />
          </div>
        </form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { fetchHotel } from 'src/store/general/actions';
export default {
  name: "PageLogin",
  data() {
    return {
      user: {
        username: "",
        password: ""
      }
    };
  },

  methods: {
    async login() {
      this.$axios
        .post("/auth/login", this.user)
        .then(async response => {
          if (response.data.status) {
            this.$store.dispatch("auth/login", response.data);

            const { type, hotel } = response.data.user;
            if (type == "admin") this.$router.push("/hotels");
            if (type == "manager" || type == "viewer") {
              this.$store.dispatch('general/fetchHotel', hotel);
              this.$router.push("/overview");
            }
          } else {
            // wrong password
            this.$q.notify({
              type: "negative",
              message: "Invalid credentials."
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.$q.notify({
            type: "negative",
            message: "Error occured."
          });
        });
    },

    
  }
};
</script>
