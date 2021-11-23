import Vue from 'vue'
import Vuex from 'vuex'
import allPatients from './data/all-patients'
import allConsultations from './data/all-consultations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    patients: allPatients,
    consultations: allConsultations,
  },
  mutations: {
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    ADD_PATIENT (state, data) {
      state.patients.push(data)
    },
    ADD_CONSULTATION (state, data) {
      state.consultations.push(data)
    },
    EDIT_PATIENT (state, data) {
      const patient = state.patients.find(obj => obj.id === data.id)
      const idx = state.patients.indexOf(patient)
      state.patients.splice(idx, 1, data)
    },
    EDIT_CONSULTATION (state, data) {
      const consultation = state.consultations.find(obj => obj.id === data.id)
      const idx = state.consultations.indexOf(consultation)
      state.consultations.splice(idx, 1, data)
    },
    DELETE_PATIENT (state, id) {
      const patientForDelete = state.patients.find((obj) => obj.id === id)
      state.patients.splice(state.patients.indexOf(patientForDelete), 1)
    },
    DELETE_CONSULTATION (state, id) {
      const consultationForDelete = state.consultations.find((obj) => obj.id === id)
      state.consultations.splice(state.consultations.indexOf(consultationForDelete), 1)
    },
  },
})
