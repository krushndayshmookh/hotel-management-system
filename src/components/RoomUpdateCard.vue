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
                  ref="bookingCheckIn"
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
                  ref="bookingCheckOut"
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
                  ref="bookingRent"
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

const initialStates = {
  room: {
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
        if (this.mountedWasRun) this.debouncedSaveRoom(newRoomState);
      }
    }
  },

  data() {
    return {
      expandedValue: true,
      mountedWasRun: false,

      roomState: { ...initialStates.room },
      guest: { ...initialStates.guest },
      booking: { ...initialStates.booking }
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

  mounted() {
    setTimeout(() => (this.mountedWasRun = true), 0);
  },

  destroyed() {
    this.$emit("done");
  },

  methods: {
    async checkIn() {
      let { guestName, bookingCheckIn, bookingRent } = this.$refs;
      guestName.validate();
      bookingCheckIn.validate();
      bookingRent.validate();

      let hasError =
        guestName.hasError || bookingCheckIn.hasError || bookingRent.hasError;

      if (!hasError) {
        this.$q.loading.show();
        let guest =
          (await this.$db.Guest.asyncFindOne({ name: this.guest.name })) ||
          (await this.$db.Guest.asyncInsert({ name: this.guest.name }));

        await this.$db.Booking.asyncInsert({
          room: this.room._id,
          guest: guest._id,
          checkIn: moment(this.booking.checkIn).valueOf(),
          rent: this.booking.rent
        });

        this.roomState.occupied = true;

        this.$q.notify({
          type: "positive",
          message: "Checked in."
        });
        this.$q.loading.hide();
      }
    },

    async checkOut() {
      let {
        bookingCheckOut,
        guestName,
        bookingCheckIn,
        bookingRent
      } = this.$refs;

      bookingCheckOut.validate();

      let hasError = bookingCheckOut.hasError;

      if (!hasError) {
        // this.$q.loading.show();
        this.$emit("bill", this.booking);

        await this.$db.Booking.asyncUpdate(
          { _id: this.booking._id },
          {
            $set: {
              checkOut: this.booking.checkOut
            }
          }
        );

        this.guest = initialStates.guest;
        this.booking = { ...initialStates.booking };

        bookingCheckOut.resetValidation();
        guestName.resetValidation();
        bookingCheckIn.resetValidation();
        bookingRent.resetValidation();

        this.roomState.occupied = false;

        this.$q.notify({
          type: "positive",
          message: "Checked out."
        });
        // this.$q.loading.hide();
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

        this.booking.checkIn = moment(this.booking.checkIn)
          .tz("Asia/Kolkata")
          .format("DD MMM YYYY HH:mm");

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
        }
      );
    }
  }
};
</script>
