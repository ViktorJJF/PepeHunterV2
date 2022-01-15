<template>
  <div class="main-container">
    <!-- Page header start -->
    <div class="page-header">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">Inicio</li>
        <li class="breadcrumb-item active">{{ viewName }}</li>
      </ol>
    </div>
    <!-- Page header end -->

    <!-- Content wrapper start -->
    <div class="content-wrapper">
      <slot></slot>
    </div>
    <!-- Content wrapper end -->
  </div>
</template>

<script>
export default {
  props: {
    viewName: {
      type: String,
      default: 'Mi vista',
    },
  },
};
</script>

<style lang="scss" scoped></style>
