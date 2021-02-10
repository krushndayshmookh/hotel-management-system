import fs from "fs-extra";
import electron from "electron";
import Vue from "vue";
import moment from "moment-timezone";

const $fs = {
  async writeFile(roomId, blob) {
    let now = new moment.tz("Asia/Kolkata");

    let directory =
      electron.remote.app.getPath("userData") +
      "/Root-HMS/images/aadhar/" +
      now.format("YYYY-MM-DD");

    let fileName = now.format("HH-mm-ss") + "_" + roomId + ".png";

    this.aadharFilePath = directory + "/" + fileName;

    let fileData = new Int8Array(await blob.arrayBuffer());

    fs.outputFileSync(this.aadharFilePath, fileData);
  }
};

Vue.prototype.$fs = $fs;
