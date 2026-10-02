import type { ArcadeReward } from '../types';

export const ARCADE_REWARDS: ArcadeReward[] = [
  {
    id: 'rew-samosa',
    name: 'Canteen Samosa Treat Pass',
    cost: 50,
    icon: '🥐',
    tagline: 'Motu approved! Exchange for one piping hot canteen samosa.',
    unlocked: false,
  },
  {
    id: 'rew-chai',
    name: 'Tapri Cutting Chai Pass',
    cost: 100,
    icon: '☕',
    tagline: 'One steaming cup of ginger-elaichi chai with your study buddy.',
    unlocked: false,
  },
  {
    id: 'rew-nap',
    name: '20-min Guilt-Free Power Nap',
    cost: 150,
    icon: '😴',
    tagline: 'Zero guilt. Let your brain cache invalidate and recharge.',
    unlocked: false,
  },
  {
    id: 'rew-kanha',
    name: 'Kanha Approved Immunity Badge',
    cost: 250,
    icon: '🦚',
    tagline: 'Divine protection against off-by-one errors and SegFaults.',
    unlocked: false,
  },
  {
    id: 'rew-evil-algo',
    name: 'Defeated Evil Algorithm Dept Trophy',
    cost: 400,
    icon: '👑',
    tagline: 'Official bragging rights over the array that tried to intimidate you.',
    unlocked: false,
  },
  {
    id: 'rew-arcade-night',
    name: 'Hostel Arcade Gaming Pass',
    cost: 500,
    icon: '🎮',
    tagline: 'One uninterrupted hour of gaming. No LeetCode allowed.',
    unlocked: false,
  },
];
