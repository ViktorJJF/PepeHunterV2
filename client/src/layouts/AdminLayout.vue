<template>
  <core-toolbar></core-toolbar>
  <success-message />
  <router-view v-slot="{ Component }">
    <!-- <transition name="fade"> -->
    <component :is="Component" />
    <!-- </transition> -->
  </router-view>
  <core-footer></core-footer>
</template>

<script>
import SuccessMessage from '@/components/common/successMessage.vue';
import CoreToolbar from '@/components/core/CoreToolbar.vue';
// import CoreDrawer from '@/components/core/CoreDrawer.vue';
import CoreFooter from '@/components/core/CoreFooter.vue';

export default {
  components: {
    SuccessMessage,
    CoreToolbar,
    // CoreDrawer,
    CoreFooter,
  },
  props: {
    source: String,
  },
  computed: {
    // overlay() {
    //   return this.$store.state.overlay.active;
    // },
    // overlayText() {
    //   return this.$store.state.overlay.text;
    // },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.common-layout {
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 60px;
  }

  .el-footer {
    line-height: 60px;
  }

  .el-aside {
    background-color: #d3dce6;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #e9eef3;
    color: var(--el-text-color-primary);
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
}
</style>
