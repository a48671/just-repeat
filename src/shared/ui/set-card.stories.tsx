import type { Meta, StoryObj } from '@storybook/react-vite';
import { SetCard } from './set-card';

const meta = {
  title: 'Shared/SetCard',
  component: SetCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Universal Self Introduction',
    description: 'A compact set of phrases for introducing yourself naturally in English.',
    phraseCount: 33,
  },
} satisfies Meta<typeof SetCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLastInteraction: Story = {
  args: {
    lastInteraction: 'Last interaction 14 min ago',
  },
};

export const Interactive: Story = {
  args: {
    lastInteraction: 'Last interaction 2 h ago',
    onOpen: () => {},
  },
};