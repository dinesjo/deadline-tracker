export function daysFromNow(date) {
  if (!date) { return null }
  return Math.ceil(
    (new Date(date).getTime() - new Date().getTime()) / 86400000
  );
}