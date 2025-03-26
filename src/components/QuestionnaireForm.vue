<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const questions = ref([{ title: '', type_question: 'text', reponses: [''] }]);

// Ajouter une nouvelle question
const addQuestion = () => {
  questions.value.push({ title: '', type_question: 'text', reponses: [''] });
};

// Supprimer une question
const removeQuestion = (index) => {
  questions.value.splice(index, 1);
};

// Ajouter une réponse à une question
const addResponse = (question) => {
  if (question.type_question !== 'text' || question.reponses.length < 1) {
    question.reponses.push('');
  }
};

// Supprimer une réponse
const removeResponse = (question, index) => {
  question.reponses.splice(index, 1);
};

// Soumettre le formulaire
const submitForm = async () => {
  try {
    await api.createQuestionnaire({
      name: name.value,
      questions: questions.value.map(q => ({
        title: q.title,
        type_question: q.type_question,
        reponses: q.reponses.filter(r => r.trim() !== '')
      }))
    });

    router.push('/questionnaires');
  } catch (error) {
    console.error('Erreur lors de la création du questionnaire', error);
  }
};
</script>

<template>
  <div>
    <h1>Créer un questionnaire</h1>
    <form @submit.prevent="submitForm">
      <label>Nom du questionnaire :</label>
      <input v-model="name" required />

      <h2>Questions</h2>
      <div v-for="(question, index) in questions" :key="index" class="question-block">
        <label>Titre de la question :</label>
        <input v-model="question.title" required />

        <label>Type :</label>
        <select v-model="question.type_question">
          <option value="text">Question</option>
          <option value="choix_multiple">Choix multiple</option>
        </select>

        <div>
          <label>Réponses :</label>
          <div v-for="(reponse, rIndex) in question.reponses" :key="rIndex">
            <input v-model="question.reponses[rIndex]" placeholder="Réponse" />
            <button type="button" @click="removeResponse(question, rIndex)" v-if="question.reponses.length > 1">❌</button>
          </div>
          <button type="button" @click="addResponse(question)" :disabled="question.type_question === 'text' && question.reponses.length >= 1">➕ Ajouter une réponse</button>
        </div>

        <button type="button" @click="removeQuestion(index)" v-if="questions.length > 1">🗑 Supprimer la question</button>
      </div>

      <button type="button" @click="addQuestion">➕ Ajouter une question</button>
      <button type="submit">Créer</button>
    </form>
  </div>
</template>

