import React from 'react';

export const BackgroundDoodles: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Neon Doodles Wallpaper from User Reference (Mr. Bean, Motu Patlu, Nick Wilde, Laptop, Treats, Gym, Badminton) */}
      <div 
        className="absolute inset-0 bg-repeat bg-center opacity-30 mix-blend-screen transition-opacity duration-700"
        style={{
          backgroundImage: "url('/assets/doodle_background.png')",
          backgroundSize: '1600px 900px',
        }}
      />

      {/* 2. Soft Vignette to keep text crystal clear */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0b0f19]/40 to-[#0b0f19]/90" />

      {/* 3. Floating Interactive Micro-Doodles Layer */}
      <div className="absolute inset-0 opacity-[0.035] transition-opacity">
        {/* Motu with Samosa doodle - Top Left */}
        <div className="absolute -top-4 left-6 sm:left-16 animate-float-slow">
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Motu's round head */}
          <circle cx="50" cy="45" r="28" />
          {/* Motu's famous mustache */}
          <path d="M 35 48 Q 50 42 50 50 Q 50 42 65 48 Q 58 56 50 52 Q 42 56 35 48 Z" fill="currentColor" />
          {/* Eyes */}
          <circle cx="42" cy="38" r="2.5" fill="currentColor" />
          <circle cx="58" cy="38" r="2.5" fill="currentColor" />
          {/* Big smiling mouth */}
          <path d="M 43 56 Q 50 63 57 56" />
          {/* Motu hair tuft */}
          <path d="M 50 17 Q 53 10 57 15" />
          {/* Motu vest / collar */}
          <path d="M 34 72 Q 50 66 66 72 L 72 95 L 28 95 Z" />
          {/* Floating Samosa near Motu */}
          <path d="M 80 20 L 92 40 L 68 40 Z" />
          <circle cx="80" cy="32" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* 2. Patlu with round spectacles - Top Right */}
      <div className="absolute top-16 right-8 sm:right-20 animate-float-reverse">
        <svg
          width="170"
          height="170"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Patlu's slender head */}
          <ellipse cx="50" cy="48" rx="20" ry="26" />
          {/* Patlu's iconic glasses */}
          <circle cx="42" cy="44" r="8" />
          <circle cx="58" cy="44" r="8" />
          <line x1="50" y1="44" x2="50" y2="44" />
          <line x1="34" y1="44" x2="28" y2="40" />
          <line x1="66" y1="44" x2="72" y2="40" />
          {/* Patlu's thin neck & collar */}
          <path d="M 44 74 L 44 86 M 56 74 L 56 86" />
          <path d="M 36 86 L 64 86 L 68 98 L 32 98 Z" />
          {/* Single strand hair */}
          <path d="M 50 22 Q 48 10 42 12" />
        </svg>
      </div>

      {/* 3. Mr. Bean's Quirky Face & Tie - Middle Left */}
      <div className="absolute top-1/3 -left-6 sm:left-12 animate-float-slow">
        <svg
          width="190"
          height="190"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Bean's expressive head & ears */}
          <circle cx="26" cy="46" r="6" />
          <circle cx="74" cy="46" r="6" />
          <path d="M 32 40 C 30 22 70 22 68 40 C 70 65 60 76 50 76 C 40 76 30 65 32 40 Z" />
          {/* Bean's big signature eyebrows */}
          <path d="M 37 32 Q 44 26 48 33" strokeWidth="2.5" />
          <path d="M 52 33 Q 56 26 63 32" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="43" cy="38" r="3" fill="currentColor" />
          <circle cx="57" cy="38" r="3" fill="currentColor" />
          {/* Bean's long sharp nose */}
          <path d="M 50 38 L 52 50 L 46 52" />
          {/* Bean's quirky side smirk */}
          <path d="M 42 60 Q 52 64 60 58" />
          {/* Skinny red tie */}
          <polygon points="50,76 46,92 50,98 54,92" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      {/* 4. Mr. Bean's Knitted Teddy Bear - Bottom Left */}
      <div className="absolute bottom-16 left-8 sm:left-24 animate-float-reverse">
        <svg
          width="160"
          height="160"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Teddy ears */}
          <circle cx="34" cy="30" r="7" />
          <circle cx="66" cy="30" r="7" />
          {/* Teddy stitched head */}
          <circle cx="50" cy="44" r="20" />
          {/* Button cross eyes */}
          <path d="M 41 38 L 45 42 M 45 38 L 41 42" strokeWidth="1.8" />
          <path d="M 55 38 L 59 42 M 59 38 L 55 42" strokeWidth="1.8" />
          {/* Stitched snout & nose */}
          <ellipse cx="50" cy="49" rx="6" ry="4" />
          <circle cx="50" cy="48" r="1.5" fill="currentColor" />
          {/* Body & knitted arms */}
          <path d="M 38 64 C 36 78 64 78 62 64 Z" />
          <path d="M 36 64 C 26 68 28 80 34 76" />
          <path d="M 64 64 C 74 68 72 80 66 76" />
        </svg>
      </div>

      {/* 5. College Notebook Object: Steaming Coffee Mug */}
      <div className="absolute top-28 left-1/3 animate-float-slow">
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Mug body */}
          <rect x="30" y="40" width="36" height="42" rx="6" />
          {/* Handle */}
          <path d="M 66 48 C 76 48 76 66 66 66" />
          {/* Steam ripples */}
          <path d="M 38 28 Q 40 22 38 16" />
          <path d="M 48 30 Q 50 20 48 12" />
          <path d="M 58 28 Q 60 22 58 16" />
        </svg>
      </div>

      {/* 6. College Notebook Object: Stack of Textbooks & Pencil */}
      <div className="absolute top-1/2 right-12 sm:right-28 animate-float-reverse">
        <svg
          width="130"
          height="130"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Book 1 (bottom) */}
          <rect x="20" y="68" width="60" height="14" rx="2" />
          <line x1="28" y1="68" x2="28" y2="82" />
          {/* Book 2 (middle) */}
          <rect x="24" y="52" width="52" height="14" rx="2" />
          <line x1="32" y1="52" x2="32" y2="66" />
          {/* Book 3 (top) */}
          <rect x="28" y="36" width="46" height="14" rx="2" />
          <line x1="36" y1="36" x2="36" y2="50" />
          {/* Pencil resting across */}
          <line x1="18" y1="30" x2="78" y2="70" strokeWidth="2.5" />
          <polygon points="18,30 14,26 22,26" fill="currentColor" />
        </svg>
      </div>

      {/* 7. College Notebook Object: Laptop with Code Symbols { } */}
      <div className="absolute bottom-28 right-1/4 animate-float-slow">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Laptop Screen */}
          <rect x="24" y="30" width="52" height="34" rx="3" />
          {/* Code brackets */}
          <path d="M 44 42 L 40 47 L 44 52" />
          <path d="M 56 42 L 60 47 L 56 52" />
          <line x1="52" y1="42" x2="48" y2="52" />
          {/* Keyboard base */}
          <polygon points="18,66 82,66 86,72 14,72" />
        </svg>
      </div>

      {/* 8. College Object: Big-O Complexity & Array Indices Doodle */}
      <div className="absolute bottom-10 right-8 sm:right-16 animate-float-reverse">
        <svg
          width="140"
          height="100"
          viewBox="0 0 100 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Array cells [ 0 | 1 | 2 ] */}
          <rect x="15" y="40" width="70" height="20" rx="3" />
          <line x1="38" y1="40" x2="38" y2="60" />
          <line x1="62" y1="40" x2="62" y2="60" />
          {/* O(1) scribble */}
          <text x="20" y="28" fill="currentColor" stroke="none" fontSize="14" fontFamily="monospace" fontWeight="bold">
            O(1)
          </text>
          <text x="60" y="28" fill="currentColor" stroke="none" fontSize="12" fontFamily="monospace">
            O(log N)
          </text>
        </svg>
      </div>

      {/* 9. Bean's Iconic Mini Car - Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-float-slow">
        <svg
          width="130"
          height="75"
          viewBox="0 0 100 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-100"
        >
          {/* Car roof and black hood */}
          <path d="M 24 30 L 34 14 L 66 14 L 76 30 Z" />
          {/* Car body */}
          <path d="M 12 30 L 88 30 L 92 44 L 8 44 Z" />
          {/* Wheels */}
          <circle cx="26" cy="44" r="8" />
          <circle cx="74" cy="44" r="8" />
          <circle cx="26" cy="44" r="3" fill="currentColor" />
          <circle cx="74" cy="44" r="3" fill="currentColor" />
          {/* Door lock padlock doodle */}
          <rect x="47" y="32" width="6" height="6" rx="1" />
          <path d="M 49 32 L 49 29 Q 50 27 51 29 L 51 32" />
        </svg>
      </div>
    </div>
  </div>
  );
};
