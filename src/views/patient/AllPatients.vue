<template>
  <v-card
    class="mx-auto"
    max-width="1200"
  >
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
          Подтвердите удаление карточки пациента "{{ cardNameForDelete }}"
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
            @click="deletePatient"
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
      <patient-edit-form
        :id="editingId"
        @close="closeEditForm"
        @rowEdited="rowEdited"
        @rowAdded="rowAdded"
        @validationError="validationError"
      />
    </v-dialog>
    <v-data-table
      id="all-patients-table"
      :headers="headers"
      :items="allPatientsNormalized"
      item-key="name"
      class="elevation-1 pt-3"
      :search="search"
      :custom-filter="searchFilter"
      placeholder="введите"
      sort-by="id"
      :sort-desc="true"
    >
      <template v-slot:no-results>
        <v-alert
          outlined
          type="error"
          class="my-4"
        >
          НЕТ РЕЗУЛЬТАТОВ
        </v-alert>
      </template>
      <template v-slot:top>
        <v-text-field
          v-model="search"
          v-mask="searchMask"
          :label="'Поиск по ' + searchModeString"
          class="mx-4"
          outlined
          prepend-inner-icon="mdi-account-search"
        />
        <v-container class="py-0">
          <v-btn
            color="primary"
            dark
            class="add-patient mb-2"
            @click="editPatient(0)"
          >
            <v-icon class="mr-4">
              mdi-account-plus
            </v-icon>
            Добавить пациента
          </v-btn>
        </v-container>
      </template>
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.fullName }}</td>
          <td>{{ formatSnills(item.snills) }}</td>
          <td class="align-center justify-end layout px-4">
            <v-btn
              small
              color="blue"
              :to="'/patient/'+item.id"
            >
              <v-icon>
                mdi-eye-outline
              </v-icon>
            </v-btn>
            <v-btn
              small
              color="warning"
              class="ml-2"
              @click="editPatient(item.id)"
            >
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              small
              color="error"
              class="ml-2"
              @click="deleteConfirmation({id: item.id, cardName: item.fullName})"
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
  import PatientEditForm from './EditForm'
  import { normalizeSnills, formattedSnills } from './_helpers'
  import { TweenLite } from 'gsap'
  export default {
    components: {
      PatientEditForm,
    },
    data () {
      return {
        // delete Dialog opts
        deleteDialog: false,
        cardNameForDelete: null,
        // snackbar
        snackbar: false,
        snackbarText: '',
        snackbarType: null,
        // edit form
        editDialog: false,
        editingId: 0,
        // search
        search: '',
        headers: [
          {
            text: 'id',
            value: 'id',
            sortable: false,
          }, {
            text: 'ФИО',
            value: 'fullName',
            sortable: false,
          }, {
            text: 'СНИЛС',
            value: 'snills',
            sortable: false,
          }, {
            text: 'Действия',
            align: 'end',
            value: 'id',
            sortable: false,
          },
        ],
      }
    },
    computed: {
      searchMode () { // 1-инпут пуст, 2-поиск по СНИЛС 3-поиск по ФИО
        if (this.search.length === 0) {
          return 1
        } else if (!isNaN(parseInt(this.search[0], 10))) {
          return 2
        } else {
          return 3
        }
      },
      searchMask () {
        if (this.searchMode === 2) {
          return '### ### ### ##'
        } else {
          return null
        }
      },
      searchFilter () {
        let cb
        if (this.searchMode !== 2) {
          cb = (value, search, item) => {
            return value != null && search != null && typeof value !== 'boolean' && value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
          }
        } else {
          cb = (value, search, item) => {
            return value != null && search != null && typeof value !== 'boolean' && value.toString().toLocaleLowerCase().indexOf(search.replace(/\s+/g, '')) !== -1
          }
        }
        return cb
      },
      searchModeString () {
        if (this.searchMode === 1) {
          return 'ФИО или СНИЛС'
        } else if (this.searchMode === 2) {
          return 'СНИЛС'
        } else {
          return 'ФИО'
        }
      },
      allPatientsNormalized () {
        return this.$store.state.patients.map(el => ({
          id: el.id,
          fullName: `${el.lastName} ${el.name} ${el.patronymic}`,
          snills: normalizeSnills(el.snills),
        }))
      },
    },
    created () {
      // setTimeout(() => {
      //   this.highlightNewPatient(7)
      // }, 1000)
    },
    methods: {
      deleteConfirmation ({ id, cardName }) {
        this.idForDelete = id
        this.cardNameForDelete = cardName
        this.deleteDialog = true
      },
      deletePatient () {
        this.$store.commit('DELETE_PATIENT', this.idForDelete)
        this.deleteDialog = false
        this.snackbarText = 'КАРТОЧКА ПАЦИЕНТА "' + this.cardNameForDelete + '" УСПЕШНО УДАЛЕНА'
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
          this.snackbarText = 'ДОБАВЛЕНА НОВАЯ КАРТОЧКА'
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
          const allRows = document.querySelectorAll('#all-patients-table tbody > tr')
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
      editPatient (id) {
        this.editingId = id
        this.editDialog = true
      },
      formatSnills (snillsStr) {
        return formattedSnills(snillsStr)
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
