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
          label="Occupancy"
          :disable="!roomState.available"
        >
          <q-card>
            <q-card-section>
              <div class="q-gutter-sm">
                <q-input
                  outlined
                  label="Occupant name"
                  v-model="occupant.name"
                  ref="occupantName"
                  :rules="[v => !!v]"
                  :disable="roomState.occupied"
                  lazy-rules
                />

                <q-input
                  outlined
                  label="Check In"
                  v-model="occupant.checkIn"
                  ref="occupantCheckIn"
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
                          v-model="occupant.checkIn"
                          mask="YYYY-MM-DD HH:mm"
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
                          v-model="occupant.checkIn"
                          mask="YYYY-MM-DD HH:mm"
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
                  v-model="occupant.checkOut"
                  :disable="!roomState.occupied"
                  ref="occupantCheckOut"
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
                          v-model="occupant.checkOut"
                          mask="YYYY-MM-DD HH:mm"
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
                          v-model="occupant.checkOut"
                          mask="YYYY-MM-DD HH:mm"
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
                  v-model="occupant.rentPerDay"
                  ref="occupantRent"
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
                  <q-btn flat :disable="!roomState.occupied" label="Update" />
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

      roomState: null,
      occupant: null
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

    const { occupant, ...roomState } = this.room;

    this.roomState = roomState;

    this.occupant = occupant
      ? occupant
      : {
          _id: null,
          name: null,
          checkIn: new moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm"),
          rentPerDay: 500
        };
  },

  destroyed() {
    this.$emit("done");
  },

  methods: {
    checkIn() {
      let { occupantName, occupantCheckIn, occupantRent } = this.$refs;
      occupantName.validate();
      occupantCheckIn.validate();
      occupantRent.validate();

      let hasErrors =
        occupantName.hasErrors ||
        occupantCheckIn.hasErrors ||
        occupantRent.hasErrors;

      if (!hasErrors) {
        this.saveOccupant(this.occupant);
        this.roomState.occupied = true;
      }
    },

    checkOut() {
      let { occupantCheckOut } = this.$refs;

      occupantCheckOut.validate();

      let hasErrors = occupantCheckOut.hasErrors;

      if (!hasErrors) {
        this.roomState.occupied = false;
        // this.occupant = null;
        this.deleteOccupant(this.occupant);
      }
    },

    saveRoom(roomState) {
      this.$db.Room.update(
        { _id: this.roomState._id },
        { returnUpdatedDocs: true, upsert: true },
        this.roomState,
        function(err, numAffected, docs) {
          if (err) console.error(err);
          console.log(docs);
        }
      );
    },

    async saveOccupant(occupant) {
      delete occupant._id;

      this.$db.Occupant.insert(occupant, function(err, doc) {
        if (err) console.error(err);
        console.log(doc);
      });
    },

    async deleteOccupant(occupant) {
      this.$db.Occupant.remove({ _id: occupant._id }, {}, function(
        err,
        numRemoved
      ) {
        if (err) console.error(err);
        console.log(numRemoved);
      });
    }
  }
};
</script>
