<template>
  <v-card
    class="edit-form"
    :width="500"
  >
    <v-card-title>
      <span class="text-h5">{{ editMessage }} консультации</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form
          id="consultation-form"
          ref="form"
          v-model="isFormValid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Выберите дату*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="rules.date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="date"
                  locale="ru"
                  class="my-0"
                  @input="saveDate"
                />
              </v-menu>
            </v-col>
            <v-col>
              <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="time"
                    label="Укажите время*"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    :rules="rules.time"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="time"
                  class="my-0"
                  full-width
                  @change="isChangesExist = true"
                  @click:minute="$refs.menu2.save(time)"
                />
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="description"
                outlined
                name="input-7-4"
                label="Симптомы"
                @input="isChangesExist = true"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <small>*обязательные для заполнения поля</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        elevation="2"
        color="grey"
        :disabled="!isChangesExist && hideCancelButton"
        @click="cancel"
      >
        Отменить
      </v-btn>
      <v-btn
        elevation="2"
        color="blue"
        :disabled="!isChangesExist"
        @click="submit"
      >
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { generateNewId, consultationFormRules } from './../patient/_helpers'
  export default {
    props: {
      id: {
        type: Number,
        default: 0,
      },
      clearOnCancel: {
        type: Boolean,
        default: true,
      },
      hideCancelButton: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        patientId: 1,
        time: null,
        menu2: false,
        isChangesExist: false,
        isFormValid: true,

        rules: consultationFormRules,

        activePicker: null,
        date: null,
        description: null,
        menu: false,
      }
    },
    computed: {
      editMessage () {
        return this.id === 0 ? 'Добавление' : 'Редактирование'
      },
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.activePicker = 'YEAR'))
      },
      id () {
        this.reInitData()
      },
    },
    created () {
      this.reInitData()
    },
    methods: {
      getFormData () {
        return {
          patientId: this.patientId,
          date: this.date,
          time: this.time,
          description: this.description,
        }
      },
      reInitData () {
        if (this.id > 0) {
          const data = this.$store.state.consultations.find(cons => cons.id === this.id)
          this.date = data.date
          this.time = data.time
          this.description = data.description
        } else {
          this.clearForm()
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.isChangesExist = false
          })
        })
      },
      clearForm () {
        this.date = null
        this.time = null
        this.description = null
        this.$nextTick(() => {
          this.$refs.form.resetValidation()
          setTimeout(() => {
            this.isFormValid = false
            this.isChangesExist = false
          })
        })
      },
      submit () {
        const isValid = this.$refs.form.validate()
        if (isValid) {
          const data = this.getFormData()
          if (this.id === 0) { // если добавляем пациента
            const newId = generateNewId(this.$store.state.consultations)
            data.id = newId
            this.$store.commit('ADD_CONSULTATION', data)
            this.$emit('close')
            this.$emit('rowAdded', newId)
            this.isChangesExist = false
          } else if (this.id > 0) { // если редактируем существующую консультацию
            data.id = this.id
            this.$store.commit('EDIT_CONSULTATION', data)
            this.$emit('close')
            this.$emit('rowEdited', this.id)
            this.isChangesExist = false
          }
        } else {
          this.$emit('validationError', 'ПОЛЯ ЗАПОЛНЕНЫ НЕВЕРНО ИЛИ НЕ ПОЛНОСТЬЮ')
        }
      },
      cancel () {
        this.$emit('close')
        if (this.clearOnCancel) {
          setTimeout(() => {
            this.clearForm()
          }, 500)
        } else {
          this.reInitData()
        }
      },
      saveDate (date) {
        this.isChangesExist = true
        this.$refs.menu.save(date)
      },
    },
  }
</script>

<style lang="scss">
  #consultation-form {
    input[name=name], input[name=lastname], input[name=patronymic]{
      text-transform: capitalize;
    }
  }

</style>
