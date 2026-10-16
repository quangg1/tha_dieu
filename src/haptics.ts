/** Short vibrations on phones that support them (Android browsers); silently nothing elsewhere. */
export function buzz(pattern: number | number[]) {
  try {
    if (matchMedia('(pointer: coarse)').matches) navigator.vibrate?.(pattern);
  } catch {
    /* no vibration */
  }
}
