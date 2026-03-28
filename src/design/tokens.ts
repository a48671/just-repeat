export const colorRoles = [
  ['canvas', '#f6f1e8 -> #f4f5f7'],
  ['surface', 'rgba(255, 255, 255, 0.76)'],
  ['surface-strong', '#fffdf9'],
  ['text-primary', '#1f2933'],
  ['text-secondary', '#52606d'],
  ['accent', '#7d5a38'],
  ['accent-soft', '#efe4d2'],
  ['success', '#2d6a4f'],
  ['warning', '#c77d2b'],
  ['danger', '#b94a48'],
] as const;

export const typeScale = [
  ['display', '2.25rem / 1.1'],
  ['title', '1.5rem / 1.2'],
  ['heading', '1.125rem / 1.3'],
  ['body', '1rem / 1.5'],
  ['caption', '0.875rem / 1.4'],
] as const;

export const spacingScale = ['4', '8', '12', '16', '24', '32'] as const;

export const uiComponentInventory = [
  'Button and icon-button variants',
  'Set card structure for list screen',
  'Phrase card states for active, loading, playing, and completed presentation',
  'Bottom control panel for the set screen',
  'Progress bar component for phrase and session progress',
  'Empty state block for list, favorites, and phrase-less states',
];
