import {
  getDate,
  getDay,
  getMonth,
  getYear,
  timestampToDate,
  dateToTimestamp,
} from '@/utils/dateUtils'
import DayOfTheWeekTypes from '@/consts/DayOfTheWeekTypes'

describe('dateUtils', () => {
  const time = Date.UTC(
    2020,
    7,
    9,
    19,
    30 + new Date().getTimezoneOffset(),
  ).valueOf()
  test('getDate', () => {
    expect(getDate(time)).toBe(9)
  })
  test('getDay', () => {
    expect(getDay(time)).toBe(DayOfTheWeekTypes.SUN)
  })
  test('getMonth', () => {
    expect(getMonth(time)).toBe(8)
  })
  test('getYear', () => {
    expect(getYear(time)).toBe(2020)
  })
  test('timestampToDate', () => {
    expect(timestampToDate(time)).toEqual({
      year: 2020,
      month: 8,
      date: 9,
      day: DayOfTheWeekTypes.SUN,
    })
  })
  test('dateToTimestamp', () => {
    expect(dateToTimestamp({ year: 2020, month: 3, date: 5 })).toBe(
      new Date(2020, 2, 5).valueOf(),
    )
    expect(dateToTimestamp({ year: 1997, month: 6, date: 24 })).toBe(
      new Date(1997, 5, 24).valueOf(),
    )
  })
})
