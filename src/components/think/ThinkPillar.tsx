import React, { useState } from 'react';
import { CodingFlow } from './CodingFlow';
import { NudgeLadder } from './NudgeLadder';
import { RubberDuckPad } from './RubberDuckPad';
import { PersonalMessage } from '../common/PersonalMessage';
import { Brain, Cpu, Sparkles, Shield, Layers, Code, HeartHandshake } from 'lucide-react';

export const ThinkPillar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coding-flow' | 'patterns' | 'duck' | 'gemma-hook'>('coding-flow');
  const [gemmaPromptInput, setGemmaPromptInput] = useState('');
  const [gemmaSimulatedResponse, setGemmaSimulatedResponse] = useState<string | null>(null);

  const handleGemmaQueryPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gemmaPromptInput.trim()) return;

    setGemmaSimulatedResponse(
      `[AICompanionService / Gemma v2 Interface Hook] - Query for "${gemmaPromptInput}" intercepted. When connected in Stage 2, Gemma will execute with system directive: "NUDGE, DON'T REPLACE. Formulate a Socratic invariant check. Never write the answer code."`
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Think Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                THINK / Coding Mode
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                &ldquo;Nudge, Don&apos;t Replace.&rdquo; • Step-by-step discovery without spoon-fed answers
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('coding-flow')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'coding-flow'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Coding Companion</span>
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'patterns'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Pattern Bank</span>
          </button>
          <button
            onClick={() => setActiveTab('duck')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'duck'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🦆</span>
            <span>Rubber Duck</span>
          </button>
          <button
            onClick={() => setActiveTab('gemma-hook')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'gemma-hook'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5 text-sky-400" />
            <span>Gemma Service</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'coding-flow' && <CodingFlow />}
      {activeTab === 'patterns' && <NudgeLadder />}
      {activeTab === 'duck' && <RubberDuckPad />}
      {activeTab === 'gemma-hook' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AICompanionService Interface</h3>
                <p className="text-xs text-slate-400">Clean abstraction for Gemma integration</p>
              </div>
            </div>

            <span className="rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs font-semibold text-sky-300">
              Ready for Gemma Integration
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-400" />
              Defined Companion Interface:
            </p>
            <pre className="p-3 bg-slate-900 rounded-lg text-slate-300 text-xs overflow-x-auto font-mono border border-slate-800">
{`export interface AICompanionService {
  getNudge(problem: string, level: number, state: string): Promise<string>;
  getQuestion(problem: string, context: string): Promise<string>;
  getHint(problem: string, level: number): Promise<string>;
  getSyntaxHelp(language: CodingLanguage, concept: string): Promise<string>;
  getReset(): Promise<string>;
  getCelebration(): Promise<string>;
}`}
            </pre>
          </div>

          <form onSubmit={handleGemmaQueryPreview} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Simulate AI Companion Request:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={gemmaPromptInput}
                onChange={(e) => setGemmaPromptInput(e.target.value)}
                placeholder="e.g. How to expand the sliding window in LeetCode 209..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Test Service Hook</span>
              </button>
            </div>
          </form>

          {gemmaSimulatedResponse && (
            <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10 text-xs sm:text-sm text-sky-200">
              {gemmaSimulatedResponse}
            </div>
          )}
        </div>
      )}

      {/* User's Curated LeetCode Mode Messages Section */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <HeartHandshake className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Messages I Wrote For You (LeetCode Mode 🧠)
            </span>
          </div>
          <span className="text-xs text-slate-400">
            #Best Buddy Ever
          </span>
        </div>
        <PersonalMessage initialCategory="leetcode-mode" />
      </div>
    </div>
  );
};
