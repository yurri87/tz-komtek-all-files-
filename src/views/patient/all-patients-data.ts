interface patient {
  id: number,
  name: string,
  lastName: string,
  patronymic: string,
  birth: string,
  gender: 'male' | 'female',
  snills: string
}

const allPatients: patient[] = [
  {
    id: 1,
    lastName: 'Абрамов',
    name: 'Илья',
    patronymic: 'Тимофеевич',
    birth: '',
    gender: 'male',
    snills: '',
  },
  {
    id: 2,
    name: 'Давыдова',
    lastName: 'Анна',
    patronymic: 'Никитична',
    birth: '',
    gender: 'female',
    snills: '',
  },
  {
    id: 3,
    name: 'Киселева',
    lastName: 'Таисия',
    patronymic: 'Сергеевна',
    birth: '',
    gender: 'female',
    snills: '',
  },
  {
    id: 4,
    name: 'Чернов',
    lastName: 'Сергей',
    patronymic: 'Леонидович',
    birth: '',
    gender: 'male',
    snills: '',
  },
  {
    id: 5,
    name: 'Никитина',
    lastName: 'Вероника',
    patronymic: 'Владимировна',
    birth: '',
    gender: 'female',
    snills: '',
  },{
    id: 6,
    name: 'Крылов',
    lastName: 'Алексей',
    patronymic: 'Владимирович',
    birth: '',
    gender: 'male',
    snills: '',
  },{
    id: 7,
    name: 'Рожкова',
    lastName: 'Полина',
    patronymic: 'Николаевна',
    birth: '',
    gender: 'female',
    snills: '',
  },
]

export default allPatients
