<template>
  <q-card style="min-width: 500px">
    <q-card-section class="row items-center">
      <div class="text-h6">Bill</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="text-body1">
        Duration:
        <span class="float-right text-weight-bold">
          {{ duration }} day{{ duration == 1 ? "" : "s" }}
        </span>
      </div>
      <div class="text-h5">
        Amount to collect:
        <span class="float-right text-weight-bold">Rs {{ billAmount }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import moment from "moment-timezone";

export default {
  name: "BillCard",

  props: ["checkIn", "checkOut", "rent"],

  computed: {
    duration() {
      let start = new moment(this.checkIn).tz("Asia/Kolkata");
      if (start.hours() < 12) {
        start.subtract(1, "days");
        start.hours(12).minutes(0);
      }

      let end = new moment(this.checkOut).tz("Asia/Kolkata");
      if (end.hours() < 12) {
        end.subtract(1, "days");
        end.hours(12).minutes(0);
      }

      return Math.ceil(moment.duration(end.diff(start)).asDays());
    },

    billAmount() {
      return this.rent * this.duration;
    }
  }
};
</script>
