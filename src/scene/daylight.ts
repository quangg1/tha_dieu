// The village sky follows the player's own clock: sun by day, a warm dusk, the moon and stars at night.

/** Hour of day on the player's device, overridable with ?hour=21 for checking a look. */
export function localHour(d = new Date()): number {
  try {
    const q = new URLSearchParams(location.search).get('hour');
    if (q != null && q !== '' && !Number.isNaN(Number(q))) return ((Number(q) % 24) + 24) % 24;
  } catch {
    /* no location: use the clock */
  }
  return d.getHours() + d.getMinutes() / 60;
}

const ramp = (x: number, a: number, b: number) => Math.max(0, Math.min(1, (x - a) / (b - a)));

/** night: 0 full day … 1 full night. dusk: 0 … 1 at the warm hour of sunrise or sunset. */
export function daylight(h = localHour()) {
  // Dark before 5:00, light by 6:30; light until 17:30, dark by 19:00.
  const night = h < 12 ? 1 - ramp(h, 5, 6.5) : ramp(h, 17.5, 19);
  const dusk = Math.max(0, 1 - Math.abs(h - 6) / 1.2, 1 - Math.abs(h - 18.2) / 1.3);
  return { night, dusk };
}

export const isNight = () => daylight().night > 0.5;
