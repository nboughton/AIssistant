<template>
  <q-item clickable v-ripple @click="app.current = id">
    <q-item-section avatar>
      <q-icon name="mdi-chat" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ app.sessions[id].name }}</q-item-label>
      <q-item-label caption>{{ app.sessions[id].model }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useAIssistantStore } from 'src/stores/app';

export default defineComponent({
  name: 'SessionListItem',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  emits: ['select'],
  setup() {
    const app = useAIssistantStore();
    return { app };
  },
});
</script>
