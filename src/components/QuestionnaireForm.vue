<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const route = useRoute();

// Ajout de l'index_reponse dans l'initialisation
const name = ref('');
const questions = ref([{ title: '', type_question: 'text', reponses: [''], index_reponse: null }]);

const isEdit = ref(false);
const questionnaireId = ref(null);

const fetchQuestionnaire = async () => {
  try {
    const response = await api.getQuestionnaire(route.params.id);
    const data = response.data;
    name.value = data.name;
    questions.value = data.questions.map(q => ({
      title: q.title,
      type_question: q.type_question,
      reponses: q.reponses && q.reponses.length ? q.reponses : [''],
      index_reponse: q.type_question === 'choix_multiple' ? q.index_reponse : null
    }));
  } catch (error) {
    console.error('Erreur de chargement du questionnaire', error);
  }
};

if (route.params.id) {
  isEdit.value = true;
  questionnaireId.value = route.params.id;
  onMounted(fetchQuestionnaire);
}

const addQuestion = () => {
  questions.value.push({ title: '', type_question: 'text', reponses: [''], index_reponse: null });
};

const removeQuestion = (index) => {
  questions.value.splice(index, 1);
};

const addResponse = (question) => {
  // Pour une question ouverte, on ne permet qu'une seule réponse
  if (question.type_question === 'text' && question.reponses.length >= 1) return;
  question.reponses.push('');
};

const removeResponse = (question, index) => {
  question.reponses.splice(index, 1);
  // Ajuste l'index_reponse s'il est hors limites après suppression
  if (question.index_reponse !== null && question.index_reponse >= question.reponses.length) {
    question.index_reponse = 0;
  }
};

// Si le type passe à "text", ne garder que la première réponse et réinitialiser index_reponse
watch(questions, (newQuestions) => {
  newQuestions.forEach((question) => {
    if (question.type_question === 'text' && question.reponses.length > 1) {
      question.reponses = [question.reponses[0]];
      question.index_reponse = null;
    }
  });
}, { deep: true });

const submitForm = async () => {
  const payload = {
    name: name.value,
    questions: questions.value.map(q => ({
      title: q.title,
      type_question: q.type_question,
      reponses: q.reponses.filter(r => r.trim() !== ''),
      index_reponse: q.type_question === 'choix_multiple' ? q.index_reponse : null
    }))
  };

  try {
    if (isEdit.value) {
      await api.updateQuestionnaire(questionnaireId.value, payload);
    } else {
      await api.createQuestionnaire(payload);
    }
    router.push('/questionnaires');
  } catch (error) {
    console.error(
      `Erreur lors de ${isEdit.value ? 'la mise à jour' : 'la création'} du questionnaire`,
      error
    );
  }
};
</script>

<template>
  <div>
    <h1>{{ isEdit ? 'Modifier le questionnaire' : 'Créer un questionnaire' }}</h1>
    <form @submit.prevent="submitForm">
      <label>Nom du questionnaire :</label>
      <input v-model="name" required />

      <h2>Questions</h2>
      <div v-for="(question, index) in questions" :key="index" class="question-block">
        <label>Titre de la question :</label>
        <input v-model="question.title" required />

        <label>Type :</label>
        <select v-model="question.type_question">
          <option value="text">Question ouverte</option>
          <option value="choix_multiple">Choix multiple</option>
        </select>

        <div>
          <label>Réponses :</label>
          <div v-for="(reponse, rIndex) in question.reponses" :key="rIndex">
            <input v-model="question.reponses[rIndex]" placeholder="Réponse" />
            <button type="button" @click="removeResponse(question, rIndex)" v-if="question.reponses.length > 1">❌</button>
          </div>
          <button type="button" 
                  @click="addResponse(question)" 
                  :disabled="question.type_question === 'text' && question.reponses.length >= 1">
            ➕ Ajouter une réponse
          </button>
        </div>

        <!-- Dropdown pour sélectionner la bonne réponse (uniquement pour choix multiple) -->
        <div v-if="question.type_question === 'choix_multiple'">
          <label>Bonne réponse :</label>
          <select v-model="question.index_reponse">
            <option v-for="(reponse, rIndex) in question.reponses" :key="rIndex" :value="rIndex">
              {{ reponse || `Réponse ${rIndex + 1}` }}
            </option>
          </select>
        </div>

        <button type="button" @click="removeQuestion(index)" v-if="questions.length > 1">🗑 Supprimer la question</button>
      </div>

      <button type="button" @click="addQuestion">➕ Ajouter une question</button>
      <button type="submit">{{ isEdit ? 'Mettre à jour' : 'Créer' }}</button>
    </form>
  </div>
  <button @click="$router.push('/questionnaires')">Retour</button>
</template>

<style scoped>
.question-block {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
