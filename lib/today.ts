import { programmeById, welcomeSession, WEEKS, type Day, type Programme, type Session } from '../data/programmes';
import { dayIndex, weekIndex } from './week';

export type Today = { programme: Programme; week: number; day: number; days: Day[]; session: Session | null; isWelcome: boolean; rest: boolean };

/** What the home screen should offer right now. */
export function todayFor(programmeId: string | null, startKey: string | null, totalWorkouts: number, completed: string[]): Today | null {
  const programme = programmeById(programmeId);
  if (!programme) return null;
  const week = weekIndex(startKey, WEEKS);
  const day = dayIndex();
  const days = programme.weeks[week];
  if (totalWorkouts === 0) return { programme, week, day, days, session: welcomeSession(programme), isWelcome: true, rest: false };
  const today = days[day];
  if (!today.rest) return { programme, week, day, days, session: today.session, isWelcome: false, rest: false };
  // Rest day: offer the next session of the week that is not done yet, if there is one.
  const next = days.slice(day + 1).find((d) => !d.rest && !completed.includes(d.session.key));
  return { programme, week, day, days, session: next && !next.rest ? next.session : null, isWelcome: false, rest: true };
}
