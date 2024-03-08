import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export const getBackendUrl = (path) => {
  return `http://${import.meta.env.BACKEND_URL || 'localhost'}:10000${path}`;
};
export const getPageTitle = (title) => `${title} | H.E.I.S.E.N.B.E.R.G.`;

export const loadingPageTitle = getPageTitle('Loading Lab...');
