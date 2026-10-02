import React, { useState } from 'react';
import type { CodingLanguage } from '../../types';
import { SYNTAX_SNIPPETS } from '../../data/syntaxData';
import { Copy, Check, Code2, Cpu, ShieldAlert } from 'lucide-react';

interface SyntaxRescueProps {
  currentLanguage: CodingLanguage;
  onLanguageChange: (lang: CodingLanguage) => void;
}

export const SyntaxRescue: React.FC<SyntaxRescueProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(
    SYNTAX_SNIPPETS[currentLanguage][0]?.id || ''
  );

  const snippets = SYNTAX_SNIPPETS[currentLanguage] || [];
  const activeSnippet =
    snippets.find((s) => s.id === selectedSnippetId) || snippets[0];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const languages: CodingLanguage[] = ['Java', 'Python', 'C++', 'JavaScript'];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
      {/* Header with user tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h3 className="text-lg font-bold text-white">Syntax Rescue</h3>
            <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
              #Best Buddy Ever
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-amber-400">
            &ldquo;I know the algorithm. {currentLanguage} is bullying me.&rdquo;
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Don&apos;t let compiler tantrums shake your confidence in the logic.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onLanguageChange(lang);
                setSelectedSnippetId(SYNTAX_SNIPPETS[lang][0]?.id || '');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLanguage === lang
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Picker Pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {snippets.map((snip) => (
          <button
            key={snip.id}
            onClick={() => setSelectedSnippetId(snip.id)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium border transition-all ${
              snip.id === activeSnippet?.id
                ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-sm'
                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            {snip.name}
          </button>
        ))}
      </div>

      {/* Code Display Area */}
      {activeSnippet && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-amber-400" />
              {activeSnippet.name} ({currentLanguage})
            </span>
            <button
              onClick={() => handleCopy(activeSnippet.code, activeSnippet.id)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              {copiedId === activeSnippet.id ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Template</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
            <pre>{activeSnippet.code}</pre>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-xs text-slate-300">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-amber-300 font-semibold">Pro Tip: </strong>
              {activeSnippet.explanation}
            </span>
          </div>
        </div>
      )}

      {/* Gemma v2 Stage 2 Bridge Notice */}
      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-sky-400" />
          <span>Future Gemma Integration Hook: Instant compiler syntax explanation without solving the problem for you.</span>
        </div>
        <span className="font-mono text-slate-400">Stage 2 Ready</span>
      </div>
    </div>
  );
};
