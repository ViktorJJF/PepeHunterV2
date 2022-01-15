<template>
  <div class="form-group">
    <label :for="label">{{ label }}</label>
    <input
      class="form-control"
      :class="{ ...customClasses, 'is-invalid': errors.length > 0 }"
      :clearable="clearable"
      :id="label"
      v-model="value"
      v-bind="$attrs"
    />
    <div v-for="(error, idx) in errors" :key="idx" class="invalid-feedback">
      {{ error.$message }}
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // must be included in props
    customClasses: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    errors: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [Number, String],
      default: '',
    },
  },
  emits: ['update:modelValue', 'input'],
  data: () => ({
    innerValue: '',
  }),
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  watch: {
    // Handles internal model changes.
    innerValue(newVal) {
      this.$emit('input', newVal);
    },
    // Handles external model changes.
    value(newVal) {
      this.innerValue = newVal;
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value;
    }
  },
};
</script>
