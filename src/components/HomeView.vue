<template>
  <div class="home">
    <h1>Accueil</h1>
    <div class="logo">
      <img src="/src/assets/quiz.webp" alt="logo quiz" />
    </div>
    <div class="links">
      <router-link to="/questionnaires" class="btn">Voir les questionnaires</router-link>
      <router-link to="/questionnaires/new" class="btn">Créer un questionnaire</router-link>
    </div>
  </div>
</template>
