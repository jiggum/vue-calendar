import { DayOfTheWeeks } from '@/consts/DayOfTheWeekTypes'

export const getYear = (ts: number) => new Date(ts).getFullYear()

export const getMonth = (ts: number) => new Date(ts).getMonth() + 1

export const getDate = (ts: number) => new Date(ts).getDate()

export const getDay = (ts: number) => DayOfTheWeeks[new Date(ts).getDay()]

export const dateToTimestamp = ({
  year,
  month,
  date,
}: {
  year: number;
  month: number;
  date: number;
}) => new Date(year, month - 1, date).valueOf()

export const timestampToDate = (ts: number) => ({
  year: getYear(ts),
  month: getMonth(ts),
  date: getDate(ts),
  day: getDay(ts),
})
