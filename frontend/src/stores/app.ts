import { defineStore } from 'pinia';

import {
  Sources,
  IOllamaChatResponse,
  ISessions,
  ISession,
  IOllamaModel,
  IOllamaChatRequest,
  IOllamaPullRequest,
  IOllamaRmModelRequest,
} from 'src/components/models';

import { uid } from 'quasar';

import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/dist/text_splitter';

export const useAIssistantStore = defineStore('aissistant', {
  state: () => ({
    sessions: <ISessions>{
      default: {
        id: 'default',
        name: 'default',
        model: 'mistral',
        history: [],
      },
    },
    current: 'default',
    status: 'idle',
    loading: false,
    progress: 0,
  }),
  getters: {
    session: (state): ISession => state.sessions[state.current],
  },
  actions: {
    // Actions
    async listModels(): Promise<IOllamaModel[]> {
      this.status = 'Requesting model list';
      let models: { models: IOllamaModel[] } = { models: [] };

      try {
        const res = await fetch(`${Sources.Ollama}/api/tags`, {
          method: 'GET',
        });

        models = await res.json();
        this.status = 'idle';
        return models.models;
      } catch (e) {
        this.status = e as string;
      }

      return models.models;
    },

    async pullModel(name: string) {
      try {
        this.status = 'Pulling model, please wait.';
        this.loading = true;

        const res = await fetch(`${Sources.Ollama}/api/pull`, {
          method: 'POST',
          body: JSON.stringify(<IOllamaPullRequest>{
            name,
            stream: false,
          }),
        });

        const s = (await res.json()) as { status: string };
        this.status = s.status;
      } catch (e) {
        this.status = e as string;
      }

      this.loading = false;
    },

    async rmModel(name: string) {
      try {
        this.status = 'Removing model, please wait.';
        this.loading = true;

        const res = fetch(`${Sources.Ollama}/api/delete`, {
          method: 'DELETE',
          body: JSON.stringify(<IOllamaRmModelRequest>{
            name,
          }),
        });

        (await res).status == 200 ? (this.status = 'Success!') : (this.status = `${(await res).statusText}`);
        this.loading = false;
      } catch (e) {
        this.status = e as string;
      }
    },

    async LoadDoc(b: Blob) {
      this.status = 'Attempting to load file';

      try {
        const loader = new WebPDFLoader(b, {
          splitPages: false,
        });

        const docs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 10,
          chunkOverlap: 1,
        });

        const docOutput = await splitter.splitDocuments(docs);
      } catch (e) {
        this.status = e as string;
      }

      this.status = 'idle';
    },

    async LCquery(prompt: string) {
      const chatModel = new ChatOllama({
        baseUrl: Sources.Ollama,
        model: this.session.model,
      });

      console.log(await chatModel.invoke(prompt));
    },

    async query(prompt: string) {
      if (!prompt) return;

      this.status = 'Requesting response...';
      this.loading = true;

      try {
        const context = this.session.history[0]?.answer.context ? this.session.history[0].answer.context : [];

        const res = await fetch(`${Sources.Ollama}/api/generate`, {
          method: 'POST',
          body: JSON.stringify(<IOllamaChatRequest>{
            model: this.session.model,
            prompt,
            context,
            stream: false,
            keep_alive: -1,
          }),
        });
        this.session.history.unshift({
          query: prompt,
          answer: (await res.json()) as IOllamaChatResponse,
        });
      } catch (e) {
        this.session.history.unshift({
          query: prompt,
          answer: { response: e as string } as IOllamaChatResponse,
        });
      }

      this.status = 'idle';
      this.loading = false;
    },

    async speak(words: string) {
      if (!words) return;

      try {
        const sentences = words.length > 256 ? (words.match(/[^\.!\?]+[\.!\?]+/g) as string[]) : [words];

        this.status = 'Beginning speech...';
        const audioContext = new AudioContext();
        const buffers: AudioBuffer[] = [];
        let begun = false;

        const queue = async (b: AudioBuffer) => {
          buffers.push(b);

          if (!begun) {
            begun = true;

            while (buffers.length > 0) {
              await new Promise((resolve) => {
                this.status = 'Encoding speech...';
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const buffer = buffers.shift()!;
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.addEventListener('ended', resolve);
                source.connect(audioContext.destination);
                this.status = 'speaking';
                source.start(0);
              });
            }

            this.status = 'idle';
          }
        };

        for (let i = 0; i < sentences.length; i++) {
          if (!sentences[i]) return;

          const text = sentences[i].trim();

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
      } catch (e) {
        this.status = e as string;
      }

      this.status = 'idle';
      this.loading = false;
    },

    addSession(name: string, model: string, speak?: boolean) {
      const s = <ISession>{
        id: uid(),
        name,
        model,
        history: [],
        speak: speak ? true : false,
      };

      this.sessions[s.id] = s;
      this.current = s.id;
    },

    rmSession(id: string) {
      if (Object.keys(this.sessions).find((o) => o == id)) {
        const next = Object.keys(this.sessions).find((o) => o !== id);
        if (next) {
          this.current = next;
          delete this.sessions[id];
        }
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'AIssistantStore',
        storage: localStorage,
      },
    ],
  },
});
