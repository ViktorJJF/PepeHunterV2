<template>
  <div id="notes" class="notify notify-notes" v-show="showSuccessMessage">
    <div class="note note-success note-7">
      <span class="image"><i class="icon-sentiment_satisfied"></i></span
      ><button type="button" class="remove"><i class="icon-close"></i></button>
      <div class="content">
        <strong class="title">Hello</strong>I'm a notification I will quickly
        alert you as well!
      </div>
    </div>
  </div>

  <!--
  <v-snackbar
    shaped
    v-model="showSuccessMessage"
    color="success"
    bottom
    :timeout="successMessageTimeout"
  >
    {{ successMessage }}
    <template v-slot:action>
      <v-btn text @click="showSuccessMessage = false">
        <v-icon large>mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar> -->
</template>

<script>
export default {
  name: 'SuccessMessage',
  computed: {
    showSuccessMessage: {
      get() {
        return this.$store.state.successModule.showSuccessMessage;
      },
      set(value) {
        this.$store.commit('successModule/showSuccess', value);
      },
    },
    successMessage() {
      return this.$store.state.successModule.successMessage;
    },
    successMessageTimeout() {
      return this.$store.state.successModule.successMessageTimeout;
    },
  },
  watch: {
    successMessage() {
      setTimeout(() => {
        this.showSuccessMessage = this.successMessage !== '';
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped></style>
