<template>
  <!-- Loading starts -->
  <div id="loading-wrapper" v-show="overlay">
    <span class="loader"></span>
  </div>
  <!-- Loading ends -->
</template>

<script>
export default {
  computed: {
    overlay() {
      return this.$store.state.loadingModule.loading;
    },
    overlayText() {
      return this.$store.state.overlay.text;
    },
  },
};
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  left: 50%;
  top: 50%;
  margin: 0px auto;
  position: relative;
  display: inline-block;
  border-width: 3px 2px 3px 2px;
  border-style: solid dotted solid dotted;
  border-color: #de3500 rgba(255, 255, 255, 0.3) #fff rgba(151, 107, 93, 0.3);
  border-radius: 50%;
  box-sizing: border-box;
  animation: 1s rotate linear infinite;
}
.loader:before,
.loader:after {
  content: '';
  top: 0;
  left: 0;
  position: absolute;
  border: 10px solid transparent;
  border-bottom-color: #fff;
  transform: translate(-10px, 19px) rotate(-35deg);
}
.loader:after {
  border-color: #de3500 #0000 #0000 #0000;
  transform: translate(32px, 3px) rotate(-35deg);
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}
</style>
