import moment from 'moment-timezone'

export const getTodayString = () => getDateInMST().format('YYYY-MM-DD')

export const getSecondsUntilMidnight = () => {
  const now = moment()
  const midnight = now.clone().add(1, 'day').startOf('day')
  return midnight.diff(now, 'seconds')
}

export const getDateInMST = () => {
  return moment().tz('America/Edmonton')
}
