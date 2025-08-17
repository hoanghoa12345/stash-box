import { ApiError } from '@/types';
import { ToastInstance } from '@/types';

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}

export const handleError = (toast: ToastInstance, err: Error) => {
  const errDetail = (err as ApiError).response?.data.msg;
  let errorMessage = '';
  if (typeof errDetail === 'string') {
    errorMessage = errDetail;
  } else {
    errorMessage = err.message || 'Something went wrong.';
  }

  toast.error(errorMessage);
};

export const themeOptions = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Cool and professional',
    primary: 'bg-blue-500',
    secondary: 'bg-blue-100',
    accent: 'bg-blue-600',
    primary_hsl: '217 91% 60%',
    secondary_hsl: '214 95% 93%',
    accent_hsl: '221 83% 53%',
  },
  {
    id: 'green',
    name: 'Forest Green',
    description: 'Natural and calming',
    primary: 'bg-green-500',
    secondary: 'bg-green-100',
    accent: 'bg-green-600',
    primary_hsl: '142 71% 45%',
    secondary_hsl: '141 84% 93%',
    accent_hsl: '142 76% 36%',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    description: 'Creative and modern',
    primary: 'bg-purple-500',
    secondary: 'bg-purple-100',
    accent: 'bg-purple-600',
    primary_hsl: '258 90% 66%',
    secondary_hsl: '269 100% 95%',
    accent_hsl: '262 83% 58%',
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    primary: 'bg-orange-500',
    secondary: 'bg-orange-100',
    accent: 'bg-orange-600',
    primary_hsl: '25 95% 53%',
    secondary_hsl: '34 100% 92%',
    accent_hsl: '21 90% 48%',
  },
  {
    id: 'pink',
    name: 'Rose Pink',
    description: 'Soft and elegant',
    primary: 'bg-pink-500',
    secondary: 'bg-pink-100',
    accent: 'bg-pink-600',
    primary_hsl: '330 81% 60%',
    secondary_hsl: '326 78% 95%',
    accent_hsl: '333 71% 51%',
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    description: 'Fresh and vibrant',
    primary: 'bg-teal-500',
    secondary: 'bg-teal-100',
    accent: 'bg-teal-600',
    primary_hsl: '173 80% 40%',
    secondary_hsl: '167 85% 89%',
    accent_hsl: '175 84% 32%',
  },
];

export const fontOptions = [
  {
    id: 'inter',
    name: 'Inter',
    description: 'Modern and readable',
    className: 'font-sans',
    preview: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    description: 'Clean and friendly',
    className: 'font-sans',
    preview: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    description: 'Geometric and modern',
    className: 'font-sans',
    preview: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'source-serif',
    name: 'Source Serif Pro',
    description: 'Traditional and elegant',
    className: 'font-serif',
    preview: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    description: 'Stylish and distinctive',
    className: 'font-serif',
    preview: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    description: 'Perfect for code',
    className: 'font-mono',
    preview: 'The quick brown fox jumps over the lazy dog',
  },
];
