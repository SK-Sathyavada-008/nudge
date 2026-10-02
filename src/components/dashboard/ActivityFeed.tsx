import React from 'react';
import { useNudge } from '../../context/NudgeContext';
import { Activity, Brain, Flame, Sparkles, Trophy, History } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const { activities } = useNudge();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'think':
        return <Brain className="h-4 w-4 text-indigo-400" />;
      case 'reset':
        return <Flame className="h-4 w-4 text-emerald-400" />;
      case 'play':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case 'tiny-win':
        return <Trophy className="h-4 w-4 text-sky-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            <p className="text-xs text-slate-400">Your study journey logs</p>
          </div>
        </div>

        <span className="text-xs text-slate-400">
          {activities.length} events logged
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No activity yet. Start by taking a nudge or claiming a tiny win!
          </p>
        ) : (
          activities.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
                  {getActivityIcon(item.type)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </h4>
                  {item.detail && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>

              <span className="shrink-0 text-[10px] text-slate-400 font-mono">
                {item.timestamp}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
