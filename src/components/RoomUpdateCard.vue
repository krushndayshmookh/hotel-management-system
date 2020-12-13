<template>
  <q-card style="min-width: 500px">
    <q-card-section class="row items-center">
      <div class="text-h6 items-center">Room {{ roomState.label }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-list separator>
        <q-item>
          <q-item-section>Available</q-item-section>
          <q-item-section side>
            <q-toggle
              v-model="roomState.available"
              :disable="roomState.occupied"
            />
          </q-item-section>
        </q-item>

        <q-expansion-item
          v-model="expanded"
          label="Guest"
          :disable="!roomState.available"
        >
          <q-card>
            <q-card-section>
              <div class="q-gutter-sm">
                <q-input
                  outlined
                  label="Guest name"
                  v-model="guest.name"
                  ref="guestName"
                  :rules="[v => !!v]"
                  :disable="roomState.occupied"
                  lazy-rules
                />

                <q-input
                  outlined
                  label="Check In"
                  v-model="booking.checkIn"
                  ref="guestCheckIn"
                  :rules="[v => !!v]"
                  :disable="roomState.occupied"
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer q-mr-md">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="booking.checkIn"
                          mask="DD MMM YYYY HH:mm"
                          today-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>

                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="booking.checkIn"
                          mask="DD MMM YYYY HH:mm"
                          format24h
                          now-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input
                  outlined
                  label="Check Out"
                  v-model="booking.checkOut"
                  :disable="!roomState.occupied"
                  ref="guestCheckOut"
                  :rules="[v => !!v]"
                  lazy-rules
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer q-mr-md">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="booking.checkOut"
                          mask="DD MMM YYYY HH:mm"
                          today-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>

                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="booking.checkOut"
                          mask="DD MMM YYYY HH:mm"
                          format24h
                          now-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input
                  outlined
                  label="Rent Per Day"
                  v-model="booking.rent"
                  ref="guestRent"
                  prefix="Rs"
                  :rules="[v => !!v]"
                  :disable="roomState.occupied"
                  lazy-rules
                />
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col">
                  <!-- <q-btn flat :disable="roomState.occupied" label="Update" /> -->
                </div>
                <div class="col text-right">
                  <q-btn
                    color="primary"
                    :flat="!roomState.occupied"
                    :disable="!roomState.occupied"
                    @click="checkOut"
                    label="Check Out"
                  />
                  <q-btn
                    color="primary"
                    :flat="roomState.occupied"
                    :disable="roomState.occupied"
                    @click="checkIn"
                    label="Check In"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import moment from "moment-timezone";
import _ from "lodash";

export default {
  name: "RoomUpdateCard",

  props: {
    room: {
      type: Object
    }
  },

  watch: {
    roomState: {
      deep: true,
      handler(newRoomState) {
        this.debouncedSaveRoom(newRoomState);
      }
    }
  },

  data() {
    return {
      expandedValue: true,

      roomState: {
        _id: null,
        label: null,
        occupied: false,
        available: false,
        floor: null
      },

      guest: {
        _id: null,
        name: null
      },

      booking: {
        _id: null,
        checkIn: new moment().tz("Asia/Kolkata").format("DD MMM YYYY HH:mm"),
        rentPerDay: 500
      }
    };
  },

  computed: {
    expanded: {
      get() {
        return this.expandedValue && this.roomState.available;
      },
      set(val) {
        this.expandedValue = val;
      }
    }
  },

  created() {
    this.debouncedSaveRoom = _.debounce(this.saveRoom, 500);

    this.fetchRoom();
  },

  destroyed() {
    this.$emit("done");
  },

  methods: {
    checkIn() {
      let { guestName, guestCheckIn, guestRent } = this.$refs;
      guestName.validate();
      guestCheckIn.validate();
      guestRent.validate();

      let hasErrors =
        guestName.hasErrors || guestCheckIn.hasErrors || guestRent.hasErrors;

      if (!hasErrors) {
        this.saveGuest(this.guest);
        this.roomState.occupied = true;
      }
    },

    checkOut() {
      let { guestCheckOut } = this.$refs;

      guestCheckOut.validate();

      let hasErrors = guestCheckOut.hasErrors;

      if (!hasErrors) {
        this.roomState.occupied = false;
        // this.guest = null;
        this.deleteGuest(this.guest);
      }
    },

    async fetchRoom() {
      this.roomState = await this.$db.Room.asyncFindOne({ _id: this.room._id });

      if (this.roomState.occupied) {
        this.booking = await this.$db.Booking.asyncFindOne({
          room: this.room._id,
          checkOut: {
            $exists: false
          }
        });

        this.booking.checkIn = moment(this.booking.checkIn).format(
          "DD MMM YYYY HH:mm"
        );

        this.guest = await this.$db.Guest.asyncFindOne({
          _id: this.booking.guest
        });
      }
    },

    saveRoom(roomState) {
      this.$db.Room.update(
        { _id: roomState._id },
        roomState,
        { returnUpdatedDocs: true, upsert: true },
        function(err, numAffected, docs) {
          if (err) console.error(err);
          console.log(docs);
        }
      );
    },

    async saveGuest(guest) {
      delete guest._id;

      this.$db.Guest.insert(guest, function(err, doc) {
        if (err) console.error(err);
        console.log(doc);
      });
    },

    async deleteGuest(guest) {
      this.$db.Guest.remove({ _id: guest._id }, {}, function(err, numRemoved) {
        if (err) console.error(err);
        console.log(numRemoved);
      });
    }
  }
};
</script>
