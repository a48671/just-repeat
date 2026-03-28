import { Play } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Play All',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Continue',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Back',
    variant: 'ghost',
  },
};

export const IconOnly: Story = {
  args: {
    'aria-label': 'Play phrase',
    children: <Play aria-hidden="true" size={16} strokeWidth={2} />,
    variant: 'icon',
  },
};