<template>
  <q-card style="min-width: 500px">
    <q-card-section class="row items-center">
      <div class="text-h6 items-center">Room {{ room.label }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-list separator>
        <q-item>
          <q-item-section>Available</q-item-section>
          <q-item-section side>
            <q-toggle v-model="room.available" :disable="room.occupied" />
          </q-item-section>
        </q-item>

        <q-expansion-item
          v-model="expanded"
          label="Occupancy"
          :disable="!room.available"
        >
          <q-card>
            <q-card-section>
              <div class="q-gutter-sm">
                <q-input
                  outlined
                  label="Occupant name"
                  v-model="occupant.name"
                />

                <q-input outlined label="Check In" v-model="occupant.checkIn">
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
                  :disable="!room.occupied"
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
                  prefix="Rs"
                />
              </div>
            </q-card-section>
            <q-card-section>
              <div class="row">
                <div class="col">
                  <q-btn flat :disable="!room.occupied" label="Update" />
                </div>
                <div class="col text-right">
                  <q-btn
                    color="primary"
                    :flat="!room.occupied"
                    :disable="!room.occupied"
                    @click="checkOut"
                    label="Check Out"
                  />
                  <q-btn
                    color="primary"
                    :flat="room.occupied"
                    :disable="room.occupied"
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

export default {
  name: "RoomUpdateCard",

  props: {
    room: {
      type: Object
    }
  },

  data() {
    return {
      expandedValue: true,

      occupant: {
        _id: "krushn",
        name: "Krushn",
        checkIn: new moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm"),
        rentPerDay: 500
      }
    };
  },

  computed: {
    expanded: {
      get() {
        return this.expandedValue && this.room.available;
      },
      set(val) {
        this.expandedValue = val;
      }
    }
  },

  methods: {
    checkIn() {
      console.log("check in");
      console.log("room", { ...this.room });
      console.log("occupant", { ...this.occupant });
    },

    checkOut() {
      console.log("check out");
      console.log("room", { ...this.room });
      console.log("occupant", { ...this.occupant });
    }
  }
};
</script>
