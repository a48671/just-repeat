import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhraseCard } from './phrase-card';

const meta = {
  title: 'Shared/PhraseCard',
  component: PhraseCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    text: 'Hello. My name is Andrey.',
  },
} satisfies Meta<typeof PhraseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Active: Story = {
  args: {
    state: 'active',
  },
};

export const Playing: Story = {
  args: {
    state: 'playing',
    playbackProgress: 42,
  },
};

export const CompletedFavorite: Story = {
  args: {
    state: 'completed',
    favorite: true,
    playbackProgress: 100,
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};