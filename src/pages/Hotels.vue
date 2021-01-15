<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-btn color="primary" @click="displayNewForm">Add Hotel</q-btn>
    </div>
    <div class="row q-col-gutter-md">
      <div
        class="col-4 col-sm-3 col-md-2"
        v-for="hotel in hotels"
        :key="hotel._id"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ hotel.name }}</div>
            <div class="text-caption">{{ hotel.owner }}</div>
          </q-card-section>
          <q-separator />

          <q-card-section class="row">
            <!-- <div class="col">
              <div class="text-h4">{{ hotel.rooms.length }}</div>
              <div class="text-body1">Rooms</div>
            </div> -->
            <div class="col">
              <div class="text-h4">{{ hotel.managers.length }}</div>
              <div class="text-body1">Managers</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn
              flat
              class="full-width"
              :to="'/hotels/' + hotel._id"
              label="View"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showAddForm">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6 items-center">Add Hotel</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="column q-col-gutter-md">
          <q-input
            outlined
            label="Hotel Name"
            v-model="newHotel.name"
            ref="hotelName"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="Hotel Owner"
            v-model="newHotel.owner"
            ref="hotelOwner"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="Number of Rooms"
            v-model="newHotel.rooms"
            ref="hotelRooms"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="saveHotel">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      showAddForm: false,
      newHotel: {
        name: null,
        owner: null,
        rooms: null
      },

      hotels: []
    };
  },

  created() {
    this.fetchHotels();
  },

  methods: {
    fetchHotels() {
      this.$q.loading.show();
      this.$axios
        .get("/hotels")
        .then(response => {
          this.hotels = response.data;
        })
        .catch(err => {
          console.error(err);
          this.$q.notify({
            type: "negative",
            message: "Error occured."
          });
        })
        .finally(() => {
          this.$q.loading.hide();
        });
    },

    displayNewForm() {
      this.showAddForm = true;
    },

    saveHotel() {
      let { hotelName, hotelOwner, hotelRooms } = this.$refs;
      hotelName.validate();
      hotelOwner.validate();
      hotelRooms.validate();

      let hasError =
        hotelName.hasError || hotelOwner.hasError || hotelRooms.hasError;

      if (!hasError) {
        this.$q.loading.show();
        this.$axios
          .post("/hotels", this.newHotel)
          .then(response => {
            this.showAddForm = false;
            this.$router.push("/hotels/" + response.data._id);
          })
          .catch(err => {
            console.error(err);
            this.$q.notify({
              type: "negative",
              message: "Error occured."
            });
          })
          .finally(() => {
            this.$q.loading.hide();
          });
      }
    }
  }
};
</script>
