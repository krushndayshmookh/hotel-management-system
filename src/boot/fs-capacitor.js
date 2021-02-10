import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";
import Vue from "vue";
import moment from "moment-timezone";

const { Filesystem } = Plugins;

const $fs = {
  async writeFile(roomId, blob) {
    let now = new moment.tz("Asia/Kolkata");

    let directory = "Root-HMS/images/aadhar/" + now.format("YYYY-MM-DD");

    let fileName = now.format("HH-mm-ss") + "_" + roomId + ".png";

    let aadharFilePath = directory + "/" + fileName;

    try {
      let dataString = await blob.text();

      let exists = await Filesystem.stat({
        path: directory,
        directory: FilesystemDirectory.Documents
      });
      if (!exists)
        await Filesystem.mkdir({
          path: directory,
          directory: FilesystemDirectory.Documents,
          recursive: true
        });

      const result = await Filesystem.writeFile({
        path: aadharFilePath,
        data: dataString,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      console.log("Wrote file", result);
    } catch (e) {
      console.error("Unable to write file", e);
    }
  }
};

Vue.prototype.$fs = $fs;
