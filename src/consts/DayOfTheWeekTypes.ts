enum DayOfTheWeekTypes {
  SUN = 'SUN',
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
}

export const DayOfTheWeeks = [
  DayOfTheWeekTypes.SUN,
  DayOfTheWeekTypes.MON,
  DayOfTheWeekTypes.TUE,
  DayOfTheWeekTypes.WED,
  DayOfTheWeekTypes.THU,
  DayOfTheWeekTypes.FRI,
  DayOfTheWeekTypes.SAT,
] as const

export const DayOfTheWeekI18nMap = {
  [DayOfTheWeekTypes.SUN]: 'time.sun',
  [DayOfTheWeekTypes.MON]: 'time.mon',
  [DayOfTheWeekTypes.TUE]: 'time.tue',
  [DayOfTheWeekTypes.WED]: 'time.wed',
  [DayOfTheWeekTypes.THU]: 'time.thu',
  [DayOfTheWeekTypes.FRI]: 'time.fri',
  [DayOfTheWeekTypes.SAT]: 'time.sat',
} as const

export default DayOfTheWeekTypes
