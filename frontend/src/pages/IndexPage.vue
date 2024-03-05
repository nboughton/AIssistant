<template>
  <q-page class="column items-center justify-start" padding>
    <div class="row full-width">
      <q-input class="col-grow q-mr-lg" label="Query" filled v-model="query" autogrow />
      <q-btn class="col-shrink" label="ASK" rounded :loading="loading" @click="doRequest" flat />
    </div>
    <div class="row text-center text-caption">{{ status }}</div>
    <q-card v-for="(res, i) in chatRecord" :key="`res-${i}`" class="row full-width bg-grey-3 rounded-borders">
      <q-card-section>Query: {{ res.query }}</q-card-section>
      <q-card-section>
        <pre class="response-text">{{ res.response }}</pre>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { IChatRecord, IOllamaChatResponse, Sources } from 'src/components/models';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    const query = ref('');
    const sentences = ref(<string[]>[]);
    const chatRecord = ref(<IChatRecord[]>[]);

    const loading = ref(false);
    const status = ref('idle');

    // Run requests to ollama and mimic
    const doRequest = async () => {
      if (!query.value) return;

      loading.value = true;
      status.value = 'Requesting response...';

      try {
        const req = new Request(`${Sources.Ollama}/api/generate`, {
          method: 'POST',
          body: `{
              "model": "llama2",
              "prompt": "${query.value}",
              "stream": false
            }`,
        });

        chatRecord.value.unshift({
          query: query.value,
          response: '',
        });

        const res = await fetch(req);
        const obj = JSON.parse(await res.text()) as IOllamaChatResponse;
        chatRecord.value[0].response = obj.response;
        sentences.value =
          chatRecord.value[0].response.length > 256
            ? (chatRecord.value[0].response.match(/[^\.!\?]+[\.!\?]+/g) as string[])
            : [chatRecord.value[0].response];

        status.value = 'Beginning speech...';
        const audioContext = new AudioContext();
        const buffers: AudioBuffer[] = [];
        let begun = false;

        const queue = async (b: AudioBuffer) => {
          buffers.push(b);

          if (!begun) {
            begun = true;

            while (buffers.length > 0) {
              await new Promise((resolve) => {
                status.value = 'Encoding speech...';
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const buffer = buffers.shift()!;
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.addEventListener('ended', resolve);
                source.connect(audioContext.destination);
                status.value = 'speaking';
                source.start(0);
              });
            }

            status.value = 'idle';
          }
        };

        for (let i = 0; i < sentences.value.length; i++) {
          if (!sentences.value[i]) return;

          const text = sentences.value[i].trim();

          const request = await fetch(`${Sources.Mycroft}/api/tts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'plain/text',
            },
            body: text,
          });

          const buffer = await request.arrayBuffer();
          audioContext.decodeAudioData(buffer, queue);
        }
        loading.value = false;
      } catch (e) {
        status.value = e as string;
        loading.value = false;
      }
    };

    return {
      query,
      chatRecord,
      loading,

      doRequest,
      status,
    };
  },
});
</script>

<style lang="sass">
.response-text
  white-space: pre-wrap
  text-align: left
</style>
