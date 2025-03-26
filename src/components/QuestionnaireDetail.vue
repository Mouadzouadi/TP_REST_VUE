<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

export default {
  setup() {
    const route = useRoute();
    const questionnaire = ref(null);
    const questions = ref([]);

    async function fetchQuestionnaire() {
      try {
        const response = await api.getQuestionnaire(route.params.id);
        questionnaire.value = response.data;
        questions.value = response.data.questions;
      } catch (error) {
        console.error('Erreur de chargement du questionnaire', error);
      }
    }

    onMounted(fetchQuestionnaire);

    return { questionnaire, questions };
  }
};
</script>

<template>
  <div v-if="questionnaire">
    <h1>{{ questionnaire.name }}</h1>
    <h2>Questions</h2>
    <ul>
      <li v-for="question in questions" :key="question.id">
        <strong>{{ question.title }}</strong>

        <ul v-if="question.reponses && question.reponses.length">
          <li v-for="(reponse, index) in question.reponses" :key="index">
            {{ reponse }}
          </li>
        </ul>
        <p v-else>Aucune réponse enregistrée.</p>
      </li>
    </ul>

    <button @click="$router.push('/questionnaires')">Retour</button>
  </div>
  <div v-else>
    <p>Chargement en cours...</p>
  </div>
</template>
