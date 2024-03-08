<template>
  <q-page class="column items-center justify-start" padding>
    <div class="row full-width items-start justify-evenly">
      <q-input class="col-grow q-mr-md" label="Text" filled v-model="text" autogrow clearable />
      <q-btn class="col-shrink" icon="mdi-play-circle" @click="app.speak(text)" glossy rounded size="lg" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { useAIssistantStore } from 'src/stores/app';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'TextToSpeech',
  setup() {
    const app = useAIssistantStore();
    const text = ref('');

    return {
      app,
      text,
    };
  },
});
</script>
