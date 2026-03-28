import type { Meta, StoryObj } from '@storybook/react-vite';
import { SetsListScreen } from './sets-list-screen';

const demoSets = [
  {
    id: 'self-intro',
    title: 'Universal Self Introduction',
    description: 'A compact set of phrases for introducing yourself naturally in English.',
    phraseCount: 33,
    sourceFile: 'sets/the_universal_self_introduction_script.json',
  },
  {
    id: 'basic-002',
    title: 'Basic Everyday Phrases',
    description: 'Short practical phrases for common everyday conversations.',
    phraseCount: 18,
    sourceFile: 'sets/set_basic_002.json',
  },
  {
    id: 'travel',
    title: 'Travel Check-In',
    description: 'Useful phrases for airports, hotels, and transport situations.',
    phraseCount: 12,
    sourceFile: 'sets/travel_check_in.json',
  },
];

const meta = {
  title: 'Features/SetsListScreen',
  component: SetsListScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: '#f3f5f8' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    errorMessage: null,
    isLoading: false,
    lastInteractionBySetId: {
      'self-intro': 'Last interaction 14 min ago',
      'basic-002': 'Last interaction 2 h ago',
      travel: null,
    },
    onOpenSet: () => {},
    setSummaries: demoSets,
  },
} satisfies Meta<typeof SetsListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    setSummaries: [],
    lastInteractionBySetId: {},
  },
};

export const Empty: Story = {
  args: {
    setSummaries: [],
    lastInteractionBySetId: {},
  },
};

export const Error: Story = {
  args: {
    errorMessage: 'Unable to load the bundled phrase sets.',
    setSummaries: [],
    lastInteractionBySetId: {},
  },
};