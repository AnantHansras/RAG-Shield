import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, UploadCloud, FileText, X } from "lucide-react";
import { MODES } from "../data/modes.js";
import { evaluateSystem } from "../api/evaluate.js";

export default function SystemEvaluation() {
  const [mode, setMode] = useState("normal");
  const [fileName, setFileName] = useState(null);
  const [queries, setQueries] = useState([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const canRun = queries.length > 0 && !running;

  const parseFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.replace(/^"|"$/g, "").trim())
        .filter(Boolean);
      setQueries(lines);
      setFileName(file.name);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    parseFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    parseFile(e.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFileName(null);
    setQueries([]);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRun = async (e) => {
    e.preventDefault();
    if (!canRun) return;
    setRunning(true);
    setResult(null);
    try {
      const data = await evaluateSystem({ mode, queries });
      setResult(data);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-[720px] px-7">
        <div className="pb-6 pt-10">
          <Link to="/" className="mb-4 flex w-fit items-center gap-1.5 text-[13px] text-ink-soft no-underline hover:text-ink">
            <ArrowLeft size={13} /> Home
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">System Evaluation</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            Run a batch of queries against a RAG configuration and measure overall performance.
          </p>
        </div>

        <form onSubmit={handleRun}>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-medium text-ink" htmlFor="evalMode">
              Defense
            </label>
            <select
              id="evalMode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="appearance-none rounded-sm border border-border-strong bg-surface bg-no-repeat py-1.5 pl-3 pr-7 text-[13.5px] text-ink focus:border-accent focus:outline-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23a6a299' stroke-width='1.4' fill='none' fill-rule='evenodd'/></svg>\")",
                backgroundPosition: "right 11px center",
              }}
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id} disabled={m.status !== "available"}>
                  {m.name}
                  {m.status !== "available" ? " (Coming Soon)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-medium text-ink">
              Queries <span className="ml-1.5 text-xs font-normal text-ink-faint">.txt or .csv, one query per line</span>
            </label>

            {!fileName ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-md border border-dashed px-6 py-10 text-center transition-colors ${
                  dragActive ? "border-accent bg-accent/10" : "border-border-strong bg-surface hover:border-accent"
                }`}
              >
                <UploadCloud size={22} className="text-ink-faint" />
                <div className="text-sm text-ink-soft">
                  <span className="font-medium text-accent-ink">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-ink-faint">Handles files with thousands of queries</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-md border border-border-strong bg-surface px-4 py-3.5">
                <div className="flex items-center gap-2.5 text-sm text-ink">
                  <FileText size={16} className="text-accent-ink" />
                  <span className="font-medium">{fileName}</span>
                  <span className="text-ink-faint">· {queries.length} queries loaded</span>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="flex h-6 w-6 items-center justify-center rounded-sm text-ink-faint hover:bg-surface-raised hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!canRun}
            className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Run Evaluation {queries.length > 0 && `(${queries.length})`}
          </button>
        </form>

        {running && (
          <div className="flex items-center gap-2.5 py-4 text-[13.5px] text-ink-soft">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
            Evaluating {queries.length} queries…
          </div>
        )}

        {result && (
          <div className="mt-11 border-t border-border pt-9">
            <h2 className="mb-1 text-lg font-semibold text-ink">Evaluation Results</h2>
            <p className="mb-6 text-[13.5px] text-ink-soft">
              Aggregate metrics across {result.totalQueries} queries.
            </p>

            <div className="mb-7 grid grid-cols-3 gap-3.5 max-[860px]:grid-cols-2">
              <MetricCard label="F1 Score" value={result.f1} />
              <MetricCard label="Precision" value={result.precision} />
              <MetricCard label="Recall" value={result.recall} />
              <MetricCard label="ASR" value={result.asr} tone="danger" />
            </div>

            <div className="max-h-96 overflow-y-auto rounded-md border border-border bg-surface">
              <div className="sticky top-0 grid grid-cols-[1fr_140px] gap-3 border-b border-border bg-surface-sunken px-3.5 py-2.5 text-[11.5px] uppercase tracking-wide text-ink-faint">
                <span>Query</span>
                <span>Answer</span>
              </div>
              {result.perQuery.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[1fr_140px] items-center gap-3 border-b border-border px-3.5 py-2.5 text-[13px] last:border-b-0"
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-ink">{row.query}</span>
                  <span
                    className={`flex items-center gap-1.5 text-[12.5px] ${
                      row.correct ? "text-success" : "text-danger"
                    }`}
                  >
                    {row.correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {row.correct ? "Correct" : "Incorrect"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <div
      className={`rounded-md border p-4 ${
        tone === "danger" ? "border-danger/30 bg-danger/10" : "border-border bg-surface"
      }`}
    >
      <div className="mb-2 text-xs text-ink-faint">{label}</div>
      <div className={`font-mono text-[22px] font-medium ${tone === "danger" ? "text-danger" : "text-ink"}`}>
        {(value * 100).toFixed(1)}%
      </div>
    </div>
  );
}
