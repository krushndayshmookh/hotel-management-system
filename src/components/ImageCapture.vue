<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        Capture AADHAR Card
        <q-btn
          icon="close"
          dense
          flat
          round
          class="float-right"
          v-close-popup
        />
      </div>
    </q-card-section>

    <div class="video-container">
      <video ref="webcam" autoplay playsinline muted />
    </div>

    <q-card-section class="text-center">
      <q-btn @click="capture" label="Capture and Check In" color="primary" />
    </q-card-section>
  </q-card>
</template>

<script>
import "webrtc-adapter";

export default {
  data() {
    return {
      mediaStream: null,
      imageCapture: null,

      captured: null,

      width: this.$q.screen.width,
      height: this.$q.screen.height - 64 - 78
    };
  },

  async mounted() {
    await this.startWebcam();
  },

  async destroyed() {
    this.stopWebcam();
  },

  methods: {
    async startWebcam() {
      var constraints = {
        audio: false,
        video: {
          facingMode: "environment",
          width: this.width,
          height: this.height
        }
      };
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        var video = this.$refs.webcam;
        video.srcObject = this.mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };

        const track = this.mediaStream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(track);
      } catch (err) {
        console.log(err.name + ": " + err.message);
      }
    },

    async capture() {
      const vm = this;
      try {
        function setInRange(value, range) {
          if (!range) return NaN;
          let x = Math.min(range.max, Math.max(range.min, value));
          x = Math.round(x / range.step) * range.step; // take `step` into account
          return x;
        }

        const {
          imageWidth,
          imageHeight
        } = await this.imageCapture.getPhotoCapabilities();
        
        const width = setInRange(this.width, imageWidth);
        const height = setInRange(this.height, imageHeight);

        const photoSettings =
          width && height
            ? {
                imageWidth: width,
                imageHeight: height
              }
            : null;

        await this.imageCapture.takePhoto(photoSettings).then(blob => {
          // console.log('Took photo:', blob)
          vm.$emit("capture", blob);
        });
      } catch (error) {
        console.log("takePhoto() error: ", error);
      }
    },

    async stopWebcam() {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
};
</script>
