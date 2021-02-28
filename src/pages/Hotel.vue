<template>
  <q-page padding>
    <div class="q-gutter-md" v-if="hotel">
      <q-btn
        flat
        icon="keyboard_arrow_left"
        label="back"
        @click="$router.back()"
      />

      <div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-card>
              <q-img v-if="hotel.banner" :src="hotel.banner" />

              <q-card-section>
                <div class="text-h6">{{ hotel.name }}</div>
                <div class="text-subtitle1">Owner: {{ hotel.owner }}</div>
                <div class="text-subtitle1">
                  Number of Rooms: {{ hotel.floors[0].rooms.length }}
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-btn
                      class="full-width"
                      color="green"
                      icon="edit"
                      label="Edit Hotel"
                      @click="editHotel"
                    />
                  </div>
                  <div class="col">
                    <q-btn
                      flat
                      class="full-width"
                      color="negative"
                      icon="delete"
                      label="Delete Hotel"
                      @click="deleteHotel"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-8">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  Users
                  <q-btn
                    class="float-right"
                    color="primary"
                    @click="displayNewUserForm"
                  >
                    Add User
                  </q-btn>
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
                        <q-item-label caption>
                          {{ manager.username }}
                        </q-item-label>
                        <!-- <q-item-label caption>
                          {{ manager.password }}
                        </q-item-label> -->
                      </q-item-section>

                      <q-item-section side>
                        <div>
                          <q-btn
                            flat
                            round
                            icon="edit"
                            color="green"
                            @click="editUser(manager)"
                          />
                          <q-btn
                            flat
                            round
                            icon="delete"
                            color="negative"
                            @click="deleteUser(manager)"
                          />
                        </div>
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
                        <q-item-label caption>
                          {{ viewer.username }}
                        </q-item-label>
                        <!-- <q-item-label caption>
                          {{ viewer.password }}
                        </q-item-label> -->
                      </q-item-section>

                      <q-item-section side>
                        <div>
                          <q-btn
                            flat
                            round
                            icon="edit"
                            color="green"
                            @click="editUser(viewer)"
                          />
                          <q-btn
                            flat
                            round
                            icon="delete"
                            color="negative"
                            @click="deleteUser(viewer)"
                          />
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <!-- <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  Rooms
                  <q-btn
                    class="float-right q-ml-sm"
                    color="primary"
                    @click="displayNewRoomForm"
                  >
                    Add Room </q-btn
                  ><q-btn
                    class="float-right"
                    color="primary"
                    @click="displayNewFloorForm"
                  >
                    Add Floor
                  </q-btn>
                </div>
              </q-card-section>
              <q-separator></q-separator>
              <q-card-section horizontal class="q-pa-none">
                <q-card-section class="q-pa-none col">
                  <q-list>
                    <q-item-label header>Floors</q-item-label>
                    <q-item v-for="floor in hotel.floors" :key="floor._id">
                      <q-item-section>
                        <q-item-label>{{ floor.label }}</q-item-label>
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
                    <q-item-label header
                      >Number of Rooms: {{ hotel.floors[0].rooms.length }}
                    </q-item-label>
                    <div class="text-h6"></div>
                  </q-list>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div> -->
        </div>
      </div>
    </div>

    <q-dialog v-model="showAddUserForm" :maximized="$q.screen.lt.md">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <div class="text-h6 items-center">User Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="column q-col-gutter-md">
          <q-input
            outlined
            label="Name"
            v-model="selectedUser.name"
            ref="userName"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-select
            outlined
            label="Type"
            v-model="selectedUser.type"
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
            label="Username"
            v-model="selectedUser.username"
            ref="userUsername"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="Password"
            v-model="selectedUser.password"
            ref="userPassword"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />

          <q-input
            outlined
            label="PIN"
            v-model="selectedUser.pin"
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

    <q-dialog v-model="editHotelDialog" :maximized="$q.screen.lt.md">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <div class="text-h6 items-center">Hotel Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="column q-col-gutter-md">
          <q-input
            outlined
            label="Name"
            v-model="hotel.name"
            ref="hotelName"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />
          <q-input
            outlined
            label="Owner"
            v-model="hotel.owner"
            ref="hotelOwner"
            :rules="[v => !!v]"
            lazy-rules
            hide-bottom-space
          />
          <q-input
            hide-bottom-space
            color="primary"
            outlined
            label="Banner"
            v-model="hotel.banner"
            ref="hotelBanner"
          >
            <template v-slot:append>
              <q-spinner v-if="fileProgress" />
              <q-btn
                round
                dense
                color="primary"
                v-else
                icon="file_upload"
                @click="triggerFileInput"
              />
            </template>
          </q-input>

          <input
            class="hidden"
            @input="
              e =>
                (imageFile = e.target.files.length ? e.target.files[0] : null)
            "
            type="file"
            id="image-file"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="primary" @click="saveHotel">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="showAddFloorForm">
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
    </q-dialog> -->

    <!-- <q-dialog v-model="showAddRoomForm">
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
    </q-dialog> -->
  </q-page>
