<template>
  <q-page class="column items-center justify-start" padding>
    <!-- content -->
    <div class="row items-center q-mb-md">
      <div class="col-grow text-h4">Models</div>
      <q-btn class="col-shrink" icon="info" flat href="https://ollama.com/library" />
      <q-btn class="col-shrink" icon="mdi-comment-plus" flat @click="pullModel" />
    </div>

    <div class="row text-center text-caption">{{ app.status }}</div>

    <q-card class="row full-width q-mb-md" v-for="model in models" :key="model.digest">
      <q-card-section class="row items-center full-width bg-black text-white text-h6">
        <div class="col-grow">{{ model.name }}</div>
      </q-card-section>

      <q-card-section>
        <model-line-item label="Family" :value="model.details.family" />
        <model-line-item label="Digest" :value="model.digest" />
        <model-line-item label="Modified" :value="new Date(model.modified_at).toLocaleDateString()" />
        <model-line-item label="Size" :value="`${(model.size / 1000 / 1000 / 1000).toFixed(2)}GB`" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { IOllamaModel } from 'src/components/models';

import { useQuasar } from 'quasar';
import { useAIssistantStore } from 'src/stores/app';

import ModelLineItem from 'src/components/ModelLineItem.vue';

export default defineComponent({
  name: 'ManageModels',
  components: { ModelLineItem },
  setup() {
    const app = useAIssistantStore();

    const models = ref(<IOllamaModel[]>[]);
    onMounted(async () => (models.value = await app.listModels()));

    const $q = useQuasar();
    const pullModel = () =>
      $q
        .dialog({
          title: 'Pull a Model',
          prompt: {
            label: 'Model Name',
            model: 'llama2',
            type: 'text',
          },
          cancel: true,
        })
        .onOk(async (name) => {
          await app.pullModel(name);
          models.value = await app.listModels();
        });

    return {
      app,
      models,
      pullModel,
    };
  },
});
</script>
