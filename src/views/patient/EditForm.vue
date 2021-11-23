<template>
  <v-card class="edit-form">
    <v-card-title>
      <span class="text-h5">{{ editMessage }} карточки пациента</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form
          id="patient-form"
          ref="form"
          v-model="isFormValid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="lastName"
                name="lastname"
                label="Фамилия*"
                :rules="rules.lastname"
                required
                @input="isChangesExist = true"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="name"
                name="name"
                label="Имя*"
                :rules="rules.name"
                required
                @input="isChangesExist = true"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-text-field
                v-model="patronymic"
                name="patronymic"
                label="Отчество"
                :rules="rules.patronymic"
                @input="isChangesExist = true"
              />
            </v-col>
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
                    v-model="birthdayDate"
                    label="Дата рождения*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :rules="rules.date"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="birthdayDate"
                  locale="ru"
                  :active-picker.sync="activePicker"
                  :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                  min="1950-01-01"
                  class="my-0"
                  @input="saveBirthday"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                v-model="gender"
                :items="genderOptions"
                label="Пол*"
                required
                :rules="rules.gender"
                @change="isChangesExist = true"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="snillsFormatted"
                v-mask="'### ### ### ##'"
                label="СНИЛС*"
                required
                :rules="rules.snills"
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
  import { generateNewId, normalizeName, formattedSnills, normalizeSnills, rules } from './_helpers'
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
        isChangesExist: false,
        isFormValid: true,
        name: false,
        rules,
        lastName: false,
        patronymic: false,
        snillsFormatted: null,
        genderOptions: [{
          text: 'мужской',
          value: 'male',
        }, {
          text: 'женский',
          value: 'female',
        }],
        gender: null,
        activePicker: null,
        birthdayDate: null,
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
          lastName: normalizeName(this.lastName),
          name: normalizeName(this.name),
          patronymic: normalizeName(this.patronymic),
          birth: this.birthdayDate,
          gender: this.gender,
          snills: normalizeSnills(this.snillsFormatted),
        }
      },
      reInitData () {
        if (this.id > 0) {
          const patientData = this.$store.state.patients.find(patient => patient.id === this.id)
          this.name = patientData.name
          this.lastName = patientData.lastName
          this.patronymic = patientData.patronymic
          this.gender = patientData.gender
          this.birthdayDate = patientData.birth
          const snillsNormalized = normalizeSnills(patientData.snills)
          this.snillsFormatted = formattedSnills(snillsNormalized)
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
        this.name = null
        this.lastName = null
        this.patronymic = null
        this.gender = null
        this.birthdayDate = null
        this.snillsFormatted = null
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
            const newId = generateNewId(this.$store.state.patients)
            data.id = newId
            this.$store.commit('ADD_PATIENT', data)
            this.$emit('close')
            this.$emit('rowAdded', newId)
            this.isChangesExist = false
          } else if (this.id > 0) { // если редактируем существующего пациента
            data.id = this.id
            this.$store.commit('EDIT_PATIENT', data)
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
      saveBirthday (date) {
        this.isChangesExist = true
        this.$refs.menu.save(date)
      },
    },
  }
</script>

<style lang="scss">
  #patient-form {
    input[name=name], input[name=lastname], input[name=patronymic]{
      text-transform: capitalize;
    }
  }

</style>
