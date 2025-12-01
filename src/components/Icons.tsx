import { SVGProps } from 'react';

const iconBase = 'stroke-current text-slate-800';

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
  </svg>
);

export const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <path d="M5 12h14" strokeLinecap="round" />
    <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MapPinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <path d="M12 21s7-5.5 7-11A7 7 0 005 10c0 5.5 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const PenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <path d="M12 19l-7 2 2-7 9.5-9.5a2.121 2.121 0 013 3L12 19z" strokeLinejoin="round" />
    <path d="M16 5l3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BanknoteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className={iconBase} {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 9h0M18 15h0" strokeLinecap="round" />
  </svg>
);
