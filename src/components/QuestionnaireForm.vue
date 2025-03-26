<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const titre = ref('')
const description = ref('')

const submitForm = async () => {
  try {
    await api.createQuestionnaire({ titre: name.value, description: description.value })
    router.push('/questionnaires')
  } catch (error) {
    console.error('Erreur lors de la création', error)
  }
}
</script>

<template>
  <div>
    <h1>Créer un questionnaire</h1>
    <form @submit.prevent="submitForm">
      <input v-model="titre" placeholder="Titre" required />
      <textarea v-model="description" placeholder="Description"></textarea>
      <button type="submit">Créer</button>
    </form>
  </div>
</template>