</template>

<script>
function _triggerFileInput() {
  document.getElementById("image-file").click();
}

export default {
  props: ["hotelid"],

  data() {
    return {
      showAddUserForm: false,

      newUser: {
        name: null,
        type: null,
        username: null,
        password: null,
        pin: null
      },

      selectedUser: null,

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

      floors: [],

      editHotelDialog: false,
      imageFile: null,
      fileProgress: false
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

  watch: {
    imageFile(newValue) {
      if (newValue) this.uploadFile();
    }
  },

  created() {
    this.fetchHotel();

    this.selectedUser = this.newUser;
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

    uploadFile() {
      this.fileProgress = true;

      let formdata = new FormData();
      formdata.append("image", this.imageFile);

      this.$axios
        .post(process.env.API + "/uploads", formdata, {
          headers: {
            "content-type": "multipart/form-data"
          }
        })
        .then(response => {
          this.hotel.banner = response.data.imageURL;
          this.$forceUpdate();
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.fileProgress = false;
        });
    },

    triggerFileInput() {
      _triggerFileInput();
    },

    displayNewUserForm() {
      this.showAddUserForm = true;
    },

    saveUser() {
      let {
        userName,
        userUsername,
        userType,
        userPassword,
        userPin
      } = this.$refs;
      userName.validate();
      userUsername.validate();
      userType.validate();
      userPassword.validate();
      userPin.validate();

      let hasError =
        userName.hasError ||
        userUsername.hasError ||
        userType.hasError ||
        userPassword.hasError ||
        userPin.hasError;

      if (!hasError) {
        let isEdit = !!this.selectedUser._id;

        this.$q.loading.show();
        this.$axios({
          url: isEdit
            ? "/users/" + this.selectedUser._id
            : "/hotels/" + this.hotelid + "/users",
          method: isEdit ? "PUT" : "POST",
          data: this.selectedUser
        })
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
      this.selectedUser = { ...this.newUser };
      this.showAddFloorForm = true;
    },

    editHotel() {
      this.editHotelDialog = true;
    },

    deleteHotel() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Would you like to delete this hotel?",
          cancel: true,
          persistent: true,
          ok: {
            label: "delete",
            color: "negative",
            flat: true
          }
        })
        .onOk(() => {
          this.$q.loading.show();
          this.$axios
            .delete("/hotels/" + this.hotelid)
            .then(response => {
              this.$q.notify({
                message: "Deleted."
              });
              this.$router.back();
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
        });
    },

    saveHotel() {
      let { hotelName, hotelOwner, hotelImage } = this.$refs;
      hotelName.validate();
      hotelOwner.validate();

      let hasError = hotelName.hasError || hotelOwner.hasError;

      if (!hasError) {
        this.$q.loading.show();
        this.$axios
          .put("/hotels/" + this.hotelid, this.hotel)
          .then(response => {
            this.editHotelDialog = false;
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

    editUser(user) {
      this.selectedUser = { ...user };
      this.showAddUserForm = true;
    },

    deleteUser(user) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Would you like to delete this user?",
          cancel: true,
          persistent: true,
          ok: {
            label: "delete",
            color: "negative",
            flat: true
          }
        })
        .onOk(() => {
          this.$q.loading.show();
          this.$axios
            .delete("/users/" + user._id)
            .then(response => {
              this.$q.notify({
                message: "Deleted."
              });
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
        });
    },

    // saveFloor() {
    //   let { floorLabel, floorOrder } = this.$refs;
    //   floorLabel.validate();
    //   floorOrder.validate();

    //   let hasError = floorLabel.hasError || floorOrder.hasError;

    //   if (!hasError) {
    //     this.$q.loading.show();
    //     this.$axios
    //       .post("/hotels/" + this.hotelid + "/floors", this.newFloor)
    //       .then(response => {
    //         this.showAddFloorForm = false;
    //         this.fetchFloors();
    //       })
    //       .catch(err => {
    //         console.error(err);
    //         this.$q.notify({
    //           type: "negative",
    //           message: "Error occured."
    //         });
    //       })
    //       .finally(() => {
    //         this.$q.loading.hide();
    //       });
    //   }
    // },

    displayNewRoomForm() {
      this.showAddRoomForm = true;
    }

    // saveRoom() {
    //   let { roomLabel, roomFloor } = this.$refs;
    //   roomLabel.validate();
    //   roomFloor.validate();

    //   let hasError = roomLabel.hasError || roomFloor.hasError;

    //   if (!hasError) {
    //     this.$q.loading.show();
    //     this.$axios
    //       .post("/hotels/" + this.hotelid + "/rooms", this.newRoom)
    //       .then(response => {
    //         this.showAddRoomForm = false;
    //         this.fetchRooms();
    //       })
    //       .catch(err => {
    //         console.error(err);
    //         this.$q.notify({
    //           type: "negative",
    //           message: "Error occured."
    //         });
    //       })
    //       .finally(() => {
    //         this.$q.loading.hide();
    //       });
    //   }
    // }
  }
};
</script>
