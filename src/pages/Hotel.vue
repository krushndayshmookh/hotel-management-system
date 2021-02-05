<template>
  <q-page padding>
    <div class="q-gutter-md" v-if="hotel">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ hotel.name }}</div>
          <div class="text-subtitle1">Owner: {{ hotel.owner }}</div>
        </q-card-section>
      </q-card>

      <div>
        <div class="row q-col-gutter-md">
          <div class="col-8">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  Users
                  <q-btn
                    class="float-right"
                    color="primary"
                    @click="displayNewUserForm"
                    >Add User</q-btn
                  >
                </div>
              </q-card-section>
              <q-separator></q-separator>
              <q-card-section horizontal class="q-pa-none">
                <q-card-section class="q-pa-none col">
                  <q-list>
                    <q-item-label header>Managers</q-item-label>
                    <q-item
                      v-for="manager in hotel.managers"
                      :key="manager._id"
                    >
                      <q-item-section>
                        <q-item-label>{{ manager.name }}</q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-btn flat round icon="edit" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-separator vertical></q-separator>
                <q-card-section class="q-pa-none col">
                  <q-list>
                    <q-item-label header>Viewers</q-item-label>
                    <q-item v-for="viewer in hotel.viewers" :key="viewer._id">
                      <q-item-section>
                        <q-item-label>{{ viewer.name }}</q-item-label>
                      </q-item-section>

                      <!-- <q-item-section side>
                  <q-btn flat round icon="edit" />
                </q-item-section> -->
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  Rooms &amp; Floors
                  <!-- <q-btn
              class="float-right q-ml-sm"
              color="primary"
              @click="displayNewRoomForm"
            >
              Add Room
            </q-btn> -->
                  <!-- <q-btn
              class="float-right"
              color="primary"
              @click="displayNewFloorForm"
            >
              Add Floor
            </q-btn> -->
                </div>
              </q-card-section>
              <q-separator></q-separator>
              <q-card-section horizontal class="q-pa-none">
                <!-- <q-card-section class="q-pa-none col">
            <q-list>
              <q-item-label header>Floors</q-item-label>
              <q-item v-for="floor in hotel.floors" :key="floor._id">
                <q-item-section>
                  <q-item-label>{{ floor.label }}</q-item-label>
                </q-item-section>

                !-- <q-item-section side>
                  <q-btn flat round icon="edit" />
                </q-item-section> --
              </q-item>
            </q-list>
          </q-card-section> -->
                <q-separator vertical></q-separator>
                <q-card-section class="q-pa-none col">
                  <q-list>
                    <q-item-label header>Rooms</q-item-label>
                    <q-item v-for="room in rooms" :key="room._id">
                      <q-item-section>
                        <q-item-label>{{ room.label }}</q-item-label>
                      </q-item-section>

                      <!-- <q-item-section side>
                  <q-btn flat round icon="edit" />
                </q-item-section> -->
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showAddUserForm">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6 items-center">Add User</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="column q-col-gutter-md">
          <q-input
            outlined
            label="Name"
            v-model="newUser.name"
            ref="userName"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-select
            outlined
            label="Type"
            v-model="newUser.type"
            ref="userType"
            :options="[
              { label: 'Manager', value: 'manager' },
              { label: 'Viewer', value: 'viewer' }
            ]"
            map-options
            emit-value
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="Phone"
            v-model="newUser.phone"
            ref="userPhone"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="Password"
            v-model="newUser.password"
            ref="userPassword"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="PIN"
            v-model="newUser.pin"
            ref="userPin"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="saveUser">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddFloorForm">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6 items-center">Add Floor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="column q-col-gutter-md">
          <q-input
            outlined
            label="Label"
            v-model="newFloor.label"
            ref="floorLabel"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="Order"
            v-model="newFloor.order"
            ref="floorOrder"
            type="number"
            :rules="[v => v >= 0]"
            lazy-rules
            hide-bottom-space
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="saveFloor">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddRoomForm">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6 items-center">Add Room</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="column q-col-gutter-md">
          <q-input
            outlined
            label="Label"
            v-model="newRoom.label"
            ref="roomLabel"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-select
            outlined
            label="Floor"
            v-model="newRoom.floor"
            ref="roomFloor"
            :options="floorOptions"
            map-options
            emit-value
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="saveRoom">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  props: ["hotelid"],

  data() {
    return {
      showAddUserForm: false,
      newUser: {
        name: null,
        type: null,
        phone: null,
        password: null,
        pin: null
      },

      showAddFloorForm: false,
      newFloor: {
        label: null,
        order: 0
      },

      showAddRoomForm: false,
      newRoom: {
        label: null,
        floor: null
      },

      hotel: null,

      floors: []
    };
  },

  computed: {
    floorOptions() {
      return this.hotel.floors.map(f => ({ value: f._id, label: f.label }));
    },

    rooms() {
      return this.hotel.floors.reduce((r, f) => r.concat(f.rooms), []);
    }
  },

  created() {
    this.fetchHotel();
    // this.fetchFloors();
    // this.fetchRooms();
  },

  methods: {
    fetchHotel() {
      this.$q.loading.show();
      this.$axios
        .get("/hotels/" + this.hotelid)
        .then(response => {
          this.hotel = response.data;
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

    displayNewUserForm() {
      this.showAddUserForm = true;
    },

    saveUser() {
      let { userName, userPhone, userType, userPassword, userPin } = this.$refs;
      userName.validate();
      userPhone.validate();
      userType.validate();
      userPassword.validate();
      userPin.validate();

      let hasError =
        userName.hasError ||
        userPhone.hasError ||
        userType.hasError ||
        userPassword.hasError ||
        userPin.hasError;

      if (!hasError) {
        this.$q.loading.show();
        this.$axios
          .post("/hotels/" + this.hotelid + "/users", this.newUser)
          .then(response => {
            this.showAddUserForm = false;
            this.fetchHotel();
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
    },

    displayNewFloorForm() {
      this.showAddFloorForm = true;
    },

    saveFloor() {
      let { floorLabel, floorOrder } = this.$refs;
      floorLabel.validate();
      floorOrder.validate();

      let hasError = floorLabel.hasError || floorOrder.hasError;

      if (!hasError) {
        this.$q.loading.show();
        this.$axios
          .post("/hotels/" + this.hotelid + "/floors", this.newFloor)
          .then(response => {
            this.showAddFloorForm = false;
            this.fetchFloors();
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
    },

    displayNewRoomForm() {
      this.showAddRoomForm = true;
    },

    saveRoom() {
      let { roomLabel, roomFloor } = this.$refs;
      roomLabel.validate();
      roomFloor.validate();

      let hasError = roomLabel.hasError || roomFloor.hasError;

      if (!hasError) {
        this.$q.loading.show();
        this.$axios
          .post("/hotels/" + this.hotelid + "/rooms", this.newRoom)
          .then(response => {
            this.showAddRoomForm = false;
            this.fetchRooms();
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
