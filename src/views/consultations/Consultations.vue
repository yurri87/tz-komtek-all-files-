<template>
  <v-card
    class="mx-auto"
    max-width="1200"
  >
    <v-card-title>
      Лк пациента {{ patientData.lastName + ' ' + patientData.name + ' ' + patientData.patronymic }}
    </v-card-title>
    <base-material-snackbar
      v-model="snackbar"
      :type="snackbarType"
      timeout="5000"
      right
      top
    >
      {{ snackbarText }}
    </base-material-snackbar>
    <v-dialog
      v-model="deleteDialog"
      persistent
      width="500"
    >
      <v-card>
        <v-card-title class="text-h3">
          Подтвердите удаление
        </v-card-title>

        <v-card-text>
          Подтвердите удаление консультации
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            @click="deleteDialog = false"
          >
            <v-icon class="mr-4">
              mdi-cancel
            </v-icon>
            Отменить
          </v-btn>
          <v-btn
            color="error"
            @click="deleteConsultation"
          >
            <v-icon class="mr-4">
              mdi-delete
            </v-icon>
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="editDialog"
      persistent
      max-width="600px"
    >
      <consultation-edit-form
        :id="editingId"
        @close="closeEditForm"
        @rowEdited="rowEdited"
        @rowAdded="rowAdded"
        @validationError="validationError"
      />
    </v-dialog>
    <v-data-table
      id="all-consultations-table"
      :headers="headers"
      :items="allConsultations"
      item-key="id"
      class="elevation-1 pt-3"
      sort-by="date"
      :sort-desc="true"
    >
      <template v-slot:top>
        <v-container class="py-0">
          <v-btn
            color="primary"
            dark
            class="add-patient mb-2"
            @click="editConsultation(0)"
          >
            Добавить консультацию
          </v-btn>
        </v-container>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td style="width: 130px">
            {{ item.date }}
          </td>
          <td>{{ item.time }}</td>
          <td>{{ item.description }}</td>
          <td class="align-center justify-end layout px-4">
            <v-btn
              small
              color="warning"
              class="ml-2"
              @click="editConsultation(item.id)"
            >
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              small
              color="error"
              class="ml-2"
              @click="deleteConfirmation(item.id)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import ConsultationEditForm from './EditForm'
  import { TweenLite } from 'gsap'
  export default {
    components: {
      ConsultationEditForm,
    },
    data () {
      return {
        patientId: 1, // пусть будет кабинет определенного пациента
        // delete Dialog opts
        deleteDialog: false,
        // snackbar
        snackbar: false,
        snackbarText: '',
        snackbarType: null,
        // edit form
        editDialog: false,
        editingId: 0,
        headers: [
          { text: 'id', sortable: false, value: 'id' },
          { text: 'дата', sortable: false, value: 'date' },
          { text: 'время', sortable: false, value: 'time' },
          { text: '', value: 'data-table-expand' },
        ],
      }
    },
    computed: {
      patientData () {
        return this.$store.state.patients.find(el => el.id === this.patientId)
      },
      allConsultations () {
        return this.$store.state.consultations.filter(el => el.patientId === this.patientId)
      },
    },
    created () {
      // setTimeout(() => {
      //   this.highlightNewPatient(7)
      // }, 1000)
    },
    methods: {
      first100letters (str) {
        return str.slice(0, 100)
      },
      deleteConfirmation (id) {
        this.idForDelete = id
        this.deleteDialog = true
      },
      deleteConsultation () {
        this.$store.commit('DELETE_CONSULTATION', this.idForDelete)
        this.deleteDialog = false
        this.snackbarText = 'КОНСУЛЬТАЦИЯ УДАЛЕНА"'
        this.snackbarType = 'success'
        this.snackbar = true
      },
      validationError (message) {
        this.snackbarText = message
        this.snackbarType = 'error'
        this.snackbar = true
      },
      rowAdded (id) {
        this.highlightRow(id)
        setTimeout(() => {
          this.snackbarText = 'КОНСУЛЬТАЦИЯ ДОБАВЛЕНА'
          this.snackbarType = 'success'
          this.snackbar = true
        }, 500)
      },
      rowEdited (id) {
        this.highlightRow(id)
        setTimeout(() => {
          this.snackbarText = 'КАРТОЧКА УСПЕШНО ОТРЕДАКТИРОВАНА'
          this.snackbarType = 'success'
          this.snackbar = true
        }, 500)
      },
      highlightRow (id) {
        this.$nextTick(() => {
          const allRows = document.querySelectorAll('#all-consultations-table tbody > tr')
          let targetRow = false
          allRows.forEach(row => {
            if (id === parseInt(row.childNodes[0].innerText)) {
              targetRow = row
            }
          })
          TweenLite.fromTo(targetRow, 2, { backgroundColor: '#51DE6E' }, { backgroundColor: 'white', onComplete () { TweenLite.set(targetRow, { clearProps: 'all' }) } })
        })
      },
      closeEditForm () {
        this.editDialog = false
        this.editingId = -1
      },
      editConsultation (id) {
        this.editingId = id
        this.editDialog = true
      },
    },
  }
</script>
<style lang="scss">
  .v-input .v-label {
    font-size: 1.2em;
  }
  .v-snack__wrapper {
    display: block;
    .v-btn {
      margin-left: 10px;
    }
  }
</style>
