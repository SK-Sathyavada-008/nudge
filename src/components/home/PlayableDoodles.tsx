import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle } from 'lucide-react';

interface DoodleCharacter {
  id: string;
  name: string;
  role: string;
  color: string;
  bgGlow: string;
  voiceLines: string[];
  emoji: string;
  renderSvg: (isWiggling: boolean) => React.ReactNode;
}

export const PlayableDoodles: React.FC = () => {
  const [activeSpeech, setActiveSpeech] = useState<{ charId: string; text: string } | null>({
    charId: 'bean',
    text: "Thumbs up Veer! *wiggles eyebrows* Click us anytime for a giggle! 👍✨",
  });
  const [wigglingChar, setWigglingChar] = useState<string | null>(null);

  const handleCharClick = (char: DoodleCharacter) => {
    // Pick random voice line
    const randomLine = char.voiceLines[Math.floor(Math.random() * char.voiceLines.length)];
    setActiveSpeech({ charId: char.id, text: randomLine });
    setWigglingChar(char.id);

    // Trigger subtle celebratory particles
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#34d399'],
    });

    setTimeout(() => {
      setWigglingChar(null);
    }, 800);
  };

  const characters: DoodleCharacter[] = [
    {
      id: 'bean',
      name: 'Mr. Bean',
      role: 'Chief Morale Officer',
      color: '#f59e0b',
      bgGlow: 'hover:border-amber-400/60 hover:shadow-amber-500/25',
      emoji: '👔',
      voiceLines: [
        'Thumbs up! *wiggles eyebrows mischievously* 👍✨',
        'Teddy! Look, Veer is about to crack this problem! 🧸',
        '*adjusts skinny red tie* Problem solved. Now where is the Mini car?',
        'Brilliant! Simply brilliant. Even I could understand that logic.',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-amber-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 rotate-12' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Bean's Face */}
          <circle cx="26" cy="46" r="6" />
          <circle cx="74" cy="46" r="6" />
          <path d="M 32 40 C 30 22 70 22 68 40 C 70 65 60 76 50 76 C 40 76 30 65 32 40 Z" />
          {/* Eyebrows */}
          <path d="M 37 32 Q 44 26 48 33" strokeWidth="3" />
          <path d="M 52 33 Q 56 26 63 32" strokeWidth="3" />
          {/* Eyes */}
          <circle cx="43" cy="38" r="3" fill="#f59e0b" />
          <circle cx="57" cy="38" r="3" fill="#f59e0b" />
          {/* Nose */}
          <path d="M 50 38 L 52 50 L 46 52" />
          {/* Smirk */}
          <path d="M 42 60 Q 52 64 60 58" />
          {/* Skinny Tie */}
          <polygon points="50,76 46,92 50,98 54,92" fill="#ef4444" stroke="#ef4444" />
        </svg>
      ),
    },
    {
      id: 'motu',
      name: 'Motu',
      role: 'Samosa & Energy Boss',
      color: '#38bdf8',
      bgGlow: 'hover:border-sky-400/60 hover:shadow-sky-500/25',
      emoji: '🥟',
      voiceLines: [
        'Khali pet dimag ki batti nahi jalti! Samosa do pehle! 🥟😋',
        'Veer bro, solve this problem and let’s ask SK for a dhaba feast!',
        'Wah! Samosa power unlocked! Now your brain is 100% charged! ⚡',
        'Patlu ko bolo complexity reduce kare, mujhe bhook lagi hai!',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-sky-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 -rotate-12' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Motu's round head */}
          <circle cx="50" cy="45" r="28" />
          {/* Mustache */}
          <path d="M 35 48 Q 50 42 50 50 Q 50 42 65 48 Q 58 56 50 52 Q 42 56 35 48 Z" fill="#38bdf8" />
          {/* Eyes */}
          <circle cx="42" cy="38" r="3" fill="#38bdf8" />
          <circle cx="58" cy="38" r="3" fill="#38bdf8" />
          {/* Big smiling mouth */}
          <path d="M 43 56 Q 50 63 57 56" />
          {/* Hair tuft */}
          <path d="M 50 17 Q 53 10 57 15" />
          {/* Vest collar */}
          <path d="M 34 72 Q 50 66 66 72 L 72 95 L 28 95 Z" />
        </svg>
      ),
    },
    {
      id: 'patlu',
      name: 'Patlu',
      role: 'Algorithm Invariant Advisor',
      color: '#f43f5e',
      bgGlow: 'hover:border-rose-400/60 hover:shadow-rose-500/25',
      emoji: '👓',
      voiceLines: [
        'Idea! Agar sliding window lagayein toh time complexity O(N) ho jayegi! 💡',
        'Motu shaant raho! Veer is actively calculating invariants.',
        'Always check the array bounds: left <= right. Never panic!',
        'According to my calculations, you are 99% close to the solution! 🤓',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-rose-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 rotate-6' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Patlu's slender head */}
          <ellipse cx="50" cy="48" rx="20" ry="26" />
          {/* Iconic round spectacles */}
          <circle cx="42" cy="44" r="8" />
          <circle cx="58" cy="44" r="8" />
          <line x1="50" y1="44" x2="50" y2="44" />
          <line x1="34" y1="44" x2="28" y2="40" />
          <line x1="66" y1="44" x2="72" y2="40" />
          {/* Neck & Kurta collar */}
          <path d="M 44 74 L 44 86 M 56 74 L 56 86" />
          <path d="M 36 86 L 64 86 L 68 98 L 32 98 Z" />
          {/* Single strand hair */}
          <path d="M 50 22 Q 48 10 42 12" />
        </svg>
      ),
    },
    {
      id: 'nick',
      name: 'Nick Wilde',
      role: 'Confidence Strategist',
      color: '#fb923c',
      bgGlow: 'hover:border-orange-400/60 hover:shadow-orange-500/25',
      emoji: '🦊',
      voiceLines: [
        'It’s called a hustle, sweetheart. Solve that array. 🦊😏',
        'Never let them see that you don’t know how to code the edge cases.',
        'You look like someone who can turn O(N^2) into O(1) in their sleep.',
        'Smooth move, genius. Now collect your treat from SK.',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-orange-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 -rotate-6' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Fox Ears */}
          <polygon points="30,40 18,16 42,26" />
          <polygon points="70,40 82,16 58,26" />
          {/* Fox Head & Muzzle */}
          <path d="M 28 42 C 24 55 36 68 50 78 C 64 68 76 55 72 42 C 65 34 35 34 28 42 Z" />
          {/* Fox nose */}
          <polygon points="46,72 54,72 50,78" fill="#fb923c" />
          {/* Sly eyes */}
          <path d="M 36 46 Q 44 44 46 50" />
          <circle cx="42" cy="48" r="2" fill="#fb923c" />
          <path d="M 64 46 Q 56 44 54 50" />
          <circle cx="58" cy="48" r="2" fill="#fb923c" />
          {/* Sly smirk */}
          <path d="M 45 66 Q 50 68 58 64" />
        </svg>
      ),
    },
    {
      id: 'teddy',
      name: 'Teddy Bear',
      role: 'Knitted Emotional Shield',
      color: '#f472b6',
      bgGlow: 'hover:border-pink-400/60 hover:shadow-pink-500/25',
      emoji: '🧸',
      voiceLines: [
        'Squeak! *comfort hug* Take a breath Veer, you got this. 🧸',
        'Stuck? It is okay! Take 2 minutes and pet Teddy.',
        'Knitted emotional shield activated! No compiler error can hurt you.',
        'Mr. Bean says you’re doing great. I agree! 💕',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-pink-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 rotate-12' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Teddy ears */}
          <circle cx="34" cy="30" r="7" />
          <circle cx="66" cy="30" r="7" />
          {/* Head */}
          <circle cx="50" cy="44" r="20" />
          {/* Button cross eyes */}
          <path d="M 41 38 L 45 42 M 45 38 L 41 42" strokeWidth="2" />
          <path d="M 55 38 L 59 42 M 59 38 L 55 42" strokeWidth="2" />
          {/* Stitched snout & nose */}
          <ellipse cx="50" cy="49" rx="6" ry="4" />
          <circle cx="50" cy="48" r="2" fill="#f472b6" />
          {/* Body */}
          <path d="M 38 64 C 36 78 64 78 62 64 Z" />
        </svg>
      ),
    },
    {
      id: 'laptop',
      name: 'Byte Machine',
      role: 'O(1) Memory Engine',
      color: '#34d399',
      bgGlow: 'hover:border-emerald-400/60 hover:shadow-emerald-500/25',
      emoji: '💻',
      voiceLines: [
        'Compiling... 0 errors, 100% friend power. 💻⚡',
        'RAM initialized. O(1) lookups only. No O(N^2) garbage permitted!',
        'Beep boop! Pointers are aligned and ready to execute.',
        'NASA has been notified of your code prowess! 🚀',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-emerald-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 -rotate-12' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Laptop Screen */}
          <rect x="22" y="26" width="56" height="38" rx="4" />
          {/* Code brackets */}
          <path d="M 42 40 L 38 45 L 42 50" />
          <path d="M 58 40 L 62 45 L 58 50" />
          <line x1="53" y1="40" x2="47" y2="50" />
          {/* Keyboard base */}
          <polygon points="16,66 84,66 88,72 12,72" />
        </svg>
      ),
    },
    {
      id: 'gym',
      name: 'DSA Dumbbell',
      role: 'Heavy Logic Lifting',
      color: '#a855f7',
      bgGlow: 'hover:border-purple-400/60 hover:shadow-purple-500/25',
      emoji: '🏋️',
      voiceLines: [
        'Pumping arrays and lifting pointer weights! 💪',
        'No pain, no O(1)! 3 sets of sliding window daily.',
        'Your brain muscles are looking jacked today, Veer!',
        'Drop the brute force! Lift the optimal data structure!',
      ],
      renderSvg: (wiggling) => (
        <svg
          viewBox="0 0 100 100"
          className={`w-20 h-20 sm:w-24 sm:h-24 stroke-purple-400 transition-transform duration-300 ${
            wiggling ? 'scale-115 rotate-12' : 'group-hover:scale-110'
          }`}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left Weight */}
          <rect x="18" y="32" width="10" height="36" rx="3" />
          <rect x="28" y="38" width="6" height="24" rx="2" />
          {/* Bar */}
          <rect x="34" y="47" width="32" height="6" rx="1" fill="#a855f7" />
          {/* Right Weight */}
          <rect x="66" y="38" width="6" height="24" rx="2" />
          <rect x="72" y="32" width="10" height="36" rx="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative py-4 space-y-6">
      {/* Speech Bubble / Comic Reaction Banner */}
      {activeSpeech && (
        <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="relative rounded-2xl border-2 border-indigo-500/40 bg-slate-900/90 p-4 shadow-xl shadow-indigo-500/10 backdrop-blur-xl text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>Doodle Talk</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white pt-1">
              &ldquo;{activeSpeech.text}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Interactive Characters Grid */}
      <div>
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
            <span>Tap any character to play with them!</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 max-w-5xl mx-auto px-2">
          {characters.map((char) => {
            const isWiggling = wigglingChar === char.id;
            const isSelected = activeSpeech?.charId === char.id;

            return (
              <button
                key={char.id}
                onClick={() => handleCharClick(char)}
                title={`Click ${char.name} for playful dialogue!`}
                className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 bg-slate-900/60 backdrop-blur-md transition-all duration-300 cursor-pointer ${
                  char.bgGlow
                } ${
                  isSelected
                    ? 'border-indigo-400 bg-slate-900 shadow-lg shadow-indigo-500/20 scale-105'
                    : 'border-slate-800 hover:scale-105 active:scale-95'
                }`}
              >
                {/* SVG Character */}
                <div className="relative">
                  {char.renderSvg(isWiggling)}
                </div>

                {/* Name & Role */}
                <span className="mt-2 text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                  {char.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {char.emoji}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
