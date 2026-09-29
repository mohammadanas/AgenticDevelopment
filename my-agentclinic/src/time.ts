export type LocalTimeResult =
  | { ok: true; iso: string; epochMs: number }
  | { ok: false; reason: "invalid" | "nonexistent" | "ambiguous" };

const partsFormatter = (timeZone: string) => new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export const resolveTimeZone = (configured = process.env.TZ): string => {
  const timeZone = configured?.trim() || Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!timeZone) throw new Error("AgentClinic could not resolve an IANA timezone. Set TZ before startup.");
  try {
    partsFormatter(timeZone).format(new Date());
  } catch {
    throw new Error(`AgentClinic cannot use the configured timezone: ${timeZone}`);
  }
  return timeZone;
};

const localParts = (epochMs: number, timeZone: string) => Object.fromEntries(
  partsFormatter(timeZone).formatToParts(epochMs).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]),
);

export const parseLocalDateTime = (value: string, timeZone: string): LocalTimeResult => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return { ok: false, reason: "invalid" };
  const [, year, month, day, hour, minute] = match;
  const values = [year, month, day, hour, minute].map(Number);
  const [y, mo, d, h, mi] = values;
  const wallClockUtc = Date.UTC(y, mo - 1, d, h, mi, 0);
  const check = new Date(wallClockUtc);
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d || h > 23 || mi > 59) {
    return { ok: false, reason: "invalid" };
  }

  const candidates: number[] = [];
  for (let offsetMinutes = -14 * 60; offsetMinutes <= 14 * 60; offsetMinutes += 15) {
    const epochMs = wallClockUtc - offsetMinutes * 60_000;
    const parts = localParts(epochMs, timeZone);
    if (parts.year === year && parts.month === month && parts.day === day && parts.hour === hour && parts.minute === minute && parts.second === "00") {
      candidates.push(epochMs);
    }
  }
  const unique = [...new Set(candidates)];
  if (unique.length === 0) return { ok: false, reason: "nonexistent" };
  if (unique.length > 1) return { ok: false, reason: "ambiguous" };

  const epochMs = unique[0];
  const offsetMinutes = Math.round((wallClockUtc - epochMs) / 60_000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const offset = `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
  return { ok: true, epochMs, iso: `${value}:00${offset}` };
};

export const formatDateTime = (value: string, timeZone: string) => new Intl.DateTimeFormat("en", {
  timeZone,
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));
