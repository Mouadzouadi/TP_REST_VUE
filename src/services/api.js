import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

export default {
  getQuestionnaires() {
    return apiClient.get('/questionnaires')
  },
  getQuestionnaire(id) {
    return apiClient.get(`/questionnaires/${id}`)
  },
  createQuestionnaire(data) {
    return apiClient.post('/questionnaires', data)
  },
  updateQuestionnaire(id, data) {
    return apiClient.put(`/questionnaires/${id}`, data)
  },
  deleteQuestionnaire(id) {
    return apiClient.delete(`/questionnaires/${id}`)
  }
}
