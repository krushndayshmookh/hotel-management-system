import {
  Plugins,
  FilesystemDirectory,
  // FilesystemEncoding
} from "@capacitor/core";
import Vue from "vue";
import moment from "moment-timezone";

const { Filesystem } = Plugins;

const $fs = {
  async writeFile(roomId, blob) {
    let now = new moment.tz("Asia/Kolkata");

    let directory = "Root-HMS/images/aadhar/" + now.format("YYYY-MM-DD");

    let fileName = now.format("HH-mm-ss") + "_" + roomId + ".jpg";

    let aadharFilePath = directory + "/" + fileName;

    try {
      await Filesystem.stat({
        path: directory,
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      // console.error(e);
      console.log("Path does not exist. Creating...");
      try {
        await Filesystem.mkdir({
          path: directory,
          directory: FilesystemDirectory.Documents,
          recursive: true
        });
      } catch (e) {
        console.error(e);
        console.log("Failed to create directory.");
      }
    }

    try {
      let dataString;

      var reader = new FileReader();

      reader.onload = async function() {
        dataString = reader.result;
        const result = await Filesystem.writeFile({
          path: aadharFilePath,
          data: dataString,
          directory: FilesystemDirectory.Documents
        });
        console.log("Wrote file", result);
      };

      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Unable to write file", e);
    }
  }
};

Vue.prototype.$fs = $fs;
