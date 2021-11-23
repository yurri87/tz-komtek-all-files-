<template>
  <v-container
    id="patient-detail"
    fluid
    tag="section"
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
    <v-row>
      <v-col>
        <base-material-card class="px-5 py-3">
          <template v-slot:heading>
            <v-tabs
              v-model="tabs"
              background-color="transparent"
              slider-color="white"
            >
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-card-account-details
                </v-icon>
                Карточка
              </v-tab>
              <v-tab class="mr-3">
                <v-icon class="mr-2">
                  mdi-message-alert
                </v-icon>
                Консультации
              </v-tab>
            </v-tabs>
          </template>

          <v-tabs-items
            v-model="tabs"
            class="transparent"
          >
            <v-tab-item
              :key="1"
            >
              <patient-edit-form
                :id="id"
                :clear-on-cancel="false"
                :hide-cancel-button="true"
                @rowEdited="rowEdited"
                @validationError="validationError"
              />
            </v-tab-item>
            <v-tab-item
              :key="2"
            >
              <v-data-table
                :headers="headers"
                :single-expand="true"
                :items="consultations"
                :expanded.sync="expanded"
                item-key="id"
                show-expand
                class="elevation-1"
              >
                <template v-slot:expanded-item="{ headers, item }">
                  <td
                    :colspan="headers.length"
                    v-html="item.description"
                  />
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import PatientEditForm from './EditForm'
  export default {
    components: {
      PatientEditForm,
    },
    data () {
      return {
        tabs: 1,
        expanded: [],
        headers: [
          { text: 'id', sortable: false, value: 'id' },
          { text: 'дата', sortable: false, value: 'date' },
          { text: 'время', sortable: false, value: 'time' },
          { text: '', value: 'data-table-expand' },
        ],
        snackbar: false,
        snackbarText: '',
        snackbarType: null,
      }
    },
    computed: {
      id () {
        return parseInt(this.$route.params.id)
      },
      consultations () {
        return this.$store.state.consultations.filter(obj => obj.patientId === this.id)
      },
    },
    methods: {
      validationError (message) {
        this.snackbarText = message
        this.snackbarType = 'error'
        this.snackbar = true
      },
      rowEdited () {
        this.snackbarText = 'КАРТОЧКА УСПЕШНО ОТРЕДАКТИРОВАНА'
        this.snackbarType = 'success'
        this.snackbar = true
      },
    },
  }
</script>
<style lang="scss">
  #patient-detail {
    .v-data-table__expanded__row td {
      background-color: #b5e7b7;
      border-bottom: none!important;
      &:first-child{
        padding-left: 11px;
      }
    }
    .v-data-table__expanded > td:first-child {
      border-left: 5px solid #4caf50;
    }
    .v-card.edit-form {
      box-shadow: none!important;
      .v-card__title, .v-card__text {
        padding: 0!important;
      }
    }
  }
</style>
