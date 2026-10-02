import type { PersonalMessageCategory, PersonalMessageItem } from '../types';

export const PERSONAL_MESSAGES: PersonalMessageItem[] = [
  // 1. LeetCode Mode 🧠 (For THINK / Coding Mode)
  {
    id: 'lc-1',
    category: 'leetcode-mode',
    categoryLabel: 'LeetCode Mode 🧠',
    authorTag: '#Best Buddy Ever',
    quote: "Yoo PM, let’s show LeetCode we are talented enough to break the code before the code breaks us 😭",
    contextNote: 'LeetCode Mode',
  },
  {
    id: 'lc-2',
    category: 'leetcode-mode',
    categoryLabel: 'LeetCode Mode 🧠',
    authorTag: '#Best Buddy Ever',
    quote: "Let’s burn some tokens. They’re not paying rent anyway.",
    contextNote: 'Pre-flight warm up',
  },
  {
    id: 'lc-3',
    category: 'leetcode-mode',
    categoryLabel: 'LeetCode Mode 🧠',
    authorTag: '#Best Buddy Ever',
    quote: "Okay genius, you’ve stared at this array long enough. It’s getting awkward.",
    contextNote: 'Pointer staring contest',
  },
  {
    id: 'lc-4',
    category: 'leetcode-mode',
    categoryLabel: 'LeetCode Mode 🧠',
    authorTag: '#Best Buddy Ever',
    quote: "Don’t worry, I’m here. Unfortunately for you, that means you’re not escaping this problem that easily.",
    contextNote: 'No easy exits',
  },
  {
    id: 'lc-5',
    category: 'leetcode-mode',
    categoryLabel: 'LeetCode Mode 🧠',
    authorTag: '#Best Buddy Ever',
    quote: "You know the logic. Your Java syntax is just having a personal vendetta against you.",
    contextNote: 'Syntax bully defense',
  },
  {
    id: 'lc-6',
    category: 'leetcode-mode',
    categoryLabel: 'LeetCode Mode 🧠',
    authorTag: '#Best Buddy Ever',
    quote: "One more attempt. If it fails, we blame Java. If it passes, obviously I was the motivation.",
    contextNote: 'Standard operating procedure',
  },

  // 2. When you're cooked 😭 (For RESET Pillar)
  {
    id: 'ck-1',
    category: 'cooked',
    categoryLabel: "When You're Cooked 😭",
    authorTag: '#Best Buddy Ever',
    quote: "Okay, stop. Your brain has officially submitted a resignation letter.",
    contextNote: 'Emergency Protocol',
  },
  {
    id: 'ck-2',
    category: 'cooked',
    categoryLabel: "When You're Cooked 😭",
    authorTag: '#Best Buddy Ever',
    quote: "Emergency protocol: no LeetCode for the next 30 seconds.",
    contextNote: 'Mandatory stand-down',
  },
  {
    id: 'ck-3',
    category: 'cooked',
    categoryLabel: "When You're Cooked 😭",
    authorTag: '#Best Buddy Ever',
    quote: "Go drink water. And don't ask me to eat. I'll complain to Kanha.",
    contextNote: 'Hydration directive',
  },
  {
    id: 'ck-4',
    category: 'cooked',
    categoryLabel: "When You're Cooked 😭",
    authorTag: '#Best Buddy Ever',
    quote: "PS: You're a kid.",
    contextNote: 'Gentle reality check',
  },
  {
    id: 'ck-5',
    category: 'cooked',
    categoryLabel: "When You're Cooked 😭",
    authorTag: '#Best Buddy Ever',
    quote: "The legendary, the great, the royal ascendant asks the mere valorous pm to work on the assigned quest 🧝🏻♀",
    contextNote: 'Royal quest summons',
  },

  // 3. When you solve something 🏆 (For Tiny Wins / Solved celebration)
  {
    id: 'sl-1',
    category: 'solved',
    categoryLabel: 'When You Solve Something 🏆',
    authorTag: '#Best Buddy Ever',
    quote: "SEE??? I TOLD YOU. Actually, I didn't tell you anything. You figured it out yourself. 😌",
    contextNote: 'Vindicated intuition',
  },
  {
    id: 'sl-2',
    category: 'solved',
    categoryLabel: 'When You Solve Something 🏆',
    authorTag: '#Best Buddy Ever',
    quote: "🦚 Krishna Approved.",
    contextNote: 'Divine seal of approval',
  },
  {
    id: 'sl-3',
    category: 'solved',
    categoryLabel: 'When You Solve Something 🏆',
    authorTag: '#Best Buddy Ever',
    quote: "Okay now calm down. One accepted submission does not make you a competitive programming god. ...but it was pretty good.",
    contextNote: 'Pride check with hype',
  },

  // 4. When you fail 😭 (For Wrong Answer / Lost state)
  {
    id: 'fl-1',
    category: 'failed',
    categoryLabel: 'When You Fail 😭',
    authorTag: '#Best Buddy Ever',
    quote: "Wrong Answer. Character development. Try again.",
    contextNote: 'Anime protagonist arc',
  },
  {
    id: 'fl-2',
    category: 'failed',
    categoryLabel: 'When You Fail 😭',
    authorTag: '#Best Buddy Ever',
    quote: "And no, we're not calling ourselves stupid because an array won one round. The array got lucky.",
    contextNote: 'Array slander',
  },

  // 5. When you need motivation (For Dashboard / Home)
  {
    id: 'mv-1',
    category: 'motivation',
    categoryLabel: 'When You Need Motivation',
    authorTag: '#Best Buddy Ever',
    quote: "You are literally capable of doing this.",
    contextNote: 'Undisputed fact',
  },
  {
    id: 'mv-2',
    category: 'motivation',
    categoryLabel: 'When You Need Motivation',
    authorTag: '#Best Buddy Ever',
    quote: "Now stop looking at the screen like the solution is going to feel guilty and reveal itself.",
    contextNote: 'Proactive nudge',
  },
  {
    id: 'mv-3',
    category: 'motivation',
    categoryLabel: 'When You Need Motivation',
    authorTag: '#Best Buddy Ever',
    quote: "Think. Nudge. Try. Again. You've got you.",
    contextNote: 'Core mantra',
  },

  // 6. Random messages (For Play / Global Buddy Notes)
  {
    id: 'rn-1',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Sleep early, else you'll sleep in SP class",
    contextNote: 'Academic advisory',
  },
  {
    id: 'rn-2',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Your brain is loading. Please wait...",
    contextNote: 'System status',
  },
  {
    id: 'rn-3',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Veer has encountered a runtime error called 'overthinking.' Relax, you can do it",
    contextNote: 'Exception caught',
  },
  {
    id: 'rn-4',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Kanha has been notified about you.",
    contextNote: 'Spiritual escalation',
  },
  {
    id: 'rn-5',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "If the algorithm makes no sense, pretend you're explaining it to me. Somehow you always become smarter when you have to explain it.",
    contextNote: 'Feynman trick',
  },
  {
    id: 'rn-6',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Congratulations. For... idk what",
    contextNote: 'Unconditional cheering',
  },
  {
    id: 'rn-7',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Pay your developer some salary",
    contextNote: 'Invoicing best buddy',
  },
  {
    id: 'rn-8',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "PS: you're still a kid.",
    contextNote: 'Never forget',
  },
  {
    id: 'rn-9',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "🦚 Kanha Approved.",
    contextNote: 'Certified peaceful',
  },
  {
    id: 'rn-10',
    category: 'random',
    categoryLabel: 'Random Buddy Banter',
    authorTag: '#Best Buddy Ever',
    quote: "Completely useless achievement. I'm proud of you anyway.",
    contextNote: 'Proud friend moments',
  },

  // 7. Curated Krishna-Approved Messages (Gemma must NEVER invent quotations, only request by ID)
  {
    id: 'krishna_approved_01',
    category: 'krishna',
    categoryLabel: 'Krishna Approved 🦚',
    authorTag: 'Gita Philosophy (Karmayoga)',
    quote: 'Focus entirely on the action, the logic, and the effort right in front of you. Release your anxiety about the verdict, the offer letter, or the red test cases.',
    contextNote: 'Based on Gita 2.47 • Steadiness in Action',
  },
  {
    id: 'krishna_approved_02',
    category: 'krishna',
    categoryLabel: 'Krishna Approved 🦚',
    authorTag: 'Gita Philosophy (Equanimity)',
    quote: 'The mind can be a fierce adversary when troubled with doubt, but it is your greatest ally when stilled by patience and steady breath.',
    contextNote: 'Based on Gita 6.5 • Mind mastery through patience',
  },
  {
    id: 'krishna_approved_03',
    category: 'krishna',
    categoryLabel: 'Krishna Approved 🦚',
    authorTag: 'Gita Philosophy (Detachment)',
    quote: 'Do not grieve over a failed approach or an unoptimal solution. Every dead end simply clarifies the path of the true algorithm.',
    contextNote: 'Equanimity in trial and error',
  },
  {
    id: 'krishna_approved_04',
    category: 'krishna',
    categoryLabel: 'Krishna Approved 🦚',
    authorTag: 'Gita Philosophy (Perseverance)',
    quote: 'Little by little, with gentle determination and unwavering focus, let the mind find its quiet strength. No genuine effort in learning is ever lost.',
    contextNote: 'Based on Gita 6.25 & 2.40 • Incremental progress',
  },
];

export const getMessagesByCategory = (category: PersonalMessageCategory) => {
  return PERSONAL_MESSAGES.filter((m) => m.category === category);
};

export const getMessageById = (id: string): PersonalMessageItem | undefined => {
  return PERSONAL_MESSAGES.find((m) => m.id === id);
};
