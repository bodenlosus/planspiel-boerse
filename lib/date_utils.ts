export const toISODateOnly = (date: Date) => date.toISOString().slice(0, 10);

export const getCurrentDate = () => new Date();

export const getDateCertainDaysAgo = (days: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - days);
  return date;
};

export const getDateOneWeekAgo = () => getDateCertainDaysAgo(7);

export const getTimeBetweenDates = (startDate: Date, endDate: Date) => {
  const msPerDay = 1000 * 3600 * 24
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.round(diffTime / msPerDay);
};
