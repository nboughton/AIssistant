<template>
  <div class="row items-center justify-between">
    <div class="col-3">{{ label }}:</div>
    <div class="col-9">{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModelLineItem',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
});
</script>
