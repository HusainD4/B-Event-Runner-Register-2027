const WIB_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function getWibDateKey(date: Date): string {
  const parts = WIB_DATE_FORMATTER.formatToParts(date);
  const year = parts.find(part => part.type === 'year')?.value;
  const month = parts.find(part => part.type === 'month')?.value;
  const day = parts.find(part => part.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

export type EventTimerPhase = 'UPCOMING' | 'RACE_DAY' | 'COMPLETED';
export type EventRegistrationPhase = EventTimerPhase | 'CLOSED';

export function getEventTimerPhase(targetDate: Date | null, now = new Date()): EventTimerPhase {
  if (!targetDate || Number.isNaN(targetDate.getTime()) || now < targetDate) return 'UPCOMING';
  return getWibDateKey(now) === getWibDateKey(targetDate) ? 'RACE_DAY' : 'COMPLETED';
}

export function getEventRegistrationStatus(
  targetDate: Date | null,
  manuallyClosed = false,
  now = new Date()
) {
  const timerPhase = getEventTimerPhase(targetDate, now);
  const registrationClosedByTimer = timerPhase !== 'UPCOMING';

  return {
    registrationClosed: manuallyClosed || registrationClosedByTimer,
    registrationClosedByTimer,
    registrationPhase: timerPhase === 'UPCOMING' && manuallyClosed ? 'CLOSED' : timerPhase,
  } as const;
}
