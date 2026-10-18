// Small stroke icons for buttons, drawn to sit on the text baseline. They replace typed symbols (✕ ✉ ✓ ⚑ ▲),
// which every font draws differently and some phones swap for colour emoji.
type P = { size?: number };
const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true });

export const CloseIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const CheckIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const FlagIcon = ({ size = 15 }: P) => (
  <svg {...base(size)}>
    <path d="M6 21V4M6 4h10l-2 4 2 4H6" />
  </svg>
);
export const LetterIcon = ({ size = 18 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);
/** A kite on its string: the "take off" mark on the main buttons. */
export const KiteIcon = ({ size = 22 }: P) => (
  <svg {...base(size)} strokeWidth={2}>
    <path d="M15 2l6 6.5-6 8-6-8z" fill="currentColor" fillOpacity=".3" />
    <path d="M15 2v14.5M9 8.5h12" strokeWidth={1.4} />
    <path d="M15 16.5c-.5 2-2.5 3.5-5 3S5.5 20 3 22" strokeWidth={1.7} />
    <path d="M11.5 19.6l-1.6-1.4M8 20.3l-1-1.8" strokeWidth={1.5} />
  </svg>
);
