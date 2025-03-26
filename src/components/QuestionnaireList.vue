<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const questionnaires = ref([])

const fetchData = async () => {
  try {
    const response = await api.getQuestionnaires()
    questionnaires.value = response.data
  } catch (error) {
    console.error('Erreur de chargement des questionnaires', error)
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <h1>Liste des questionnaires</h1>
    <ul>

      <li v-for="q in questionnaires" :key="q.id">
        {{ q.name }}
        <button @click="$router.push(`/questionnaires/${q.id}`)">Voir</button>
        <button @click="deleteQuestionnaire(q.id)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>
