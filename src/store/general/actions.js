import { Dialog, Notify } from "quasar";

const PINCODE = "1234";
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
    if (data == PINCODE) {
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
