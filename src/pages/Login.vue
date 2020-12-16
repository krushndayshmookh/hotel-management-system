<template>
  <q-page padding class="flex flex-center">
    <q-card style="min-width:350px;">
      <q-card-section>
        <div>
          <p class="text-h5 text-weight-bold q-mt-sm text-primary">
            Welcome To Bellboy
          </p>
          <p class="text-body1">Please login to continue</p>
        </div>
        <form @submit.prevent.stop="login" class="q-gutter-sm">
          <q-input
            color="primary"
            v-model="user.phone"
            label="Phone"
            type="phone"
            ref="input_phone"
            :rules="[val => !!val || 'Phone is required']"
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
export default {
  name: "PageLogin",
  data() {
    return {
      user: {
        phone: "",
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

            const userType = response.data.user.type;
            if (userType == "admin") this.$router.push("/hotels");
            if (userType == "manager" || userType == "viewer") {
              await this.fetchHotelDetails(userType);
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

    async fetchHotelDetails(userType) {
      await this.$axios
        .get("/hotels/details?userType=" + userType)
        .then(async response => {
          await this.$db.resetWith(response.data);
        });
    }
  }
};
</script>
