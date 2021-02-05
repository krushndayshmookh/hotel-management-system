import { Dialog, Notify } from "quasar";
import axios from "axios";

const TIMEOUT = 10 * 60 * 1000; /* m * s * ms */

export function setLock(context, payload) {
  if (payload) {
    context.commit("setLock", true);
  } else {
    verifyCode(context);
  }
}

function verifyCode(context) {
  Dialog.create({
    title: "Authorization required",
    message: "Please enter your PIN",
    prompt: {
      model: "",
      type: "text"
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    if (data == context.rootState.auth.user.pin) {
      context.commit("setLock", false);

      setTimeout(() => {
        context.commit("setLock", true);
      }, TIMEOUT);
    } else {
      Notify.create({
        type: "negative",
        message: `PIN does not match.`
      });
    }
  });
}

export function fetchHotel({ commit }, hotelid) {
  axios.get("/hotels/" + hotelid).then(async response => {
    commit("setHotel", response.data);
  });
}

export function setOccupied({ commit }, payload) {
  commit("setOccupied", payload);
}

export function setRoom({ commit }, payload) {
  commit("setRoom", payload);
}
