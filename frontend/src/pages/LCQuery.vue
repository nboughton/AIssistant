<template>
  <q-page padding>
    <!-- content -->
  </q-page>

  <q-dialog v-model="showDocLoader">
    <q-card-section>Load Document</q-card-section>
    <q-card-section>
      <q-file v-model="fileToLoad" />
    </q-card-section>
    <q-card-actions class="row justify-end">
      <q-btn label="OK" @click="app.LoadDoc(fileToLoad)" />
      <q-btn label="cancel" @click="showDocLoader = false" />
    </q-card-actions>
  </q-dialog>
</template>

<script lang="ts">
import { useAIssistantStore } from 'src/stores/app';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'LCQuery',
  setup() {
    const app = useAIssistantStore();

    const showDocLoader = ref(false);
    const fileToLoad = ref(null);

    return {
      app,
      showDocLoader,
      fileToLoad,
    };
  },
});
</script>
