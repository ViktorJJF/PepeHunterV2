<template>
  <router-view />
  <loading-screen />
</template>

<script>
import LoadingScreen from '@/components/common/loadingScreen.vue';

export default {
  components: {
    LoadingScreen,
  },
  created() {},
};
</script>

<style lang="scss">
</style>
