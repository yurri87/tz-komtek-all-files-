export function generateNewId (existingData) {
  const filtered = existingData.map(obj => obj.id)
  return Math.max(...filtered) + 1
}

export function normalizeSnills (snillsStr) {
  return snillsStr.replace(/\s+/g, '')
}

export function normalizeName (string) {
  const lowerCaseStr = string.toLowerCase()
  return lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1)
}

export function validateSnills (snillsStr) {
  if (snillsStr) {
  const normalizedSnills = normalizeSnills(snillsStr)
    if (normalizedSnills.length < 11) {
      return 'СНИЛС должен содержать 11 цифр'
    }
    let result = false
    var sum = 0
    for (var i = 0; i < 9; i++) {
      sum += parseInt(normalizedSnills[i]) * (9 - i)
    }
    var checkDigit = 0
    if (sum < 100) {
      checkDigit = sum
    } else if (sum > 101) {
      checkDigit = sum % 101
      if (checkDigit === 100) {
        checkDigit = 0
      }
    }
    if (checkDigit === parseInt(normalizedSnills.slice(-2))) {
      result = true
    } else {
      result = 'СНИЛС не прошел проверку контрольных чисел'
    }
    return result
  } else {
    return false
  }
}
export function formattedSnills (snillsStr) {
  let result = ''
  for (let i = 0; i < snillsStr.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      result = result + ' ' + snillsStr[i]
    } else {
      result = result + snillsStr[i]
    }
  }
  return result
}

function onlyCirillyc (val) {
  return /^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/.test(val)
}

export const rules = {
  name: [
    value => !!value || 'Поле обязательно для заполнения.',
    value => onlyCirillyc(value) || 'Имя на русском языке',
  ],
  lastname: [
    value => !!value || 'Поле обязательно для заполнения.',
    value => onlyCirillyc(value) || 'Фамилия на русском языке',
  ],
  patronymic: [
    value => !!value || 'Поле обязательно для заполнения.',
    value => onlyCirillyc(value) || 'Отчество на русском языке',
  ],
  date: [
    value => !!value || 'Поле обязательно для заполнения..',
  ],
  gender: [
    value => !!value || 'Поле обязательно для заполнения..',
  ],
  snills: [
    value => !!value || 'СНИЛС состоит из 11 цифр.',
    value => validateSnills(value),
  ],
}

export const consultationFormRules = {
  date: [
    value => !!value || 'Поле обязательно для заполнения..',
  ],
  time: [
    value => !!value || 'Поле обязательно для заполнения..',
  ],
}
