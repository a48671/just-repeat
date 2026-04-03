import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomControlPanel } from './bottom-control-panel';

const meta = {
  title: 'Shared/BottomControlPanel',
  component: BottomControlPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#f3f5f8', paddingBottom: 180 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    progressCompleted: 12,
    progressLabel: '12/33 in current list',
    progressTotal: 33,
  },
} satisfies Meta<typeof BottomControlPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ContinueState: Story = {
  args: {
    playAllLabel: 'Continue',
  },
};

export const PlayingState: Story = {
  args: {
    playAllActive: true,
  },
};

export const FavoritesFilterEnabled: Story = {
  args: {
    favoritesEnabled: true,
  },
};