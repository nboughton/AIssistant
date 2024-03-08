<template>
  <q-page class="column items-center justify-start" padding>
    <div class="row full-width items-start">
      <q-input class="col-grow q-mr-md" label="Query" filled v-model="query" autogrow clearable />
      <div class="col-shrink">
        <div class="row">
          <q-btn
            class="col-shrink q-mr-md"
            label="ASK"
            :loading="app.loading"
            @click="doRequest"
            color="primary"
            glossy
            rounded
          />
          <q-btn class="col-shrink" label="Clear History" @click="clearHistory" glossy rounded color="warning" />
        </div>
      </div>
    </div>

    <div class="row full-width items-center justify-between q-my-md">
      <q-input class="col q-mr-md" dense label="Session Name" v-model="app.session.name" />
      <q-input class="col q-mr-md" dense readonly label="Status" v-model="app.status" />
      <q-toggle class="col-shrink q-mr-md" label="Default to speaking?" v-model="app.session.speak" />
      <q-btn class="col-shrink" icon="delete" @click="deleteSession" flat rounded />
    </div>

    <q-card
      v-for="(res, i) in app.session.history"
      :key="`res-${i}`"
      class="column full-width bg-blue-grey-9 q-mb-md no-shadow"
    >
      <q-card-section class="row justify-center items-center full-width q-mb-none text-white bg-blue-grey-10">
        <div class="col-grow text-bold">{{ res.query }}</div>
        <div v-if="res.answer.response" class="col-shrink text-caption">
          {{ res.answer.model }}, {{ Math.floor(res.answer.total_duration / 1000 / 1000 / 1000) }}s
        </div>
        <q-btn class="col-shrink" icon="mdi-play-circle" flat dense @click="app.speak(res.answer.response)" />
      </q-card-section>
      <q-card-section class="row full-width q-pt-sm q-mt-none bg-blue-grey-9-2 rounded-borders">
        <pre class="response-text">{{ res.answer.response }}</pre>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useAIssistantStore } from 'src/stores/app';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    const app = useAIssistantStore();
    const query = ref('');

    const doRequest = async () => {
      await app.query(query.value);
      if (app.session.speak) await app.speak(app.session.history[0].answer.response);
    };

    const $q = useQuasar();
    const deleteSession = () =>
      $q
        .dialog({
          title: 'Delete this session?',
          message: 'This cannot be undone!',
          cancel: true,
        })
        .onOk(() => app.rmSession(app.current));

    const clearHistory = () =>
      $q
        .dialog({
          title: 'Clear Chat History?',
          message: 'This cannot be undone and will remove all context effectively making this a fresh session.',
          cancel: true,
        })
        .onOk(() => app.session.history.splice(0));

    return {
      app,
      query,
      doRequest,
      clearHistory,
      deleteSession,
    };
  },
});
</script>

<style lang="sass">
.response-text
  white-space: pre-wrap
  text-align: left
</style>
