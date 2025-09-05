<template>
  <span class="headerAvatar"> </span>
</template>

<script>
import { mapGetters } from "vuex";
const path = process.env.VUE_APP_BASE_API;
export default {
  name: "customPic",
  props: {
    picType: {
      type: String,
      required: false,
      default: "avatar",
    },
    picSrc: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      path: path,
    };
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    avatar() {
      if (this.picSrc === "") {
        if (
          this.userInfo.headerImg !== "" &&
          this.userInfo.headerImg.slice(0, 4) === "http"
        ) {
          return this.userInfo.headerImg;
        }
        return this.path + this.userInfo.headerImg;
      } else {
        if (this.picSrc !== "" && this.picSrc.slice(0, 4) === "http") {
          return this.picSrc;
        }
        return this.path + this.picSrc;
      }
    },
    file() {
      if (this.picSrc && this.picSrc.slice(0, 4) !== "http") {
        return this.path + this.picSrc;
      }
      return this.picSrc;
    },
  },
};
</script>

<style scoped>
.headerAvatar {
  display: flex;
  justify-content: center;
  align-items: center;
}
.file {
  width: 80px;
  height: 80px;
  position: relative;
}
</style>