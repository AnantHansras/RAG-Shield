import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";

export default function SourcesPanel({ sources }) {
  const [open, setOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-1 w-full">
      <button
        type="button"
        className="flex items-center gap-1.5 border-none bg-transparent p-0 text-[12.5px] text-ink-faint hover:text-ink-soft"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Sources <span className="font-mono">· {sources.length} documents</span>
      </button>

      {open && (
        <div className="mt-2.5 flex flex-col gap-2">
          {sources.map((source) => {
            const isPoisoned = source.isPoisoned === true;

            return (
              <div
                className={`flex items-center justify-between gap-3 rounded-sm border px-3.5 py-2.5 ${
                  isPoisoned
                    ? "border-red-300 bg-surface"
                    : "border-border bg-surface"
                }`}
                key={source.id}
              >
                <div className="min-w-0">
                  <div
                    className={`mt-0.5 font-mono text-[11.5px] ${
                      isPoisoned
                        ? "text-red-400"
                        : "text-ink-faint"
                    }`}
                  >
                    {source.content}
                  </div>
                </div>

                <div
                  className={`flex-shrink-0 font-mono text-[13px] ${
                    isPoisoned
                      ? "text-red-600"
                      : "text-accent-ink"
                  }`}
                >
                  {source.score.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}