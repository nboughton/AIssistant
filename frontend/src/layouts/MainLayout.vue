<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> AIssistant - Session: {{ app.session.name }} </q-toolbar-title>

        <q-btn icon="home" round flat to="/" />
        <q-btn icon="mdi-account-voice" round flat to="/speak" />
        <q-btn icon="mdi-brain" round flat to="/models">
          <q-tooltip>manage models</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>Chat Sessions</q-item-label>

        <q-item clickable v-ripple @click="openDialog">
          <q-item-section avatar>
            <q-icon name="mdi-chat-plus" />
          </q-item-section>
          <q-item-section>
            <q-item-label>New Session</q-item-label>
          </q-item-section>
        </q-item>

        <SessionListItem v-for="session in app.sessions" :key="`session-${session.id}`" :id="session.id" />

        <q-item-label header> Useful Links </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section> Configure Session </q-card-section>

      <q-card-section class="column">
        <q-input label="Session name" v-model="newSessionVars.name" />
        <q-select label="Model" :options="models" v-model="newSessionVars.model" />
        <q-toggle label="Speak answers?" v-model="newSessionVars.speak" />
      </q-card-section>

      <q-card-actions>
        <q-btn label="Cancel" @click="showDialog = false" />
        <q-btn
          label="OK"
          @click="
            app.addSession(newSessionVars.name, newSessionVars.model, newSessionVars.speak);
            showDialog = false;
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { useAIssistantStore } from 'src/stores/app';

import EssentialLink from 'components/EssentialLink.vue';
import SessionListItem from 'src/components/SessionListItem.vue';

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Ollama',
    caption: 'ollama.com',
    icon: 'code',
    link: 'https://ollama.com/',
  },
  {
    title: 'Mycroft',
    caption: 'Neural TTS',
    icon: 'chat',
    link: 'https://mycroft-ai.gitbook.io/docs/',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    SessionListItem,
  },

  setup() {
    const app = useAIssistantStore();
    const leftDrawerOpen = ref(false);
    const showDialog = ref(false);

    let models = ref(<string[]>[]);
    onMounted(async () => {
      const m = await app.listModels();
      models.value = m.map((o) => o.name);
    });

    const newSessionVars = ref({
      name: '',
      model: '',
      speak: true,
    });

    const openDialog = async () => {
      newSessionVars.value = {
        name: '',
        model: '',
        speak: true,
      };
      models.value = (await app.listModels()).map((o) => o.name);
      showDialog.value = true;
    };

    return {
      app,
      showDialog,
      openDialog,
      models,
      newSessionVars,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
